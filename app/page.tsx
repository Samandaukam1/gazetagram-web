import { supabase } from "@/lib/supabase";
import { MultilingualArticle, MultilingualNewspaper } from "@/lib/localization";
import HomePageContent from "@/components/HomePageContent";

type Article = MultilingualArticle;
type Newspaper = MultilingualNewspaper;

async function getFeaturedArticle() {
  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,title_uz_cy,title_ru,title_en,summary,summary_uz_cy,summary_ru,summary_en,content,content_uz_cy,content_ru,content_en,keywords,keywords_uz_cy,keywords_ru,keywords_en,main_image_url,created_at,newspaper_id,category,author_name,author_role,author_bio,author_image_url")
    .not("main_image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(1);

  return { data: data?.[0] || null, error };
}

async function getLatestArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,title_uz_cy,title_ru,title_en,summary,summary_uz_cy,summary_ru,summary_en,content,content_uz_cy,content_ru,content_en,keywords,keywords_uz_cy,keywords_ru,keywords_en,main_image_url,created_at,newspaper_id,category,author_name,author_role,author_bio,author_image_url")
    .order("created_at", { ascending: false })
    .limit(6);

  return { data, error };
}

async function getNewspapers() {
  const { data, error } = await supabase
    .from("newspapers")
    .select("id,slug,name,name_uz_cy,name_ru,name_en,logo_url,banner_url,region,region_uz_cy,region_ru,region_en,description,description_uz_cy,description_ru,description_en,founded_year")
    .limit(6);

  return { data, error };
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