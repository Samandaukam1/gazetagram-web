import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Article = {
  id: string;
  title: string;
  summary: string | null;
  created_at: string | null;
  newspaper_id: string | null;
};

async function getArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("id,title,summary,created_at,newspaper_id")
    .order("created_at", { ascending: false })
    .limit(50);

  return { data, error };
}

export default async function ArticlesPage() {
  const { data: articles, error } = await getArticles();

  if (error) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <p className="mt-4 text-red-600">Unable to load articles.</p>
        <p className="mt-2 text-sm text-slate-600">{error.message}</p>
      </main>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <p className="mt-4 text-slate-700">No articles found yet.</p>
        <p className="mt-2 text-sm text-slate-500">Add records to your Supabase `articles` table to see them here.</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <p className="mt-2 text-slate-600">A simple list of articles from Supabase.</p>
        <p className="mt-2 text-sm text-slate-500">
          <Link href="/article/03df2fef-87d1-4951-8e5f-338188015b40" className="text-blue-600 underline">
            Test link: Open first article directly
          </Link>
        </p>
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-900 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500"
            aria-label={`View article ${article.title}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 group-hover:text-slate-900">
                  {article.title}
                </h2>
                <p className="mt-2 text-slate-600">{article.summary ?? "No summary available."}</p>
              </div>
              <div className="text-right text-sm text-slate-500">
                <p>{article.newspaper_id ?? "No newspaper id"}</p>
                <p className="mt-2">{article.created_at ? new Date(article.created_at).toLocaleDateString() : "Unknown date"}</p>
                <p className="mt-1 text-xs text-slate-400">ID: {article.id ?? "undefined"}</p>
                <p className="mt-1 text-xs text-slate-400">Href: /article/{article.id ?? "undefined"}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
