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
    .select("id,slug,title,summary,content,created_at,main_image_url,newspaper_id,category")
    .eq("slug", slug)
    .single();

  return { data: data as Article | null, error };
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

  const relatedArticles = await getRelatedArticles(article);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <nav className="text-xs text-slate-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-slate-700">Home</Link>
              <span className="mx-1">/</span>
            </li>
            <li>
              <Link href="/articles" className="hover:text-slate-700">Articles</Link>
              <span className="mx-1">/</span>
            </li>
            <li aria-current="page" className="font-semibold text-slate-700 truncate">
              {article.title}
            </li>
          </ol>
        </nav>
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Article</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold leading-tight text-slate-900">{article.title}</h1>
              <p className="mt-3 text-xs text-slate-500">{article.created_at ? new Date(article.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }) : "Date unavailable"} • {readingTime(article.content ?? "")}</p>
            </div>
            <ShareButton url={`/article/${article.slug}`} title={article.title} />
          </div>
          <p className="text-base text-slate-600">{article.summary ?? "No summary available."}</p>
        </div>

        {article.main_image_url ? (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
            <img
              src={article.main_image_url}
              alt={article.title}
              className="h-auto w-full object-cover"
            />
          </div>
        ) : null}

        <div className="prose max-w-none text-slate-700">
          {article.content ? article.content : "No content available for this article."}
        </div>

        {relatedArticles.length > 0 && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Related Articles</h2>
            <div className="mt-5 space-y-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/article/${related.slug}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-900 hover:shadow-sm"
                >
                  <h3 className="font-semibold text-slate-900">{related.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{related.summary ?? "No summary available."}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}