export default function LoadingNewspaper() {
  return (
    <main className="min-h-screen">
      <div className="h-64 bg-slate-200 animate-pulse" />
      <section className="border-b border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="h-8 w-1/2 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse" />
        </div>
      </section>
    </main>
  );
}