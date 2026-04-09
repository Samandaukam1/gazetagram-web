import { notFound } from "next/navigation";
import { safeSelectQuery } from "@/lib/supabase-safe";
import { MultilingualArticle, MultilingualNewspaper } from "@/lib/localization";
import ArticlePageContent from "@/components/ArticlePageContent";

type Article = MultilingualArticle;
type NewspaperIdentity = MultilingualNewspaper;
type RelatedArticle = MultilingualArticle;

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

const newspaperRequiredFields = ["id", "name", "logo_url", "slug"];
const newspaperOptionalFields = ["name_uz_cy", "name_ru", "name_en"];

async function getArticle(slug: string) {
  if (!slug || slug === "undefined" || slug === "null") {
    return { data: null, error: new Error("Invalid slug provided") as any };
  }

  const { data, error } = await safeSelectQuery<Article>(
    "articles",
    articleRequiredFields,
    articleOptionalFields,
    (query) => query.eq("slug", slug).single()
  );

  return { data: data as Article | null, error };
}

async function getNewspaperById(id: string) {
  const { data, error } = await safeSelectQuery<NewspaperIdentity>(
    "newspapers",
    newspaperRequiredFields,
    newspaperOptionalFields,
    (query) => query.eq("id", id).single()
  );

  return { data: data as NewspaperIdentity | null, error };
}

async function getRelatedArticles(article: Article) {
  const relatedByNewspaper = article.newspaper_id
    ? await safeSelectQuery<RelatedArticle[]>(
        "articles",
        articleRequiredFields,
        articleOptionalFields,
        (query) =>
          query
            .eq("newspaper_id", article.newspaper_id)
            .neq("id", article.id)
            .order("created_at", { ascending: false })
            .limit(3)
      )
    : { data: null, error: null };

  if (relatedByNewspaper.data && relatedByNewspaper.data.length > 0) {
    return relatedByNewspaper.data;
  }

  if (article.category) {
    const relatedByCategory = await safeSelectQuery<RelatedArticle[]>(
      "articles",
      articleRequiredFields,
      articleOptionalFields,
      (query) =>
        query
          .eq("category", article.category)
          .neq("id", article.id)
          .order("created_at", { ascending: false })
          .limit(3)
    );

    if (relatedByCategory.data) {
      return relatedByCategory.data;
    }
  }

  // Fallback: get latest articles
  const { data } = await safeSelectQuery<RelatedArticle[]>(
    "articles",
    articleRequiredFields,
    articleOptionalFields,
    (query) =>
      query
        .neq("id", article.id)
        .order("created_at", { ascending: false })
        .limit(3)
  );

  return data || [];
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug || slug === "undefined") {
    notFound();
  }

  const { data: article, error } = await getArticle(slug);

  if (error || !article) {
    notFound();
  }

  const articleNewspaperResult = article.newspaper_id
    ? await getNewspaperById(article.newspaper_id)
    : ({ data: null, error: null } as { data: null; error: null });

  const relatedArticles = await getRelatedArticles(article);

  return (
    <ArticlePageContent
      article={article}
      newspaper={articleNewspaperResult.data}
      relatedArticles={relatedArticles}
    />
  );
}