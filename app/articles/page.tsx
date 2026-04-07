import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { readingTime } from "@/lib/readingTime";

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  created_at: string | null;
  newspaper_id: string | null;
};

async function getArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,summary,content,created_at,newspaper_id")
    .order("created_at", { ascending: false })
    .limit(50);

  return { data, error };
}

export default async function ArticlesPage() {
  const { data: articles, error } = await getArticles();

  if (error) {
    return (
      <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-slate-50">
        <div className="container-lg">
          <h1 className="text-4xl font-bold text-slate-900">Articles</h1>
          <p className="mt-6 text-lg text-red-600">Unable to load articles</p>
          <p className="mt-2 text-slate-600">{error.message}</p>
          <Link href="/" className="mt-6 inline-block text-blue-600 hover:text-blue-700 font-medium">
            ← Back to home
          </Link>
        </div>
      </main>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-slate-50">
        <div className="container-lg">
          <h1 className="text-4xl font-bold text-slate-900">Articles</h1>
          <p className="mt-6 text-lg text-slate-600">No articles found yet</p>
          <Link href="/" className="mt-6 inline-block text-blue-600 hover:text-blue-700 font-medium">
            ← Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12 sm:py-16 sm:px-6 lg:px-8 bg-slate-50">
      <div className="container-lg">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">Articles</h1>
          <p className="mt-4 text-lg text-slate-600">Explore all the latest stories and news</p>
        </div>

        <div className="space-y-4">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="group block rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
              aria-label={`View article: ${article.title}`}
            >
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Article
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 group-hover:text-blue-600 transition">
                    {article.title}
                  </h2>
                </div>
                <p className="text-slate-600 line-clamp-2">
                  {article.summary ?? "No summary available"}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span>
                    {article.created_at ? new Date(article.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }) : "Unknown date"}
                  </span>
                  <span>•</span>
                  <span>{readingTime(article.content ?? "")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
