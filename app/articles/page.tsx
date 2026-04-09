import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { readingTime } from "@/lib/readingTime";

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  main_image_url: string | null;
  created_at: string | null;
  newspaper_id: string | null;
};

async function getArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,summary,content,main_image_url,created_at,newspaper_id")
    .order("created_at", { ascending: false })
    .limit(50);

  return { data, error };
}

export default async function ArticlesPage() {
  const { data: articles, error } = await getArticles();

  if (error) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container-editorial py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="heading-xl text-neutral-900 mb-4">Maqolalar</h1>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
              <p className="text-base sm:text-lg font-semibold text-red-800 mb-2">Maqolalarni yuklab bo'lmadi</p>
              <p className="text-red-700">{error.message}</p>
            </div>
            <Link href="/" className="mt-8 btn-ghost text-[#1FC3D6] hover:text-[#0d9488]">
              ← Bosh sahifaga qaytish
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
            <h1 className="heading-xl text-neutral-900 mb-4">Maqolalar</h1>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-12">
              <p className="text-neutral-600">Hozircha maqolalar mavjud emas</p>
            </div>
            <Link href="/" className="mt-8 btn-ghost text-[#1FC3D6] hover:text-[#0d9488]">
              ← Bosh sahifaga qaytish
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Separate featured article (first one) from the rest
  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="border-b border-neutral-200/50 bg-neutral-50/50">
        <div className="container-editorial py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6">Maqolalar</h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              O'zbekistonning eng ishonchli manbalaridan so'nggi yangiliklar va hikoyalarni kashf qiling
            </p>
          </div>
        </div>
      </section>

      <div className="container-editorial py-16">
        {/* Featured Article */}
        {featuredArticle && featuredArticle.slug && (
          <section className="mb-20">
            <div className="mb-8">
              <span className="badge-premium">Tanlangan maqola</span>
            </div>

            <Link
              href={`/article/${featuredArticle.slug}`}
              className="group block"
            >
              <article className="card-premium-lg overflow-hidden">
                {featuredArticle.main_image_url && (
                  <div className="relative h-80 md:h-96 overflow-hidden">
                    <img
                      src={featuredArticle.main_image_url}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}

                <div className="p-8 md:p-12">
                  <h2 className="heading-xl text-neutral-900 group-hover:text-[#1FC3D6] transition-premium mb-4 leading-tight">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-lg text-neutral-600 mb-6 leading-relaxed line-clamp-3">
                    {featuredArticle.summary ?? "Qisqacha mazmun mavjud emas"}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500">
                    <time className="font-medium">
                      {featuredArticle.created_at
                        ? new Date(featuredArticle.created_at).toLocaleDateString('uz-UZ', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : "Noma'lum sana"}
                    </time>
                    <span className="text-neutral-300">•</span>
                    <span className="font-medium">{readingTime(featuredArticle.content ?? "")}</span>
                  </div>

                  <div className="mt-8 flex items-center text-[#1FC3D6] font-semibold">
                    <span>To'liq o'qish</span>
                    <svg className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          </section>
        )}

        {/* Regular Articles Grid */}
        <section>
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900">Barcha maqolalar</h2>
            <p className="mt-2 text-neutral-600">So'nggi yangiliklar va hikoyalar</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regularArticles.map((article) => {
              if (!article.slug) {
                console.warn(`[Article List] Skipping article with missing slug: id=${article.id}, title=${article.title}`);
                return null;
              }

              return (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group block"
                  aria-label={`View article: ${article.title}`}
                >
                  <article className="card-premium overflow-hidden hover-lift">
                    {article.main_image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.main_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="mb-3">
                        <span className="badge-secondary">Maqola</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-semibold text-neutral-900 group-hover:text-[#1FC3D6] transition-premium mb-3 leading-tight line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
                        {article.summary ?? "Qisqacha mazmun mavjud emas"}
                      </p>

                      <div className="flex items-center justify-between text-sm text-neutral-500">
                        <time className="font-medium">
                          {article.created_at
                            ? new Date(article.created_at).toLocaleDateString('uz-UZ', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : "Noma'lum sana"}
                        </time>
                        <span className="font-medium">{readingTime(article.content ?? "")}</span>
                      </div>

                      <div className="mt-4 flex items-center text-xs text-[#1FC3D6] font-semibold">
                        <span>O'qish</span>
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
        </section>
      </div>
    </main>
  );
}
