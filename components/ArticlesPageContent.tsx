'use client';

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n";
import { getLocalizedArticleTitle, getLocalizedArticleSummary, MultilingualArticle } from "@/lib/localization";
import { readingTime } from "@/lib/readingTime";

interface ArticlesPageContentProps {
  articles: MultilingualArticle[];
  error: any;
}

export default function ArticlesPageContent({ articles, error }: ArticlesPageContentProps) {
  const { language } = useLanguage();

  if (error) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container-editorial py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6">{t('articles.page_title', language)}</h1>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
              <p className="text-base sm:text-lg font-semibold text-red-800 mb-2">{t('articles.loading_error', language)}</p>
              <p className="text-red-700">{error.message}</p>
            </div>
            <Link href="/" className="mt-8 btn-ghost text-[#1FC3D6] hover:text-[#0d9488]">
              ← {t('article.back_to_articles', language)}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container-editorial py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6">{t('articles.page_title', language)}</h1>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-12">
              <p className="text-neutral-600">{t('articles.no_articles', language)}</p>
            </div>
            <Link href="/" className="mt-8 btn-ghost text-[#1FC3D6] hover:text-[#0d9488]">
              ← {t('article.back_to_articles', language)}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="border-b border-neutral-200/50 bg-neutral-50/50">
        <div className="container-editorial py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6">{t('articles.page_title', language)}</h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              {t('articles.page_description', language)}
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="container-editorial py-16">
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900">{t('articles.all_articles', language)}</h2>
        </div>

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
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <span>{readingTime(article.content || '')} {t('articles.reading_time', language)}</span>
                  <Link
                    href={`/article/${article.slug}`}
                    className="text-[#1FC3D6] hover:text-[#0d9488] font-medium transition-premium"
                  >
                    {t('hero.read_article', language)} →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}