import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data, error } = await supabase.auth.getSession();
  const statusMessage = error
    ? `Supabase error: ${error.message}`
    : data.session
    ? "Supabase connected and an active session was found."
    : "Supabase connected successfully; no active session was found."

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Gazetagram Web</h1>
      <p className="mt-4">Next.js is connected to Supabase.</p>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <p className="text-sm text-slate-700">{statusMessage}</p>
        <p className="mt-3 text-xs text-slate-500">
          This page uses `supabase.auth.getSession()` as a lightweight connectivity test.
        </p>
      </div>
    </main>
  );
}