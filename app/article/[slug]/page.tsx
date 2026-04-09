import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import ShareButton from "@/components/ShareButton";
import { readingTime } from "@/lib/readingTime";

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  created_at: string | null;
  main_image_url: string | null;
  newspaper_id: string | null;
  category: string | null;
  author_name: string | null;
  author_role: string | null;
  author_bio: string | null;
  author_image_url: string | null;
};

type NewspaperIdentity = {
  id: string;
  name: string;
  logo_url: string | null;
  slug: string;
};

type RelatedArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  created_at: string | null;
  main_image_url: string | null;
};

async function getArticle(slug: string) {
  if (!slug || slug === "undefined" || slug === "null") {
    return { data: null, error: new Error("Invalid slug provided") as any };
  }

  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,summary,content,created_at,main_image_url,newspaper_id,category,author_name,author_role,author_bio,author_image_url")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`[Article Fetch Error] slug=${slug}:`, error.message);
  } else if (data) {
    console.log(`[Article Loaded] slug=${slug}, id=${data.id}, has_content=${!!data.content}`);
  } else {
    console.warn(`[Article Not Found] slug=${slug}`);
  }

  return { data: data as Article | null, error };
}

async function getNewspaperById(id: string) {
  const { data, error } = await supabase
    .from("newspapers")
    .select("id,name,logo_url,slug")
    .eq("id", id)
    .single();

  return { data: data as NewspaperIdentity | null, error };
}

async function getRelatedArticles(article: Article) {
  const relatedByNewspaper = article.newspaper_id
    ? await supabase
        .from("articles")
        .select("id,slug,title,summary,created_at,main_image_url")
        .eq("newspaper_id", article.newspaper_id)
        .neq("id", article.id)
        .order("created_at", { ascending: false })
        .limit(3)
    : { data: null, error: null };

  if (relatedByNewspaper.data && relatedByNewspaper.data.length > 0) {
    return relatedByNewspaper.data;
  }

  if (article.category) {
    const relatedByCategory = await supabase
      .from("articles")
      .select("id,slug,title,summary,created_at,main_image_url")
      .eq("category", article.category)
      .neq("id", article.id)
      .order("created_at", { ascending: false })
      .limit(3);

    if (relatedByCategory.data && relatedByCategory.data.length > 0) {
      return relatedByCategory.data;
    }
  }

  return [] as RelatedArticle[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!slug || slug === "undefined") {
    return {
      title: "Invalid article slug",
    };
  }

  const { data: article } = await getArticle(slug);

  if (!article) {
    return {
      title: "Article not found",
    };
  }

  const title = article.title;
  const description = article.summary ?? "Gazetagram - O'zbekistonning eng ishonchli yangiliklar platformasi.";
  const canonicalUrl = `https://gazetagram.uz/article/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: article.main_image_url ? [{ url: article.main_image_url }] : [],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ArticleDetailPage({
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
            <h1 className="heading-xl text-neutral-900 mb-4">Noto'g'ri maqola havolasi</h1>
            <p className="text-neutral-600">Maqola havolasi noto'g'ri yoki mavjud emas.</p>
            <Link href="/" className="mt-8 btn-ghost text-[#1FC3D6] hover:text-[#0d9488]">
              ← Bosh sahifaga qaytish
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { data: article, error } = await getArticle(slug);

  if (error) {
    console.error(`[Article Page Error] slug=${slug}`, error);
    if (error.code === "PGRST116" || error.message.includes("No rows found") || error.message.includes("Invalid slug")) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-white">
        <div className="container-editorial py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="heading-xl text-neutral-900 mb-4">Maqola xatosi</h1>
            <p className="text-neutral-600 mb-2">Maqolani yuklab bo'lmadi.</p>
            <p className="text-sm text-red-600">{error.message}</p>
            <Link href="/" className="mt-8 btn-ghost text-[#1FC3D6] hover:text-[#0d9488]">
              ← Bosh sahifaga qaytish
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!article) {
    console.warn(`[Article Not Found on Page] slug=${slug}`);
    notFound();
  }

  console.log(`[Article Page Rendered] title=${article.title}, has_content=${!!article.content}, has_newspaper=${!!article.newspaper_id}`);

  const articleNewspaperResult = article.newspaper_id
    ? await getNewspaperById(article.newspaper_id)
    : ({ data: null, error: null } as { data: null; error: null });
  const articleNewspaper = articleNewspaperResult.data;

  const articleUrl = `https://gazetagram.uz/article/${article.slug}`;
  const relatedArticles = await getRelatedArticles(article);

  return (
    <main className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* Background Image */}
        {article.main_image_url && (
          <div className="absolute inset-0">
            <img
              src={article.main_image_url}
              alt={article.title}
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
          </div>
        )}

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
                  <Link href="/articles" className="hover:text-white transition-smooth">Maqolalar</Link>
                </li>
                <li className="text-neutral-400">/</li>
                <li className="font-medium text-white truncate" aria-current="page">
                  {article.title}
                </li>
              </ol>
            </nav>

            {/* Article Header */}
            <div className="mb-6">
              <span className="badge-premium bg-[#1FC3D6]/20 text-white border-white/30">Maqola</span>
            </div>

            <h1 className="article-title text-white mb-6 leading-tight">
              {article.title}
            </h1>

            <p className="article-subtitle text-neutral-200 mb-8">
              {article.summary ?? "Qisqacha mazmun mavjud emas."}
            </p>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-300 mb-8">
              {article.created_at && (
                <time className="font-medium">
                  {new Date(article.created_at).toLocaleDateString('uz-UZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
              <span className="text-neutral-400">•</span>
              <span className="font-medium">{readingTime(article.content ?? "")}</span>
              {article.category && (
                <>
                  <span className="text-neutral-400">•</span>
                  <span className="badge-secondary bg-white/10 text-white border-white/30">{article.category}</span>
                </>
              )}
            </div>

            {/* Newspaper & Share */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              {articleNewspaper && (
                <div className="flex items-center gap-4">
                  {articleNewspaper.logo_url ? (
                    <div className="h-16 w-16 rounded-full border-4 border-white/30 bg-white/10 backdrop-blur-sm overflow-hidden">
                      <img
                        src={articleNewspaper.logo_url}
                        alt={articleNewspaper.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full border-4 border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {articleNewspaper.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-semibold text-white">{articleNewspaper.name}</p>
                    <p className="text-sm text-neutral-300">Gazeta</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <ShareButton url={articleUrl} title={article.title} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20 bg-white">
        <div className="container-content">
          <article className="article-body max-w-none">
            {article.content ? (
              <div
                className="article-body prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <p className="text-neutral-600 text-center py-12">
                Bu maqola uchun kontent mavjud emas.
              </p>
            )}
          </article>
        </div>
      </section>

      {/* Author Section */}
      {(article.author_name || article.author_role || article.author_bio || article.author_image_url) && (
        <section className="py-16 bg-neutral-50">
          <div className="container-content">
            <div className="mb-8">
              <span className="badge-premium">Muallif</span>
            </div>

            <div className="card-premium p-8">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  {article.author_image_url ? (
                    <img
                      src={article.author_image_url}
                      alt={article.author_name ?? "Muallif"}
                      className="h-24 w-24 rounded-full object-cover shadow-md"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-neutral-200 flex items-center justify-center shadow-md">
                      <span className="text-lg font-bold text-neutral-600">
                        {article.author_name ? article.author_name.slice(0, 2).toUpperCase() : "M"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {article.author_name && (
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-neutral-900 mb-2">{article.author_name}</h3>
                  )}
                  {article.author_role && (
                    <p className="text-neutral-600 font-medium mb-4">{article.author_role}</p>
                  )}
                  {article.author_bio && (
                    <p className="text-neutral-700 leading-relaxed">{article.author_bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container-editorial">
            <div className="mb-12 text-center">
              <h2 className="heading-xl text-neutral-900 mb-4">Tegishli maqolalar</h2>
              <p className="text-lg text-neutral-600">Shunga o'xshash mavzularni o'qing</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/article/${related.slug}`}
                  className="group block"
                >
                  <article className="card-premium overflow-hidden hover-lift">
                    {related.main_image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={related.main_image_url}
                          alt={related.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-base sm:text-lg font-semibold text-neutral-900 group-hover:text-[#1FC3D6] transition-premium mb-3 leading-tight line-clamp-2">
                        {related.title}
                      </h3>

                      <p className="text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
                        {related.summary ?? "Qisqacha mazmun mavjud emas"}
                      </p>

                      <div className="flex items-center justify-between text-sm text-neutral-500">
                        <time className="font-medium">
                          {related.created_at
                            ? new Date(related.created_at).toLocaleDateString('uz-UZ', {
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
          </div>
        </section>
      )}
    </main>
  );
}