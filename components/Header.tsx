'use client';

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Language, LANGUAGE_LABELS, t } from "@/lib/i18n";

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none bg-white border border-neutral-300 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-neutral-700 hover:border-[#1FC3D6] focus:border-[#1FC3D6] focus:outline-none focus:ring-2 focus:ring-[#1FC3D6]/20 transition-smooth cursor-pointer"
      >
        {Object.entries(LANGUAGE_LABELS).map(([langKey, label]) => (
          <option key={langKey} value={langKey}>
            {label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default function Header() {
  const { language } = useLanguage();

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
              {t('nav.home', language)}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1FC3D6] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/articles"
              className="text-sm font-semibold text-neutral-700 hover:text-[#1FC3D6] transition-smooth relative group"
            >
              {t('nav.articles', language)}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1FC3D6] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/newspapers"
              className="text-sm font-semibold text-neutral-700 hover:text-[#1FC3D6] transition-smooth relative group"
            >
              {t('nav.newspapers', language)}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1FC3D6] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

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
      </div>
    </header>
  );
}
