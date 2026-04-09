import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  main_image_url: string | null;
  created_at: string | null;
};

type Newspaper = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  banner_url: string | null;
  region: string | null;
};

async function getFeaturedArticle() {
  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,summary,main_image_url,created_at")
    .not("main_image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(1);

  return { data: data?.[0] || null, error };
}

async function getLatestArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,summary,main_image_url,created_at")
    .order("created_at", { ascending: false })
    .limit(6);

  return { data, error };
}

async function getNewspapers() {
  const { data, error } = await supabase
    .from("newspapers")
    .select("id,slug,name,logo_url,banner_url,region")
    .limit(6);

  return { data, error };
}

export default async function Home() {
  const { data: featuredArticle, error: featuredError } = await getFeaturedArticle();
  const { data: articles, error: articlesError } = await getLatestArticles();
  const { data: newspapers, error: newspapersError } = await getNewspapers();

  return (
    <main className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        {featuredArticle?.main_image_url && (
          <div className="absolute inset-0">
            <img
              src={featuredArticle.main_image_url}
              alt={featuredArticle.title}
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
                  {featuredArticle.title}
                </h1>
                <p className="text-xl text-neutral-200 mb-8 leading-relaxed max-w-2xl">
                  {featuredArticle.summary || "Discover the latest insights and stories from trusted sources."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/article/${featuredArticle.slug}`}
                    className="btn-primary bg-[#1FC3D6] hover:bg-[#0d9488] text-white px-8 py-4 text-lg shadow-lg"
                  >
                    Maqolani o'qish
                  </Link>
                  <Link
                    href="/articles"
                    className="btn-ghost border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
                  >
                    Barcha maqolalar
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="display-xl text-white mb-6 leading-tight">
                  Gazetagram
                </h1>
                <p className="text-xl text-neutral-200 mb-8 leading-relaxed max-w-2xl">
                  O'zbekistonning eng ishonchli manbalaridan so'nggi yangiliklar va hikoyalarni o'qing.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/articles"
                    className="btn-primary bg-[#1FC3D6] hover:bg-[#0d9488] text-white px-8 py-4 text-lg shadow-lg"
                  >
                    Maqolalarni ko'rish
                  </Link>
                  <Link
                    href="/newspapers"
                    className="btn-ghost border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
                  >
                    Gazetalarni kashf qilish
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container-editorial">
          <div className="mb-16 text-center">
            <h2 className="heading-xl text-neutral-900 mb-4">So'nggi maqolalar</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Eng yangi hikoyalar bilan xabardor bo'ling
            </p>
          </div>

          {articlesError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center">
              <p className="text-base sm:text-lg font-semibold text-red-800 mb-2">Maqolalarni yuklab bo'lmadi</p>
              <p className="text-red-700">{articlesError.message}</p>
            </div>
          ) : !articles || articles.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-md">
              <p className="text-neutral-600">Hozircha maqolalar mavjud emas</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.slice(0, 6).map((article, index) => {
                if (!article.slug) {
                  console.warn(`[Homepage Articles] Skipping article with missing slug: id=${article.id}, title=${article.title}`);
                  return null;
                }

                const isLarge = index === 0; // First article is featured

                return (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className={`group block ${isLarge ? 'md:col-span-2 lg:col-span-2' : ''}`}
                  >
                    <article className={`card-premium ${isLarge ? 'card-premium-lg' : ''} overflow-hidden`}>
                      {article.main_image_url && (
                        <div className={`relative overflow-hidden ${isLarge ? 'h-64' : 'h-48'}`}>
                          <img
                            src={article.main_image_url}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      )}

                      <div className={`p-6 ${isLarge ? 'p-8' : ''}`}>
                        <div className="mb-3">
                          <span className="badge-secondary">Maqola</span>
                        </div>

                        <h3 className={`font-bold text-neutral-900 group-hover:text-[#1FC3D6] transition-premium line-clamp-2 ${isLarge ? 'text-xl' : 'text-lg'}`}>
                          {article.title}
                        </h3>

                        <p className={`mt-3 text-neutral-600 line-clamp-2 ${isLarge ? 'text-base' : 'text-sm'}`}>
                          {article.summary ?? "Qisqacha mazmun mavjud emas"}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <time className="text-xs text-neutral-500 font-medium">
                            {article.created_at
                              ? new Date(article.created_at).toLocaleDateString('uz-UZ', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              : "Noma'lum sana"}
                          </time>
                          <span className="text-xs text-[#1FC3D6] font-medium group-hover:translate-x-1 transition-transform duration-200">
                            O'qish →
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link
              href="/articles"
              className="btn-ghost text-[#1FC3D6] hover:text-[#0d9488] font-semibold"
            >
              Barcha maqolalarni ko'rish →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Newspapers Section */}
      <section className="py-20 bg-white">
        <div className="container-editorial">
          <div className="mb-16 text-center">
            <h2 className="heading-xl text-neutral-900 mb-4">Tanlangan gazetalar</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Ishonchli yangilik manbalaridan o'qing
            </p>
          </div>

          {newspapersError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center">
              <p className="text-base sm:text-lg font-semibold text-red-800 mb-2">Gazetalarni yuklab bo'lmadi</p>
              <p className="text-red-700">{newspapersError.message}</p>
            </div>
          ) : !newspapers || newspapers.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-12 text-center shadow-md">
              <p className="text-neutral-600">Hozircha gazetalar mavjud emas</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {newspapers.map((newspaper) => {
                if (!newspaper.slug) {
                  return (
                    <div
                      key={newspaper.id}
                      className="card-premium overflow-hidden opacity-75"
                    >
                      {/* Banner */}
                      <div className="h-40 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-t-xl">
                        {newspaper.banner_url ? (
                          <img
                            src={newspaper.banner_url}
                            alt={newspaper.name}
                            className="h-full w-full object-cover rounded-t-xl"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-t-xl" />
                        )}
                      </div>

                      {/* Logo - Overlapping */}
                      <div className="absolute top-28 left-6">
                        {newspaper.logo_url ? (
                          <div className="h-20 w-20 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                            <img
                              src={newspaper.logo_url}
                              alt={newspaper.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-20 w-20 rounded-full border-4 border-white bg-neutral-100 shadow-md flex items-center justify-center">
                            <span className="text-sm font-bold text-neutral-500">
                              {newspaper.name.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 pt-12">
                        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2">{newspaper.name}</h3>
                        {newspaper.region && (
                          <p className="text-sm text-neutral-600 font-medium">{newspaper.region}</p>
                        )}
                        <p className="text-xs text-neutral-500 mt-2">Gazeta mavjud emas</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={newspaper.id}
                    href={`/newspaper/${newspaper.slug}`}
                    className="group block"
                  >
                    <article className="card-premium overflow-hidden hover-lift">
                      {/* Banner */}
                      <div className="h-40 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-t-xl overflow-hidden">
                        {newspaper.banner_url ? (
                          <img
                            src={newspaper.banner_url}
                            alt={newspaper.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-[#1FC3D6]/20 to-[#0d9488]/20 rounded-t-xl" />
                        )}
                      </div>

                      {/* Logo - Overlapping */}
                      <div className="absolute top-28 left-6">
                        {newspaper.logo_url ? (
                          <div className="h-20 w-20 rounded-full border-4 border-white bg-white shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-110">
                            <img
                              src={newspaper.logo_url}
                              alt={newspaper.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-20 w-20 rounded-full border-4 border-white bg-neutral-100 shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                            <span className="text-sm font-bold text-neutral-500">
                              {newspaper.name.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 pt-12">
                        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 group-hover:text-[#1FC3D6] transition-premium mb-2">
                          {newspaper.name}
                        </h3>
                        {newspaper.region && (
                          <p className="text-sm text-neutral-600 font-medium">{newspaper.region}</p>
                        )}
                        <div className="mt-4 flex items-center text-xs text-[#1FC3D6] font-medium">
                          <span>Kashf qilish</span>
                          <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link
              href="/newspapers"
              className="btn-ghost text-[#1FC3D6] hover:text-[#0d9488] font-semibold"
            >
              Barcha gazetalarni ko'rish →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}