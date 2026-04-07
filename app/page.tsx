import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  created_at: string | null;
};

type Newspaper = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  region: string | null;
};

async function getLatestArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,summary,created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return { data, error };
}

async function getNewspapers() {
  const { data, error } = await supabase
    .from("newspapers")
    .select("id,slug,name,logo_url,region")
    .limit(6);

  return { data, error };
}

export default async function Home() {
  const { data: articles, error: articlesError } = await getLatestArticles();
  const { data: newspapers, error: newspapersError } = await getNewspapers();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Gazetagram</h1>
          <p className="mt-4 text-xl text-slate-300">Uzbekistan's digital newspaper platform</p>
          <p className="mt-2 text-sm text-slate-400">Read the latest news from trusted sources</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/articles"
              className="rounded-lg bg-white px-6 py-3 font-medium text-slate-900 hover:bg-slate-100"
            >
              Browse Articles
            </Link>
            <Link
              href="/newspapers"
              className="rounded-lg bg-slate-700 px-6 py-3 font-medium text-white hover:bg-slate-600"
            >
              Browse Newspapers
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Latest Articles</h2>
            <p className="mt-2 text-slate-600">Stay updated with the newest stories</p>
          </div>

          {articlesError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
              <p className="text-red-800">Unable to load articles</p>
              <p className="mt-1 text-sm text-red-700">{articlesError.message}</p>
            </div>
          ) : !articles || articles.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
              <p className="text-slate-600">No articles available yet</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-900 hover:shadow-md"
                >
                  <h3 className="font-semibold text-slate-900 group-hover:text-slate-700">{article.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{article.summary ?? "No summary available"}</p>
                  <p className="mt-3 text-xs text-slate-500">
                    {article.created_at
                      ? new Date(article.created_at).toLocaleDateString()
                      : "Unknown date"}
                  </p>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/articles"
              className="inline-block text-slate-600 hover:text-slate-900 underline"
            >
              View all articles →
            </Link>
          </div>
        </div>
      </section>

      {/* Newspapers Section */}
      <section className="border-t border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Featured Newspapers</h2>
            <p className="mt-2 text-slate-600">Read from trusted news sources across Uzbekistan</p>
          </div>

          {newspapersError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
              <p className="text-red-800">Unable to load newspapers</p>
              <p className="mt-1 text-sm text-red-700">{newspapersError.message}</p>
            </div>
          ) : !newspapers || newspapers.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-600">No newspapers available yet</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newspapers.map((newspaper) => (
                <Link
                  key={newspaper.id}
                  href={`/newspaper/${newspaper.slug}`}
                  className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  {newspaper.logo_url ? (
                    <div className="mb-4 flex h-16 items-center justify-center rounded-lg bg-slate-100">
                      <img
                        src={newspaper.logo_url}
                        alt={newspaper.name}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>
                  ) : (
                    <div className="mb-4 flex h-16 items-center justify-center rounded-lg bg-slate-100">
                      <span className="text-xs text-slate-500">No logo</span>
                    </div>
                  )}
                  <h3 className="font-semibold text-slate-900">{newspaper.name}</h3>
                  {newspaper.region && (
                    <p className="mt-2 text-sm text-slate-600">{newspaper.region}</p>
                  )}
                  <p className="mt-4 text-xs text-slate-500">Coming soon</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="text-2xl font-bold text-slate-900">Get the latest news</h3>
          <p className="mt-2 text-slate-600">Stay informed with Gazetagram</p>
          <Link
            href="/articles"
            className="mt-6 inline-block rounded-lg bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-800"
          >
            Explore Articles
          </Link>
        </div>
      </section>
    </main>
  );
}