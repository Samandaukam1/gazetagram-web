import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Newspaper = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  banner_url: string | null;
  region: string | null;
  description: string | null;
  founded_year: number | null;
};

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  created_at: string | null;
  main_image_url: string | null;
};

async function getNewspaper(slug: string) {
  const { data, error } = await supabase
    .from("newspapers")
    .select("id,slug,name,logo_url,banner_url,region,description,founded_year")
    .eq("slug", slug)
    .single();

  return { data: data as Newspaper | null, error };
}

async function getNewspaperArticles(newspaperId: string) {
  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,summary,created_at,main_image_url")
    .eq("newspaper_id", newspaperId)
    .order("created_at", { ascending: false })
    .limit(10);

  return { data, error };
}

export default async function NewspaperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug || slug === "undefined") {
    return (
      <main className="min-h-screen bg-white">
        <div className="container-editorial py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="heading-xl text-neutral-900 mb-4">Noto'g'ri gazeta havolasi</h1>
            <p className="text-neutral-600">Gazeta havolasi noto'g'ri yoki mavjud emas.</p>
            <Link href="/newspapers" className="mt-8 btn-ghost text-[#1FC3D6] hover:text-[#0d9488]">
              ← Gazetalarga qaytish
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { data: newspaper, error: newspaperError } = await getNewspaper(slug);

  if (newspaperError || !newspaper) {
    notFound();
  }

  const { data: articles } = await getNewspaperArticles(newspaper.id);

  return (
    <main className="min-h-screen bg-white">
      {/* Premium Banner Section */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* Background Banner */}
        <div className="absolute inset-0">
          {newspaper.banner_url ? (
            <img
              src={newspaper.banner_url}
              alt={newspaper.name}
              className="w-full h-full object-cover scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1FC3D6]/20 to-[#0d9488]/20"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container-editorial pb-20">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-8" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-300">
                <li>
                  <Link href="/" className="hover:text-white transition-smooth">Bosh sahifa</Link>
                </li>
                <li className="text-neutral-400">/</li>
                <li>
                  <Link href="/newspapers" className="hover:text-white transition-smooth">Gazetalar</Link>
                </li>
                <li className="text-neutral-400">/</li>
                <li className="font-medium text-white truncate" aria-current="page">
                  {newspaper.name}
                </li>
              </ol>
            </nav>

            {/* Logo & Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-8">
              <div className="flex-1">
                {newspaper.logo_url && (
                  <div className="mb-6">
                    <div className="h-24 w-24 rounded-2xl border-4 border-white/30 bg-white/10 backdrop-blur-sm overflow-hidden shadow-md">
                      <img
                        src={newspaper.logo_url}
                        alt={newspaper.name}
                        className="h-full w-full object-contain p-3"
                      />
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <span className="badge-premium bg-[#1FC3D6]/20 text-white border-white/30 mb-4">Gazeta</span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
                    {newspaper.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-neutral-300">
                    {newspaper.region && (
                      <span className="font-medium">{newspaper.region}</span>
                    )}
                    {newspaper.founded_year && (
                      <>
                        <span className="text-neutral-400">•</span>
                        <span>{newspaper.founded_year} yilda tashkil topgan</span>
                      </>
                    )}
                  </div>
                </div>

                {newspaper.description && (
                  <p className="text-xl text-neutral-200 leading-relaxed max-w-2xl">
                    {newspaper.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container-editorial">
          <div className="mb-12">
            <h2 className="heading-xl text-neutral-900 mb-4">Gazeta maqolalari</h2>
            <p className="text-lg text-neutral-600">Bu gazetadan eng so'nggi maqolalar</p>
          </div>

          {!articles || articles.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-md">
              <p className="text-neutral-600">Hozircha maqolalar chop etilmagan</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group block"
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
                      <h3 className="text-base sm:text-lg font-semibold text-neutral-900 group-hover:text-[#1FC3D6] transition-premium mb-3 leading-tight line-clamp-2">
                        {article.title}
                      </h3>

                      {article.summary && (
                        <p className="text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
                          {article.summary}
                        </p>
                      )}

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
                        <span className="text-[#1FC3D6] font-medium group-hover:translate-x-1 transition-transform duration-200">
                          O'qish →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}