// lib/localization.ts - Helper functions for localized content

import { Language } from './i18n';

// Article type with multilingual fields
export interface MultilingualArticle {
  id: string;
  slug: string;
  title: string;
  title_uz_cy?: string;
  title_ru?: string;
  title_en?: string;
  summary?: string;
  summary_uz_cy?: string;
  summary_ru?: string;
  summary_en?: string;
  content?: string;
  content_uz_cy?: string;
  content_ru?: string;
  content_en?: string;
  keywords?: string;
  keywords_uz_cy?: string;
  keywords_ru?: string;
  keywords_en?: string;
  created_at: string | null;
  main_image_url: string | null;
  newspaper_id: string | null;
  category: string | null;
  author_name: string | null;
  author_role: string | null;
  author_bio: string | null;
  author_image_url: string | null;
}

// Newspaper type with multilingual fields
export interface MultilingualNewspaper {
  id: string;
  slug: string;
  name: string;
  name_uz_cy?: string;
  name_ru?: string;
  name_en?: string;
  description?: string;
  description_uz_cy?: string;
  description_ru?: string;
  description_en?: string;
  region?: string;
  region_uz_cy?: string;
  region_ru?: string;
  region_en?: string;
  logo_url: string | null;
  banner_url: string | null;
  founded_year: number | null;
}

// Helper functions for article content
export function getLocalizedArticleTitle(article: MultilingualArticle, language: Language): string {
  switch (language) {
    case Language.UZ_CYRILLIC:
      return article.title_uz_cy || article.title;
    case Language.RUSSIAN:
      return article.title_ru || article.title;
    case Language.ENGLISH:
      return article.title_en || article.title;
    case Language.UZ_LATIN:
    default:
      return article.title;
  }
}

export function getLocalizedArticleSummary(article: MultilingualArticle, language: Language): string | null {
  switch (language) {
    case Language.UZ_CYRILLIC:
      return article.summary_uz_cy || article.summary || null;
    case Language.RUSSIAN:
      return article.summary_ru || article.summary || null;
    case Language.ENGLISH:
      return article.summary_en || article.summary || null;
    case Language.UZ_LATIN:
    default:
      return article.summary || null;
  }
}

export function getLocalizedArticleContent(article: MultilingualArticle, language: Language): string | null {
  switch (language) {
    case Language.UZ_CYRILLIC:
      return article.content_uz_cy || article.content || null;
    case Language.RUSSIAN:
      return article.content_ru || article.content || null;
    case Language.ENGLISH:
      return article.content_en || article.content || null;
    case Language.UZ_LATIN:
    default:
      return article.content || null;
  }
}

export function getLocalizedArticleKeywords(article: MultilingualArticle, language: Language): string | null {
  switch (language) {
    case Language.UZ_CYRILLIC:
      return article.keywords_uz_cy || article.keywords || null;
    case Language.RUSSIAN:
      return article.keywords_ru || article.keywords || null;
    case Language.ENGLISH:
      return article.keywords_en || article.keywords || null;
    case Language.UZ_LATIN:
    default:
      return article.keywords || null;
  }
}

// Helper functions for newspaper content
export function getLocalizedNewspaperName(newspaper: MultilingualNewspaper, language: Language): string {
  switch (language) {
    case Language.UZ_CYRILLIC:
      return newspaper.name_uz_cy || newspaper.name;
    case Language.RUSSIAN:
      return newspaper.name_ru || newspaper.name;
    case Language.ENGLISH:
      return newspaper.name_en || newspaper.name;
    case Language.UZ_LATIN:
    default:
      return newspaper.name;
  }
}

export function getLocalizedNewspaperDescription(newspaper: MultilingualNewspaper, language: Language): string | null {
  switch (language) {
    case Language.UZ_CYRILLIC:
      return newspaper.description_uz_cy || newspaper.description || null;
    case Language.RUSSIAN:
      return newspaper.description_ru || newspaper.description || null;
    case Language.ENGLISH:
      return newspaper.description_en || newspaper.description || null;
    case Language.UZ_LATIN:
    default:
      return newspaper.description || null;
  }
}

export function getLocalizedNewspaperRegion(newspaper: MultilingualNewspaper, language: Language): string | null {
  switch (language) {
    case Language.UZ_CYRILLIC:
      return newspaper.region_uz_cy || newspaper.region || null;
    case Language.RUSSIAN:
      return newspaper.region_ru || newspaper.region || null;
    case Language.ENGLISH:
      return newspaper.region_en || newspaper.region || null;
    case Language.UZ_LATIN:
    default:
      return newspaper.region || null;
  }
}