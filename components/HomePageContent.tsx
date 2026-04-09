'use client';

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n";
import {
  getLocalizedArticleTitle,
  getLocalizedArticleSummary,
  getLocalizedNewspaperName,
  getLocalizedNewspaperRegion,
  MultilingualArticle,
  MultilingualNewspaper
} from "@/lib/localization";

interface HomePageContentProps {
  featuredArticle: MultilingualArticle | null;
  articles: MultilingualArticle[];
  newspapers: MultilingualNewspaper[];
  featuredError: any;
  articlesError: any;
  newspapersError: any;
}

export default function HomePageContent({
  featuredArticle,
  articles,
  newspapers,
  featuredError,
  articlesError,
  newspapersError
}: HomePageContentProps) {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        {featuredArticle?.main_image_url && (
          <div className="absolute inset-0">
            <img
              src={featuredArticle.main_image_url}
              alt={getLocalizedArticleTitle(featuredArticle, language)}
              className="w-full h-full object-cover scale-105 transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 container-editorial py-20">
          <div className="max-w-4xl">
            <div className="mb-6">
              <span className="badge-premium">Featured Article</span>
            </div>

            {featuredArticle ? (
              <>
                <h1 className="display-xl text-white mb-6 leading-tight">
                  {getLocalizedArticleTitle(featuredArticle, language)}
                </h1>
                <p className="text-xl text-neutral-200 mb-8 leading-relaxed max-w-2xl">
                  {getLocalizedArticleSummary(featuredArticle, language) || "Discover the latest insights and stories from trusted sources."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/article/${featuredArticle.slug}`}
                    className="btn-primary bg-[#1FC3D6] hover:bg-[#0d9488] text-white px-8 py-4 text-lg shadow-lg"
                  >
                    {t('hero.read_article', language)}
                  </Link>
                  <Link
                    href="/articles"
                    className="btn-ghost border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
                  >
                    {t('hero.view_all_newspapers', language)}
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center">
                <h1 className="display-xl text-white mb-6">Gazetagram</h1>
                <p className="text-xl text-neutral-200 mb-8">A modern digital newspaper platform</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-20 bg-neutral-50/50">
        <div className="container-editorial">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              {t('hero.latest_articles', language)}
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Stay informed with the most recent stories and insights from trusted sources across Uzbekistan.
            </p>
          </div>

          {articlesError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center">
              <p className="text-base sm:text-lg font-semibold text-red-800 mb-2">{t('articles.loading_error', language)}</p>
              <p className="text-red-700">{articlesError.message}</p>
            </div>
          ) : !articles || articles.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-12 text-center shadow-md">
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
        </div>
      </section>

      {/* Featured Newspapers Section */}
      <section className="py-20 bg-white">
        <div className="container-editorial">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              {t('hero.featured_newspapers', language)}
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover Uzbekistan's most trusted newspapers and news sources, each bringing unique perspectives to the stories that matter.
            </p>
          </div>

          {newspapersError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center">
              <p className="text-base sm:text-lg font-semibold text-red-800 mb-2">{t('newspapers.loading_error', language)}</p>
              <p className="text-red-700">{newspapersError.message}</p>
            </div>
          ) : !newspapers || newspapers.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-12 text-center shadow-md">
              <p className="text-neutral-600">{t('newspapers.no_newspapers', language)}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newspapers.map((newspaper) => (
                <article key={newspaper.id} className="card-premium group">
                  <div className="aspect-video bg-gradient-to-br from-[#1FC3D6]/10 to-[#0d9488]/10 rounded-t-2xl flex items-center justify-center p-8">
                    {newspaper.logo_url ? (
                      <img
                        src={newspaper.logo_url}
                        alt={getLocalizedNewspaperName(newspaper, language)}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-4xl font-bold text-[#1FC3D6]">
                        {getLocalizedNewspaperName(newspaper, language).charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 group-hover:text-[#1FC3D6] transition-premium mb-2">
                      {getLocalizedNewspaperName(newspaper, language)}
                    </h3>
                    {getLocalizedNewspaperRegion(newspaper, language) && (
                      <p className="text-sm text-neutral-600 mb-4">
                        {getLocalizedNewspaperRegion(newspaper, language)}
                      </p>
                    )}
                    <Link
                      href={`/newspaper/${newspaper.slug}`}
                      className="text-sm font-semibold text-[#1FC3D6] hover:text-[#0d9488] transition-premium"
                    >
                      {t('view_more', language)} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}