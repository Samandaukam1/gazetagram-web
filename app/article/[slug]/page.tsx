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
};

async function getArticle(slug: string) {
  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,summary,content,created_at,main_image_url")
    .eq("slug", slug)
    .single();

  return { data: data as Article | null, error };
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

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
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
      </div>
    </main>
  );
}