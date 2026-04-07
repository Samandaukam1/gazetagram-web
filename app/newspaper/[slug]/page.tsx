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

  if (newspaperError || !newspaper) {
    notFound();
  }

  const { data: articles } = await getNewspaperArticles(newspaper.id);

  return (
    <main className="min-h-screen">
      {/* Banner */}
      {newspaper.banner_url && (
        <div className="h-64 overflow-hidden bg-slate-100">
          <img
            src={newspaper.banner_url}
            alt={newspaper.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Header Section */}
      <section className="border-b border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {newspaper.logo_url && (
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100">
                  <img
                    src={newspaper.logo_url}
                    alt={newspaper.name}
                    className="h-full w-full object-contain p-2"
                  />
                </div>
              )}
              <h1 className="text-4xl font-bold text-slate-900">{newspaper.name}</h1>
              {newspaper.region && (
                <p className="mt-2 text-slate-600">{newspaper.region}</p>
              )}
              {newspaper.founded_year && (
                <p className="mt-1 text-sm text-slate-500">Founded {newspaper.founded_year}</p>
              )}
            </div>
            <Link
              href="/newspapers"
              className="text-slate-600 hover:text-slate-900 underline"
            >
              ← All newspapers
            </Link>
          </div>

          {newspaper.description && (
            <p className="mt-6 text-slate-700">{newspaper.description}</p>
          )}
        </div>
      </section>

      {/* Articles Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900">Articles from this newspaper</h2>

          {!articles || articles.length === 0 ? (
            <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-slate-600">No articles published yet</p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-900 hover:shadow-md"
                >
                  <h3 className="font-semibold text-slate-900 group-hover:text-slate-700">
                    {article.title}
                  </h3>
                  {article.summary && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{article.summary}</p>
                  )}
                  <p className="mt-2 text-xs text-slate-500">
                    {article.created_at
                      ? new Date(article.created_at).toLocaleDateString()
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