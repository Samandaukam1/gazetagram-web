import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200/50 shadow-sm">
      <div className="container-editorial">
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-[#1FC3D6] hover:text-[#0d9488] transition-premium tracking-tight"
          >
            Gazetagram
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            <Link
              href="/"
              className="text-sm font-semibold text-neutral-700 hover:text-[#1FC3D6] transition-smooth relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1FC3D6] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/articles"
              className="text-sm font-semibold text-neutral-700 hover:text-[#1FC3D6] transition-smooth relative group"
            >
              Articles
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1FC3D6] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/newspapers"
              className="text-sm font-semibold text-neutral-700 hover:text-[#1FC3D6] transition-smooth relative group"
            >
              Newspapers
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1FC3D6] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Mobile menu - premium hamburger */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-neutral-700 hover:text-[#1FC3D6] hover:bg-[#1FC3D6]/10 transition-smooth">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
