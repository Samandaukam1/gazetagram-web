import { supabase } from "@/lib/supabase";
import { MultilingualNewspaper } from "@/lib/localization";
import NewspapersPageContent from "@/components/NewspapersPageContent";

type Newspaper = MultilingualNewspaper;

async function getNewspapers() {
  const { data, error } = await supabase
    .from("newspapers")
    .select("id,slug,name,name_uz_cy,name_ru,name_en,logo_url,banner_url,region,region_uz_cy,region_ru,region_en,description,description_uz_cy,description_ru,description_en,founded_year")
    .order("name", { ascending: true });

  return { data, error };
}

export default async function NewspapersPage() {
  const { data: newspapers, error } = await getNewspapers();

  return <NewspapersPageContent newspapers={newspapers || []} error={error} />;
}