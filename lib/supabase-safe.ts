import { supabase } from "@/lib/supabase";

const safeMissingColumns = new Map<string, Set<string>>();

function parseMissingColumns(message: string): string[] {
  const columns: string[] = [];
  const regex = /column "([^"]+)" does not exist|column '([^']+)' does not exist/gi;
  let match;

  while ((match = regex.exec(message))) {
    columns.push(match[1] || match[2]);
  }

  return columns;
}

export async function safeSelectQuery<T = any>(
  table: string,
  requiredFields: string[],
  optionalFields: string[] = [],
  queryBuilder?: (query: any) => any
): Promise<{ data: T; error: any; selectedFields: string[] }> {
  const missingColumns = safeMissingColumns.get(table) ?? new Set<string>();
  let activeOptional = optionalFields.filter((field) => !missingColumns.has(field));
  let selectedFields = [...requiredFields, ...activeOptional];
  let response: any;

  while (true) {
    const selectString = selectedFields.join(",");
    console.log(`[safeSelectQuery] table=${table} selectFields=${selectString}`);

    const baseQuery = supabase.from(table).select(selectString);
    const query = queryBuilder ? queryBuilder(baseQuery) : baseQuery;
    response = await query;

    if (!response.error) {
      return { data: response.data as T, error: response.error, selectedFields };
    }

    const missing = parseMissingColumns(response.error.message || "");
    if (!missing.length) {
      return { data: response.data as T, error: response.error, selectedFields };
    }

    missing.forEach((column) => {
      missingColumns.add(column);
      activeOptional = activeOptional.filter((field) => field !== column);
    });

    safeMissingColumns.set(table, missingColumns);
    selectedFields = [...requiredFields, ...activeOptional];

    console.log(
      `[safeSelectQuery] table=${table} dropped missing optional columns=${missing.join(", ")} and retrying with ${selectedFields.join(", ")}`
    );

    if (activeOptional.length === 0) {
      break;
    }
  }

  const finalQuery = queryBuilder
    ? queryBuilder(supabase.from(table).select(selectedFields.join(",")))
    : supabase.from(table).select(selectedFields.join(","));

  response = await finalQuery;
  return { data: response.data as T, error: response.error, selectedFields };
}
