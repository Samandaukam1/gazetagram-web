import { notFound } from "next/navigation";
import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import ShareButton from "@/components/ShareButton";

type Article = {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  created_at: string | null;
  main_image_url: string | null;
};

async function getArticle(id: string) {
  const { data, error } = await supabase
    .from("articles")
    .select("id,title,summary,content,created_at,main_image_url")
    .eq("id", id)
    .single();

  return { data: data as Article | null, error };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  console.log("generateMetadata resolved id:", id);

  if (!id || id === "undefined") {
    return {
      title: "Invalid article ID",
    };
  }

  const { data: article } = await getArticle(id);

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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("ArticleDetailPage resolved id:", id);

  if (!id || id === "undefined") {
    return (
      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Invalid article ID</h1>
          <p className="mt-4 text-slate-700">The article ID is missing or invalid.</p>
        </div>
      </main>
    );
  }

  const { data: article, error } = await getArticle(id);

  console.log("ArticleDetailPage article data:", article);
  console.log("ArticleDetailPage error:", error);

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
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-4xl font-bold leading-tight text-slate-900">{article.title}</h1>
            <ShareButton url={`/article/${article.id}`} title={article.title} />
          </div>
          <p className="text-base text-slate-600">{article.summary ?? "No summary available."}</p>
          <p className="text-sm text-slate-500">
            {article.created_at
              ? new Date(article.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Date unavailable"}
          </p>
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