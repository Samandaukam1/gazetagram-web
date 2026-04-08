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
};

async function getArticle(slug: string) {
  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,summary,content,created_at,main_image_url,newspaper_id,category,author_name,author_role,author_bio,author_image_url")
    .eq("slug", slug)
    .single();

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
        .select("id,slug,title,summary,created_at")
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
      .select("id,slug,title,summary,created_at")
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
  const description = article.summary ?? "Read this article on Gazetagram Web.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: article.main_image_url ? [{ url: article.main_image_url }] : [],
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
      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Invalid article slug</h1>
          <p className="mt-4 text-slate-700">The article slug is missing or invalid.</p>
        </div>
      </main>
    );
  }

  const { data: article, error } = await getArticle(slug);

  if (error) {
    if (error.code === "PGRST116" || error.message.includes("No rows found")) {
      notFound();
    }

    return (
      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Article error</h1>
          <p className="mt-4 text-slate-700">Unable to load the article.</p>
          <p className="mt-2 text-sm text-red-600">{error.message}</p>
        </div>
      </main>
    );
  }

  if (!article) {
    notFound();
  }

  const articleNewspaperResult = article.newspaper_id
    ? await getNewspaperById(article.newspaper_id)
    : ({ data: null, error: null } as { data: null; error: null });
  const articleNewspaper = articleNewspaperResult.data;

  const articleUrl = `https://gazetagram-web.vercel.app/article/${article.slug}`;
  const relatedArticles = await getRelatedArticles(article);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
        <nav className="container-lg py-4" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <li>
              <Link href="/" className="hover:text-slate-900 transition">Home</Link>
            </li>
            <li className="text-slate-400">/</li>
            <li>
              <Link href="/articles" className="hover:text-slate-900 transition">Articles</Link>
            </li>
            <li className="text-slate-400">/</li>
            <li className="font-medium text-slate-900 truncate" aria-current="page">
              {article.title}
            </li>
          </ol>
        </nav>
      </div>

      {/* Article Header */}
      <div className="border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
        <div className="container-md py-12 sm:py-16">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Article</p>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight text-slate-900">
            {article.title}
          </h1>
          <p className="mt-6 text-xl text-slate-600">
            {article.summary ?? "No summary available."}
          </p>
          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {articleNewspaper ? (
              <div className="flex items-center gap-4">
                {articleNewspaper.logo_url ? (
                  <div className="h-14 w-14 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                    <img
                      src={articleNewspaper.logo_url}
                      alt={articleNewspaper.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold uppercase text-slate-500">
                    {articleNewspaper.name.slice(0, 2)}
                  </div>
                )}
                <div>
                  <p className="text-base font-semibold text-slate-900">{articleNewspaper.name}</p>
                  <p className="text-sm text-slate-500">Newspaper</p>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span>
                  {article.created_at ? new Date(article.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) : "Date unavailable"}
                </span>
                <span className="text-slate-400">•</span>
                <span>{readingTime(article.content ?? "")}</span>
              </div>
              <ShareButton url={articleUrl} title={article.title} />
            </div>
          </div>
        </div>
      </div>

      {/* Article Image */}
      {article.main_image_url && (
        <div className="border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 py-8">
          <div className="container-md">
            <div className="overflow-hidden rounded-2xl bg-slate-200">
              <img
                src={article.main_image_url}
                alt={article.title}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <article className="container-md">
          <div className="prose prose-slate max-w-none mb-12">
            {article.content ? (
              <div className="text-lg leading-relaxed text-slate-700 [&>p]:mb-6 [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-slate-900 [&>ul]:mb-6 [&>li]:ml-6 [&>li]:mb-2">
                {article.content}
              </div>
            ) : (
              <p className="text-slate-600">No content available for this article.</p>
            )}
          </div>
        </article>
      </div>

      {(article.author_name || article.author_role || article.author_bio || article.author_image_url) && (
        <section className="border-t border-slate-200 bg-white px-4 sm:px-6 lg:px-8 py-10">
          <div className="container-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Maqola muallifi</p>
            <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center">
              <div className="flex-shrink-0">
                {article.author_image_url ? (
                  <img
                    src={article.author_image_url}
                    alt={article.author_name ?? "Author"}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold uppercase text-slate-500">
                    {article.author_name ? article.author_name.slice(0, 2) : "A"}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                {article.author_name && (
                  <p className="text-lg font-semibold text-slate-900">{article.author_name}</p>
                )}
                {article.author_role && (
                  <p className="mt-1 text-sm text-slate-600">{article.author_role}</p>
                )}
                {article.author_bio && (
                  <p className="mt-4 text-sm leading-7 text-slate-700">{article.author_bio}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <div className="border-t border-slate-200 bg-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="container-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
              Related Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/article/${related.slug}`}
                  className="group rounded-xl border border-slate-200 bg-slate-50 p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 line-clamp-2">
                    {related.summary ?? "No summary available."}
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    {related.created_at ? new Date(related.created_at).toLocaleDateString() : "Unknown date"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}