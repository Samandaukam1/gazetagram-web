import Link from "next/link";

export default function NewspaperNotFound() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Newspaper not found</h1>
        <p className="mt-2 text-slate-600">The newspaper you're looking for doesn't exist.</p>
        <Link
          href="/newspapers"
          className="mt-6 inline-block rounded-lg bg-slate-900 px-6 py-2 font-medium text-white hover:bg-slate-800"
        >
          Back to newspapers
        </Link>
      </div>
    </main>
  );
}