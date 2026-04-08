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
};

async function getNewspapers() {
  const { data, error } = await supabase
    .from("newspapers")
    .select("id,slug,name,logo_url,banner_url,region,description")
    .order("name", { ascending: true });

  return { data, error };
}

export default async function NewspapersPage() {
  const { data: newspapers, error } = await getNewspapers();

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
                      <h2 className="text-lg font-semibold text-slate-900">{newspaper.name}</h2>

                      {newspaper.region && (
                        <p className="mt-1 text-sm text-slate-600">{newspaper.region}</p>
                      )}

                      {newspaper.description && (
                        <p className="mt-3 line-clamp-2 text-sm text-slate-600">{newspaper.description}</p>
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
                    <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition">
                      {newspaper.name}
                    </h2>

                    {newspaper.region && (
                      <p className="mt-1 text-sm text-slate-600">{newspaper.region}</p>
                    )}

                    {newspaper.description && (
                      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{newspaper.description}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}