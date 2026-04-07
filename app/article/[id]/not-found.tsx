export default function ArticleNotFound() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Article not found</h1>
        <p className="mt-4 text-slate-700">The requested article does not exist.</p>
      </div>
    </main>
  );
}
