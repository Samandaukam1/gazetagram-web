import { MultilingualArticle, MultilingualNewspaper } from "@/lib/localization";
import { safeSelectQuery } from "@/lib/supabase-safe";
import HomePageContent from "@/components/HomePageContent";

type Article = MultilingualArticle;
type Newspaper = MultilingualNewspaper;

const articleRequiredFields = [
  "id",
  "slug",
  "title",
  "summary",
  "content",
  "created_at",
  "main_image_url",
  "newspaper_id",
  "category",
  "author_name",
  "author_role",
  "author_bio",
  "author_image_url",
];

const articleOptionalFields = [
  "title_uz_cy",
  "title_ru",
  "title_en",
  "summary_uz_cy",
  "summary_ru",
  "summary_en",
  "content_uz_cy",
  "content_ru",
  "content_en",
  "keywords",
  "keywords_uz_cy",
  "keywords_ru",
  "keywords_en",
];

const newspaperRequiredFields = [
  "id",
  "slug",
  "name",
  "logo_url",
  "banner_url",
  "region",
  "description",
  "founded_year",
];

const newspaperOptionalFields = [
  "name_uz_cy",
  "name_ru",
  "name_en",
  "region_uz_cy",
  "region_ru",
  "region_en",
  "description_uz_cy",
  "description_ru",
  "description_en",
];

async function getFeaturedArticle() {
  const { data, error } = await safeSelectQuery<Article[]>(
    "articles",
    articleRequiredFields,
    articleOptionalFields,
    (query) => query.not("main_image_url", "is", null).order("created_at", { ascending: false }).limit(1)
  );

  return { data: data?.[0] || null, error };
}

async function getLatestArticles() {
  return safeSelectQuery<Article[]>(
    "articles",
    articleRequiredFields,
    articleOptionalFields,
    (query) => query.order("created_at", { ascending: false }).limit(6)
  );
}

async function getNewspapers() {
  return safeSelectQuery<Newspaper[]>(
    "newspapers",
    newspaperRequiredFields,
    newspaperOptionalFields,
    (query) => query.limit(6)
  );
}

export default async function Home() {
  const { data: featuredArticle, error: featuredError } = await getFeaturedArticle();
  const { data: articles, error: articlesError } = await getLatestArticles();
  const { data: newspapers, error: newspapersError } = await getNewspapers();

  return (
    <HomePageContent
      featuredArticle={featuredArticle}
      articles={articles || []}
      newspapers={newspapers || []}
      featuredError={featuredError}
      articlesError={articlesError}
      newspapersError={newspapersError}
    />
  );
}