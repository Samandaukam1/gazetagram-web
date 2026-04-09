'use client';

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n";
import { getLocalizedNewspaperName, getLocalizedNewspaperDescription, getLocalizedNewspaperRegion, MultilingualNewspaper } from "@/lib/localization";

interface NewspapersPageContentProps {
  newspapers: MultilingualNewspaper[];
  error: any;
}

export default function NewspapersPageContent({ newspapers, error }: NewspapersPageContentProps) {
  const { language } = useLanguage();

  if (error) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container-editorial py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6">{t('newspapers.page_title', language)}</h1>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
              <p className="text-base sm:text-lg font-semibold text-red-800 mb-2">{t('newspapers.loading_error', language)}</p>
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

  if (!newspapers || newspapers.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container-editorial py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6">{t('newspapers.page_title', language)}</h1>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-12">
              <p className="text-neutral-600">{t('newspapers.no_newspapers', language)}</p>
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6">{t('newspapers.page_title', language)}</h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              {t('newspapers.page_description', language)}
            </p>
          </div>
        </div>
      </section>

      {/* Newspapers Grid */}
      <section className="container-editorial py-16">
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
                <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 group-hover:text-[#1FC3D6] transition-premium mb-2">
                  {getLocalizedNewspaperName(newspaper, language)}
                </h2>
                {getLocalizedNewspaperDescription(newspaper, language) && (
                  <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {getLocalizedNewspaperDescription(newspaper, language)}
                  </p>
                )}
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
      </section>
    </main>
  );
}