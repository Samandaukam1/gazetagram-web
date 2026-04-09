import { MultilingualArticle } from "@/lib/localization";
import { safeSelectQuery } from "@/lib/supabase-safe";
import ArticlesPageContent from "@/components/ArticlesPageContent";

type Article = MultilingualArticle;

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

async function getArticles() {
  return safeSelectQuery<Article[]>(
    "articles",
    articleRequiredFields,
    articleOptionalFields,
    (query) => query.order("created_at", { ascending: false }).limit(50)
  );
}

export default async function ArticlesPage() {
  const { data: articles, error } = await getArticles();

  return <ArticlesPageContent articles={articles || []} error={error} />;
}
