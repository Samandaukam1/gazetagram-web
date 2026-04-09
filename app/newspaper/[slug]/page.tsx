import { notFound } from "next/navigation";
import { safeSelectQuery } from "@/lib/supabase-safe";
import { MultilingualNewspaper, MultilingualArticle } from "@/lib/localization";
import NewspaperPageContent from "@/components/NewspaperPageContent";

type Newspaper = MultilingualNewspaper;
type Article = MultilingualArticle;

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

async function getNewspaper(slug: string) {
  const { data, error } = await safeSelectQuery<Newspaper>(
    "newspapers",
    newspaperRequiredFields,
    newspaperOptionalFields,
    (query) => query.eq("slug", slug).single()
  );

  return { data: data as Newspaper | null, error };
}

async function getNewspaperArticles(newspaperId: string) {
  return safeSelectQuery<Article[]>(
    "articles",
    articleRequiredFields,
    articleOptionalFields,
    (query) =>
      query
        .eq("newspaper_id", newspaperId)
        .order("created_at", { ascending: false })
        .limit(10)
  );
}

export default async function NewspaperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const { data: newspaper, error: newspaperError } = await getNewspaper(slug);

  if (newspaperError || !newspaper) {
    notFound();
  }

  const { data: articles } = await getNewspaperArticles(newspaper.id);

  return (
    <NewspaperPageContent
      newspaper={newspaper}
      articles={articles || []}
    />
  );
}