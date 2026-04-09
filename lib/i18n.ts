// lib/i18n.ts - Centralized internationalization system for Gazetagram

export enum Language {
  UZ_LATIN = 'uz-latin',
  UZ_CYRILLIC = 'uz-cyrillic',
  RUSSIAN = 'ru',
  ENGLISH = 'en'
}

export const LANGUAGE_LABELS = {
  [Language.UZ_LATIN]: "O'zbekcha",
  [Language.UZ_CYRILLIC]: 'Ўзбекча',
  [Language.RUSSIAN]: 'Русский',
  [Language.ENGLISH]: 'English'
} as const;

export const LANGUAGE_CODES = {
  [Language.UZ_LATIN]: 'uz',
  [Language.UZ_CYRILLIC]: 'uz-cy',
  [Language.RUSSIAN]: 'ru',
  [Language.ENGLISH]: 'en'
} as const;

// UI Translation Keys
export type TranslationKey =
  | 'nav.home'
  | 'nav.articles'
  | 'nav.newspapers'
  | 'hero.latest_articles'
  | 'hero.featured_newspapers'
  | 'hero.read_article'
  | 'hero.view_all_newspapers'
  | 'articles.page_title'
  | 'articles.page_description'
  | 'articles.all_articles'
  | 'articles.loading_error'
  | 'articles.no_articles'
  | 'articles.reading_time'
  | 'article.author'
  | 'article.share'
  | 'article.related_articles'
  | 'article.back_to_articles'
  | 'article.published'
  | 'newspapers.page_title'
  | 'newspapers.page_description'
  | 'newspapers.loading_error'
  | 'newspapers.no_newspapers'
  | 'newspaper.articles'
  | 'newspaper.region'
  | 'newspaper.founded'
  | 'loading'
  | 'error'
  | 'not_found'
  | 'view_more';

// UI Translations
const UI_TRANSLATIONS: Record<Language, Record<TranslationKey, string>> = {
  [Language.UZ_LATIN]: {
    'nav.home': 'Bosh sahifa',
    'nav.articles': 'Maqolalar',
    'nav.newspapers': 'Gazetalar',
    'hero.latest_articles': 'So\'nggi maqolalar',
    'hero.featured_newspapers': 'Tanlangan gazetalar',
    'hero.read_article': 'Maqolani o\'qish',
    'hero.view_all_newspapers': 'Barcha gazetalar',
    'articles.page_title': 'Maqolalar',
    'articles.page_description': 'O\'zbekistonning eng so\'nggi yangiliklari va maqolalari',
    'articles.all_articles': 'Barcha maqolalar',
    'articles.loading_error': 'Maqolalarni yuklab bo\'lmadi',
    'articles.no_articles': 'Hozircha maqolalar mavjud emas',
    'articles.reading_time': 'o\'qish vaqti',
    'article.author': 'Muallif',
    'article.share': 'Ulashish',
    'article.related_articles': 'Tegishli maqolalar',
    'article.back_to_articles': 'Maqolalarga qaytish',
    'article.published': 'Nashr qilingan',
    'newspapers.page_title': 'Gazetalar',
    'newspapers.page_description': 'O\'zbekistonning eng ishonchli gazeta va yangilik manbalarini kashf qiling',
    'newspapers.loading_error': 'Gazetalarni yuklab bo\'lmadi',
    'newspapers.no_newspapers': 'Hozircha gazetalar mavjud emas',
    'newspaper.articles': 'Maqolalar',
    'newspaper.region': 'Hudud',
    'newspaper.founded': 'Tashkil topgan',
    'loading': 'Yuklanmoqda...',
    'error': 'Xatolik',
    'not_found': 'Topilmadi',
    'view_more': 'Ko\'proq ko\'rish'
  },
  [Language.UZ_CYRILLIC]: {
    'nav.home': 'Бош саҳифа',
    'nav.articles': 'Мақолалар',
    'nav.newspapers': 'Газеталар',
    'hero.latest_articles': 'Сўнги мақолалар',
    'hero.featured_newspapers': 'Танланган газеталар',
    'hero.read_article': 'Мақолани ўқиш',
    'hero.view_all_newspapers': 'Барча газеталар',
    'articles.page_title': 'Мақолалар',
    'articles.page_description': 'Ўзбекистоннинг энг сўнги янгиликлари ва мақолалари',
    'articles.all_articles': 'Барча мақолалар',
    'articles.loading_error': 'Мақолаларни юклаб бўлмади',
    'articles.no_articles': 'Ҳозирча мақолалар мавжуд эмас',
    'articles.reading_time': 'ўқиш вақти',
    'article.author': 'Муаллиф',
    'article.share': 'Улашиш',
    'article.related_articles': 'Тегишли мақолалар',
    'article.back_to_articles': 'Мақолаларга қайтиш',
    'article.published': 'Нашр қилинган',
    'newspapers.page_title': 'Газеталар',
    'newspapers.page_description': 'Ўзбекистоннинг энг ишончли газета ва янгилик манбаларини кашф қилинг',
    'newspapers.loading_error': 'Газеталарни юклаб бўлмади',
    'newspapers.no_newspapers': 'Ҳозирча газеталар мавжуд эмас',
    'newspaper.articles': 'Мақолалар',
    'newspaper.region': 'Ҳудуд',
    'newspaper.founded': 'Ташкил топган',
    'loading': 'Юкланмоқда...',
    'error': 'Хатолик',
    'not_found': 'Топилмади',
    'view_more': 'Кўпроқ кўриш'
  },
  [Language.RUSSIAN]: {
    'nav.home': 'Главная',
    'nav.articles': 'Статьи',
    'nav.newspapers': 'Газеты',
    'hero.latest_articles': 'Последние статьи',
    'hero.featured_newspapers': 'Избранные газеты',
    'hero.read_article': 'Читать статью',
    'hero.view_all_newspapers': 'Все газеты',
    'articles.page_title': 'Статьи',
    'articles.page_description': 'Последние новости и статьи Узбекистана',
    'articles.all_articles': 'Все статьи',
    'articles.loading_error': 'Не удалось загрузить статьи',
    'articles.no_articles': 'Статей пока нет',
    'articles.reading_time': 'время чтения',
    'article.author': 'Автор',
    'article.share': 'Поделиться',
    'article.related_articles': 'Похожие статьи',
    'article.back_to_articles': 'Вернуться к статьям',
    'article.published': 'Опубликовано',
    'newspapers.page_title': 'Газеты',
    'newspapers.page_description': 'Откройте для себя самые надежные источники газет и новостей Узбекистана',
    'newspapers.loading_error': 'Не удалось загрузить газеты',
    'newspapers.no_newspapers': 'Газет пока нет',
    'newspaper.articles': 'Статьи',
    'newspaper.region': 'Регион',
    'newspaper.founded': 'Основан',
    'loading': 'Загрузка...',
    'error': 'Ошибка',
    'not_found': 'Не найдено',
    'view_more': 'Показать больше'
  },
  [Language.ENGLISH]: {
    'nav.home': 'Home',
    'nav.articles': 'Articles',
    'nav.newspapers': 'Newspapers',
    'hero.latest_articles': 'Latest Articles',
    'hero.featured_newspapers': 'Featured Newspapers',
    'hero.read_article': 'Read Article',
    'hero.view_all_newspapers': 'View All Newspapers',
    'articles.page_title': 'Articles',
    'articles.page_description': 'Latest news and articles from Uzbekistan',
    'articles.all_articles': 'All Articles',
    'articles.loading_error': 'Failed to load articles',
    'articles.no_articles': 'No articles available yet',
    'articles.reading_time': 'reading time',
    'article.author': 'Author',
    'article.share': 'Share',
    'article.related_articles': 'Related Articles',
    'article.back_to_articles': 'Back to Articles',
    'article.published': 'Published',
    'newspapers.page_title': 'Newspapers',
    'newspapers.page_description': 'Discover Uzbekistan\'s most trusted newspapers and news sources',
    'newspapers.loading_error': 'Failed to load newspapers',
    'newspapers.no_newspapers': 'No newspapers available yet',
    'newspaper.articles': 'Articles',
    'newspaper.region': 'Region',
    'newspaper.founded': 'Founded',
    'loading': 'Loading...',
    'error': 'Error',
    'not_found': 'Not Found',
    'view_more': 'View More'
  }
};

// Helper function to get UI translation
export function t(key: TranslationKey, language: Language): string {
  return UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS[Language.UZ_LATIN][key] || key;
}

// Language persistence
export const LANGUAGE_STORAGE_KEY = 'gazetagram-language';

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return Language.UZ_LATIN;

  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && Object.values(Language).includes(stored as Language)) {
    return stored as Language;
  }
  return Language.UZ_LATIN;
}

export function setStoredLanguage(language: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
}

// Default language for SSR
export const DEFAULT_LANGUAGE = Language.UZ_LATIN;