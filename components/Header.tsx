import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Gazetagram
          </Link>

          <nav className="hidden sm:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
            >
              Home
            </Link>
            <Link
              href="/articles"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
            >
              Articles
            </Link>
            <Link
              href="/newspapers"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
            >
              Newspapers
            </Link>
          </nav>

          {/* Mobile menu - simplified */}
          <div className="sm:hidden flex gap-4">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Home
            </Link>
            <Link href="/articles" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Articles
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
