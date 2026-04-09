import { MultilingualNewspaper } from "@/lib/localization";
import { safeSelectQuery } from "@/lib/supabase-safe";
import NewspapersPageContent from "@/components/NewspapersPageContent";

type Newspaper = MultilingualNewspaper;

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

async function getNewspapers() {
  return safeSelectQuery<Newspaper[]>(
    "newspapers",
    newspaperRequiredFields,
    newspaperOptionalFields,
    (query) => query.order("name", { ascending: true })
  );
}

export default async function NewspapersPage() {
  const { data: newspapers, error } = await getNewspapers();

  return <NewspapersPageContent newspapers={newspapers || []} error={error} />;
}