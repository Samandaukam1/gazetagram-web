import { supabase } from "@/lib/supabase";
import { MultilingualArticle } from "@/lib/localization";
import ArticlesPageContent from "@/components/ArticlesPageContent";

type Article = MultilingualArticle;

async function getArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,title_uz_cy,title_ru,title_en,summary,summary_uz_cy,summary_ru,summary_en,content,content_uz_cy,content_ru,content_en,keywords,keywords_uz_cy,keywords_ru,keywords_en,main_image_url,created_at,newspaper_id,category,author_name,author_role,author_bio,author_image_url")
    .order("created_at", { ascending: false })
    .limit(50);

  return { data, error };
}

export default async function ArticlesPage() {
  const { data: articles, error } = await getArticles();

  return <ArticlesPageContent articles={articles || []} error={error} />;
}
