'use client';

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n";
import {
  getLocalizedArticleTitle,
  getLocalizedArticleSummary,
  getLocalizedArticleContent,
  getLocalizedNewspaperName,
  MultilingualArticle,
  MultilingualNewspaper
} from "@/lib/localization";
import ShareButton from "@/components/ShareButton";
import { readingTime } from "@/lib/readingTime";

interface ArticlePageContentProps {
  article: MultilingualArticle;
  newspaper: MultilingualNewspaper | null;
  relatedArticles: MultilingualArticle[];
}

export default function ArticlePageContent({ article, newspaper, relatedArticles }: ArticlePageContentProps) {
  const { language } = useLanguage();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(
      language === 'ru' ? 'ru-RU' :
      language === 'en' ? 'en-US' :
      'uz-UZ',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    );
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {article.main_image_url && (
          <div className="absolute inset-0">
            <img
              src={article.main_image_url}
              alt={getLocalizedArticleTitle(article, language)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
        )}

        <div className="relative z-10 container-editorial py-20">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-sm text-neutral-300">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    {t('nav.home', language)}
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2">/</span>
                  <Link href="/articles" className="hover:text-white transition-colors">
                    {t('nav.articles', language)}
                  </Link>
                </li>
                {newspaper && (
                  <li className="flex items-center">
                    <span className="mx-2">/</span>
                    <Link
                      href={`/newspaper/${newspaper.slug}`}
                      className="hover:text-white transition-colors"
                    >
                      {getLocalizedNewspaperName(newspaper, language)}
                    </Link>
                  </li>
                )}
              </ol>
            </nav>

            {/* Article Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {getLocalizedArticleTitle(article, language)}
            </h1>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-neutral-200 mb-8">
              {article.created_at && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{t('article.published', language)} {formatDate(article.created_at)}</span>
                </div>
              )}

              {article.content && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{readingTime(article.content)} {t('articles.reading_time', language)}</span>
                </div>
              )}
            </div>

            {/* Share Button */}
            <div className="flex gap-4">
              <ShareButton
                title={getLocalizedArticleTitle(article, language)}
                url={`${typeof window !== 'undefined' ? window.location.origin : ''}/article/${article.slug}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="container-editorial py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {getLocalizedArticleSummary(article, language) && (
                <div className="mb-8 p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    {getLocalizedArticleSummary(article, language)}
                  </p>
                </div>
              )}

              {getLocalizedArticleContent(article, language) ? (
                <div
                  className="prose prose-lg max-w-none prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-a:text-[#1FC3D6] prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: getLocalizedArticleContent(article, language)! }}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-neutral-600">{t('not_found', language)}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Author Info */}
              {article.author_name && (
                <div className="card-premium mb-8">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t('article.author', language)}</h3>
                  <div className="flex items-start gap-4">
                    {article.author_image_url && (
                      <img
                        src={article.author_image_url}
                        alt={article.author_name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <h4 className="font-semibold text-neutral-900">{article.author_name}</h4>
                      {article.author_role && (
                        <p className="text-sm text-neutral-600">{article.author_role}</p>
                      )}
                      {article.author_bio && (
                        <p className="text-sm text-neutral-600 mt-2">{article.author_bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Newspaper Info */}
              {newspaper && (
                <div className="card-premium">
                  <Link
                    href={`/newspaper/${newspaper.slug}`}
                    className="block group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {newspaper.logo_url && (
                        <img
                          src={newspaper.logo_url}
                          alt={getLocalizedNewspaperName(newspaper, language)}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-neutral-900 group-hover:text-[#1FC3D6] transition-premium">
                          {getLocalizedNewspaperName(newspaper, language)}
                        </h4>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-neutral-50/50 py-16">
          <div className="container-editorial">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-12 text-center">
              {t('article.related_articles', language)}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <article key={relatedArticle.id} className="card-premium group">
                  {relatedArticle.main_image_url && (
                    <div className="aspect-video overflow-hidden rounded-t-2xl">
                      <img
                        src={relatedArticle.main_image_url}
                        alt={getLocalizedArticleTitle(relatedArticle, language)}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 group-hover:text-[#1FC3D6] transition-premium mb-3 leading-tight line-clamp-2">
                      {getLocalizedArticleTitle(relatedArticle, language)}
                    </h3>
                    {getLocalizedArticleSummary(relatedArticle, language) && (
                      <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {getLocalizedArticleSummary(relatedArticle, language)}
                      </p>
                    )}
                    <Link
                      href={`/article/${relatedArticle.slug}`}
                      className="text-sm font-semibold text-[#1FC3D6] hover:text-[#0d9488] transition-premium"
                    >
                      {t('hero.read_article', language)} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Articles */}
      <section className="py-16">
        <div className="container-editorial text-center">
          <Link
            href="/articles"
            className="btn-ghost text-[#1FC3D6] hover:text-[#0d9488] font-semibold"
          >
            ← {t('article.back_to_articles', language)}
          </Link>
        </div>
      </section>
    </main>
  );
}