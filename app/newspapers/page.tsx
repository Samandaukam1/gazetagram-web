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
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="border-b border-neutral-200/50 bg-neutral-50/50">
        <div className="container-editorial py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6">Gazetalar</h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              O'zbekistonning eng ishonchli gazeta va yangilik manbalarini kashf qiling
            </p>
          </div>
        </div>
      </section>

      <div className="container-editorial py-16">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center">
            <p className="text-base sm:text-lg font-semibold text-red-800 mb-2">Gazetalarni yuklab bo'lmadi</p>
            <p className="text-red-700">{error.message}</p>
          </div>
        ) : !newspapers || newspapers.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-12 text-center shadow-md">
            <p className="text-neutral-600">Hozircha gazetalar mavjud emas</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newspapers.map((newspaper) => {
              if (!newspaper.slug) {
                return (
                  <div
                    key={newspaper.id}
                    className="card-premium overflow-hidden opacity-75"
                  >
                    {/* Banner */}
                    <div className="h-48 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-t-xl">
                      {newspaper.banner_url ? (
                        <img
                          src={newspaper.banner_url}
                          alt={newspaper.name}
                          className="h-full w-full object-cover rounded-t-xl"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-t-xl" />
                      )}
                    </div>

                    {/* Logo - Overlapping */}
                    <div className="absolute top-32 left-6">
                      {newspaper.logo_url ? (
                        <div className="h-20 w-20 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                          <img
                            src={newspaper.logo_url}
                            alt={newspaper.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-20 w-20 rounded-full border-4 border-white bg-neutral-100 shadow-md flex items-center justify-center">
                          <span className="text-sm font-bold text-neutral-500">
                            {newspaper.name.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 pt-16">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-neutral-900 mb-2">{newspaper.name}</h2>

                      {newspaper.region && (
                        <p className="text-sm text-neutral-600 font-medium mb-3">{newspaper.region}</p>
                      )}

                      {newspaper.description && (
                        <p className="text-neutral-600 line-clamp-3 leading-relaxed mb-4">{newspaper.description}</p>
                      )}

                      <div className="text-xs text-neutral-500 font-medium">
                        Gazeta mavjud emas
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={newspaper.id}
                  href={`/newspaper/${newspaper.slug}`}
                  className="group block"
                >
                  <article className="card-premium overflow-hidden hover-lift">
                    {/* Banner */}
                    <div className="h-48 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-t-xl overflow-hidden">
                      {newspaper.banner_url ? (
                        <img
                          src={newspaper.banner_url}
                          alt={newspaper.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-[#1FC3D6]/20 to-[#0d9488]/20 rounded-t-xl" />
                      )}
                    </div>

                    {/* Logo - Overlapping */}
                    <div className="absolute top-32 left-6">
                      {newspaper.logo_url ? (
                        <div className="h-20 w-20 rounded-full border-4 border-white bg-white shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-110">
                          <img
                            src={newspaper.logo_url}
                            alt={newspaper.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-20 w-20 rounded-full border-4 border-white bg-neutral-100 shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                          <span className="text-sm font-bold text-neutral-500">
                            {newspaper.name.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 pt-16">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-neutral-900 group-hover:text-[#1FC3D6] transition-premium mb-2">
                        {newspaper.name}
                      </h2>

                      {newspaper.region && (
                        <p className="text-sm text-neutral-600 font-medium mb-3">{newspaper.region}</p>
                      )}

                      {newspaper.description && (
                        <p className="text-neutral-600 line-clamp-3 leading-relaxed mb-4">{newspaper.description}</p>
                      )}

                      <div className="flex items-center text-xs text-[#1FC3D6] font-semibold">
                        <span>Kashf qilish</span>
                        <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}