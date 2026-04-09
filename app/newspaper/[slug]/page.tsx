import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MultilingualNewspaper, MultilingualArticle } from "@/lib/localization";
import NewspaperPageContent from "@/components/NewspaperPageContent";

type Newspaper = MultilingualNewspaper;
type Article = MultilingualArticle;

async function getNewspaper(slug: string) {
  const { data, error } = await supabase
    .from("newspapers")
    .select("id,slug,name,name_uz_cy,name_ru,name_en,logo_url,banner_url,region,region_uz_cy,region_ru,region_en,description,description_uz_cy,description_ru,description_en,founded_year")
    .eq("slug", slug)
    .single();

  return { data: data as Newspaper | null, error };
}

async function getNewspaperArticles(newspaperId: string) {
  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,title_uz_cy,title_ru,title_en,summary,summary_uz_cy,summary_ru,summary_en,content,content_uz_cy,content_ru,content_en,keywords,keywords_uz_cy,keywords_ru,keywords_en,created_at,main_image_url,newspaper_id,category,author_name,author_role,author_bio,author_image_url")
    .eq("newspaper_id", newspaperId)
    .order("created_at", { ascending: false })
    .limit(10);

  return { data, error };
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