import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Newspaper = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  region: string | null;
  description: string | null;
};

async function getNewspapers() {
  const { data, error } = await supabase
    .from("newspapers")
    .select("id,slug,name,logo_url,region,description")
    .order("name", { ascending: true });

  console.log("getNewspapers page result:", {
    count: data?.length ?? 0,
    error: error ? { message: error.message, code: error.code } : null,
  });

  return { data, error };
}

export default async function NewspapersPage() {
  const { data: newspapers, error } = await getNewspapers();
  console.log("Rendering NewspapersPage with newspapers:", newspapers?.map((item) => ({ id: item.id, slug: item.slug, name: item.name })));

  return (
    <main className="min-h-screen px-4 py-12 sm:py-16 sm:px-6 lg:px-8 bg-slate-50">
      <div className="container-lg">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">Newspapers</h1>
          <p className="mt-4 text-lg text-slate-600">Browse news sources across Uzbekistan</p>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-8">
            <p className="font-medium text-red-800">Unable to load newspapers</p>
            <p className="mt-2 text-slate-600">{error.message}</p>
          </div>
        ) : !newspapers || newspapers.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-600">No newspapers available yet</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newspapers.map((newspaper) => {
              if (!newspaper.slug) {
                console.log("Newspaper missing slug in newspapers list:", {
                  id: newspaper.id,
                  name: newspaper.name,
                });

                return (
                  <div
                    key={newspaper.id}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    {newspaper.logo_url ? (
                      <div className="mb-4 flex h-20 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                        <img
                          src={newspaper.logo_url}
                          alt={newspaper.name}
                          className="h-full w-full object-contain p-2"
                        />
                      </div>
                    ) : (
                      <div className="mb-4 flex h-20 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-sm font-semibold text-slate-500">{newspaper.name.slice(0, 2).toUpperCase()}</span>
                      </div>
                    )}

                    <h2 className="text-lg font-semibold text-slate-900">{newspaper.name}</h2>

                    {newspaper.region && (
                      <p className="mt-2 text-sm text-slate-600">{newspaper.region}</p>
                    )}

                    {newspaper.description && (
                      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{newspaper.description}</p>
                    )}

                    <p className="mt-4 text-xs text-amber-600">Missing slug</p>
                  </div>
                );
              }

              console.log("Newspaper list link source:", {
                slug: newspaper.slug,
                name: newspaper.name,
              });

              return (
                <Link
                  key={newspaper.id}
                  href={`/newspaper/${newspaper.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >
                  {newspaper.logo_url ? (
                    <div className="mb-4 flex h-20 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                      <img
                        src={newspaper.logo_url}
                        alt={newspaper.name}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>
                  ) : (
                    <div className="mb-4 flex h-20 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-sm font-semibold text-slate-500">{newspaper.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                  )}

                  <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition">
                    {newspaper.name}
                  </h2>

                  {newspaper.region && (
                    <p className="mt-2 text-sm text-slate-600">{newspaper.region}</p>
                  )}

                  {newspaper.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-slate-600">{newspaper.description}</p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}