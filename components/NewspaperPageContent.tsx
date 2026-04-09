'use client';

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n";
import {
  getLocalizedNewspaperName,
  getLocalizedNewspaperDescription,
  getLocalizedNewspaperRegion,
  getLocalizedArticleTitle,
  getLocalizedArticleSummary,
  MultilingualNewspaper,
  MultilingualArticle
} from "@/lib/localization";

interface NewspaperPageContentProps {
  newspaper: MultilingualNewspaper;
  articles: MultilingualArticle[];
}

export default function NewspaperPageContent({ newspaper, articles }: NewspaperPageContentProps) {
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
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        {newspaper.banner_url && (
          <div className="absolute inset-0">
            <img
              src={newspaper.banner_url}
              alt={getLocalizedNewspaperName(newspaper, language)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent"></div>
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
                  <Link href="/newspapers" className="hover:text-white transition-colors">
                    {t('nav.newspapers', language)}
                  </Link>
                </li>
              </ol>
            </nav>

            {/* Newspaper Title */}
            <div className="flex items-center gap-6 mb-6">
              {newspaper.logo_url && (
                <img
                  src={newspaper.logo_url}
                  alt={getLocalizedNewspaperName(newspaper, language)}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              )}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
                  {getLocalizedNewspaperName(newspaper, language)}
                </h1>
                {getLocalizedNewspaperRegion(newspaper, language) && (
                  <p className="text-xl text-neutral-200">
                    {getLocalizedNewspaperRegion(newspaper, language)}
                  </p>
                )}
              </div>
            </div>

            {/* Newspaper Meta */}
            <div className="flex flex-wrap items-center gap-6 text-neutral-200 mb-8">
              {newspaper.founded_year && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{t('newspaper.founded', language)} {newspaper.founded_year}</span>
                </div>
              )}
              {articles.length > 0 && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <span>{articles.length} {t('newspaper.articles', language).toLowerCase()}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {getLocalizedNewspaperDescription(newspaper, language) && (
              <div className="max-w-2xl">
                <p className="text-lg text-neutral-200 leading-relaxed">
                  {getLocalizedNewspaperDescription(newspaper, language)}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="container-editorial py-16">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            {t('newspaper.articles', language)}
          </h2>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-12 text-center">
            <p className="text-neutral-600">{t('articles.no_articles', language)}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article.id} className="card-premium group">
                {article.main_image_url && (
                  <div className="aspect-video overflow-hidden rounded-t-2xl">
                    <img
                      src={article.main_image_url}
                      alt={getLocalizedArticleTitle(article, language)}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-neutral-900 group-hover:text-[#1FC3D6] transition-premium mb-3 leading-tight line-clamp-2">
                    {getLocalizedArticleTitle(article, language)}
                  </h3>
                  {getLocalizedArticleSummary(article, language) && (
                    <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {getLocalizedArticleSummary(article, language)}
                    </p>
                  )}
                  {article.created_at && (
                    <p className="text-xs text-neutral-500 mb-4">
                      {formatDate(article.created_at)}
                    </p>
                  )}
                  <Link
                    href={`/article/${article.slug}`}
                    className="text-sm font-semibold text-[#1FC3D6] hover:text-[#0d9488] transition-premium"
                  >
                    {t('hero.read_article', language)} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Back to Newspapers */}
      <section className="py-16">
        <div className="container-editorial text-center">
          <Link
            href="/newspapers"
            className="btn-ghost text-[#1FC3D6] hover:text-[#0d9488] font-semibold"
          >
            ← {t('nav.newspapers', language)}
          </Link>
        </div>
      </section>
    </main>
  );
}