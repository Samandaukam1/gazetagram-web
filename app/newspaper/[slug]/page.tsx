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
    .select("id,slug,title,summary,created_at")
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
  console.log("Newspaper page params.slug:", slug);

  if (!slug || slug === "undefined") {
    return (
      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-800">Invalid newspaper slug</h1>
          <p className="mt-2 text-red-700">The newspaper slug is missing or invalid.</p>
          <Link href="/newspapers" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back to newspapers
          </Link>
        </div>
      </main>
    );
  }

  const { data: newspaper, error: newspaperError } = await getNewspaper(slug);
  console.log("Fetched newspaper for slug:", { slug, newspaper, newspaperError });

  if (newspaperError || !newspaper) {
    console.log("Newspaper not found for slug:", slug, newspaperError);
    notFound();
  }

  const { data: articles } = await getNewspaperArticles(newspaper.id);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Banner */}
      {newspaper.banner_url && (
        <div className="h-64 sm:h-80 overflow-hidden bg-slate-300">
          <img
            src={newspaper.banner_url}
            alt={newspaper.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
        <nav className="container-lg py-4" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <li>
              <Link href="/" className="hover:text-slate-900 transition">Home</Link>
            </li>
            <li className="text-slate-400">/</li>
            <li>
              <Link href="/newspapers" className="hover:text-slate-900 transition">Newspapers</Link>
            </li>
            <li className="text-slate-400">/</li>
            <li className="font-medium text-slate-900 truncate" aria-current="page">
              {newspaper.name}
            </li>
          </ol>
        </nav>
      </div>

      {/* Header Section */}
      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <div className="container-lg">
          {newspaper.logo_url && (
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-xl bg-slate-50 border border-slate-200">
              <img
                src={newspaper.logo_url}
                alt={newspaper.name}
                className="h-full w-full object-contain p-2"
              />
            </div>
          )}
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">{newspaper.name}</h1>
            {newspaper.region && (
              <p className="mt-3 text-lg text-slate-600">{newspaper.region}</p>
            )}
            {newspaper.founded_year && (
              <p className="mt-2 text-sm text-slate-500">Founded {newspaper.founded_year}</p>
            )}
          </div>
          {newspaper.description && (
            <p className="text-lg text-slate-700 max-w-3xl">{newspaper.description}</p>
          )}
        </div>
      </section>

      {/* Articles Section */}
      <section className="px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <div className="container-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
            Articles from this newspaper
          </h2>

          {!articles || articles.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-600">No articles published yet</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >
                  <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition line-clamp-2">
                    {article.title}
                  </h3>
                  {article.summary && (
                    <p className="mt-3 line-clamp-2 text-sm text-slate-600">{article.summary}</p>
                  )}
                  <p className="mt-4 text-xs text-slate-500">
                    {article.created_at
                      ? new Date(article.created_at).toLocaleDateString(undefined, { 
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })
                      : "Unknown date"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}