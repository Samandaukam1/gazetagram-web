import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MultilingualArticle, MultilingualNewspaper } from "@/lib/localization";
import ArticlePageContent from "@/components/ArticlePageContent";

type Article = MultilingualArticle;
type NewspaperIdentity = MultilingualNewspaper;
type RelatedArticle = MultilingualArticle;

async function getArticle(slug: string) {
  if (!slug || slug === "undefined" || slug === "null") {
    return { data: null, error: new Error("Invalid slug provided") as any };
  }

  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,title_uz_cy,title_ru,title_en,summary,summary_uz_cy,summary_ru,summary_en,content,content_uz_cy,content_ru,content_en,created_at,main_image_url,newspaper_id,category,author_name,author_role,author_bio,author_image_url")
    .eq("slug", slug)
    .single();

  return { data: data as Article | null, error };
}

async function getNewspaperById(id: string) {
  const { data, error } = await supabase
    .from("newspapers")
    .select("id,name,name_uz_cy,name_ru,name_en,logo_url,slug")
    .eq("id", id)
    .single();

  return { data: data as NewspaperIdentity | null, error };
}

async function getRelatedArticles(article: Article) {
  const relatedByNewspaper = article.newspaper_id
    ? await supabase
        .from("articles")
        .select("id,slug,title,title_uz_cy,title_ru,title_en,summary,summary_uz_cy,summary_ru,summary_en,content,content_uz_cy,content_ru,content_en,keywords,keywords_uz_cy,keywords_ru,keywords_en,created_at,main_image_url,newspaper_id,category,author_name,author_role,author_bio,author_image_url")
        .eq("newspaper_id", article.newspaper_id)
        .neq("id", article.id)
        .order("created_at", { ascending: false })
        .limit(3)
    : { data: null, error: null };

  if (relatedByNewspaper.data && relatedByNewspaper.data.length > 0) {
    return relatedByNewspaper.data;
  }

  if (article.category) {
    const relatedByCategory = await supabase
      .from("articles")
      .select("id,slug,title,title_uz_cy,title_ru,title_en,summary,summary_uz_cy,summary_ru,summary_en,content,content_uz_cy,content_ru,content_en,keywords,keywords_uz_cy,keywords_ru,keywords_en,created_at,main_image_url,newspaper_id,category,author_name,author_role,author_bio,author_image_url")
      .eq("category", article.category)
      .neq("id", article.id)
      .order("created_at", { ascending: false })
      .limit(3);

    if (relatedByCategory.data) {
      return relatedByCategory.data;
    }
  }

  // Fallback: get latest articles
  const { data } = await supabase
    .from("articles")
    .select("id,slug,title,title_uz_cy,title_ru,title_en,summary,summary_uz_cy,summary_ru,summary_en,content,content_uz_cy,content_ru,content_en,keywords,keywords_uz_cy,keywords_ru,keywords_en,created_at,main_image_url,newspaper_id,category,author_name,author_role,author_bio,author_image_url")
    .neq("id", article.id)
    .order("created_at", { ascending: false })
    .limit(3);

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