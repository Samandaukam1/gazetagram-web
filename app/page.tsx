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
  banner_url: string | null;
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
    .select("id,slug,name,logo_url,banner_url,region")
    .limit(6);

  return { data, error };
}

export default async function Home() {
  const { data: articles, error: articlesError } = await getLatestArticles();
  const { data: newspapers, error: newspapersError } = await getNewspapers();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white px-4 py-20 sm:py-32 sm:px-6 lg:px-8">
        <div className="container-lg">
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight text-slate-900">
              Gazetagram
            </h1>
            <p className="mt-6 text-xl text-slate-600">
              Stay informed with the latest news and stories from trusted sources across Uzbekistan.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/articles"
                className="btn-primary"
              >
                Browse Articles
              </Link>
              <Link
                href="/newspapers"
                className="btn-secondary"
              >
                Explore Newspapers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="container-lg">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Latest Articles</h2>
            <p className="mt-3 text-lg text-slate-600">Stay updated with the newest stories</p>
          </div>

          {articlesError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-8">
              <p className="font-medium text-red-800">Unable to load articles</p>
              <p className="mt-2 text-sm text-red-700">{articlesError.message}</p>
            </div>
          ) : !articles || articles.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-600">No articles available yet</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Article
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 line-clamp-2">
                    {article.summary ?? "No summary available"}
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    {article.created_at
                      ? new Date(article.created_at).toLocaleDateString()
                      : "Unknown date"}
                  </p>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/articles"
              className="text-blue-600 hover:text-blue-700 font-medium transition"
            >
              View all articles →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Newspapers Section */}
      <section className="border-t border-slate-200 bg-white px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="container-lg">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Featured Newspapers</h2>
            <p className="mt-3 text-lg text-slate-600">Read from trusted news sources</p>
          </div>

          {newspapersError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-8">
              <p className="font-medium text-red-800">Unable to load newspapers</p>
              <p className="mt-2 text-sm text-red-700">{newspapersError.message}</p>
            </div>
          ) : !newspapers || newspapers.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
              <p className="text-slate-600">No newspapers available yet</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newspapers.map((newspaper) => {
                if (!newspaper.slug) {
                  return (
                    <div
                      key={newspaper.id}
                      className="relative rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                    >
                      {/* Banner */}
                      <div className="h-32 bg-slate-200 rounded-t-xl">
                        {newspaper.banner_url ? (
                          <img
                            src={newspaper.banner_url}
                            alt={newspaper.name}
                            className="h-full w-full object-cover rounded-t-xl"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300 rounded-t-xl" />
                        )}
                      </div>

                      {/* Logo - Overlapping */}
                      <div className="absolute top-20 left-4">
                        {newspaper.logo_url ? (
                          <div className="h-16 w-16 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                            <img
                              src={newspaper.logo_url}
                              alt={newspaper.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 rounded-full border-4 border-white bg-slate-100 shadow-lg flex items-center justify-center">
                            <span className="text-sm font-semibold text-slate-500">
                              {newspaper.name.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 pt-8">
                        <h3 className="font-semibold text-slate-900">{newspaper.name}</h3>
                        {newspaper.region && (
                          <p className="mt-1 text-sm text-slate-600">{newspaper.region}</p>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={newspaper.id}
                    href={`/newspaper/${newspaper.slug}`}
                    className="group relative rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden block"
                  >
                    {/* Banner */}
                    <div className="h-32 bg-slate-200 rounded-t-xl">
                      {newspaper.banner_url ? (
                        <img
                          src={newspaper.banner_url}
                          alt={newspaper.name}
                          className="h-full w-full object-cover rounded-t-xl"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300 rounded-t-xl" />
                      )}
                    </div>

                    {/* Logo - Overlapping */}
                    <div className="absolute top-20 left-4">
                      {newspaper.logo_url ? (
                        <div className="h-16 w-16 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                          <img
                            src={newspaper.logo_url}
                            alt={newspaper.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-full border-4 border-white bg-slate-100 shadow-lg flex items-center justify-center">
                          <span className="text-sm font-semibold text-slate-500">
                            {newspaper.name.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 pt-8">
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition">{newspaper.name}</h3>
                      {newspaper.region && (
                        <p className="mt-1 text-sm text-slate-600">{newspaper.region}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/newspapers"
              className="text-blue-600 hover:text-blue-700 font-medium transition"
            >
              View all newspapers →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}