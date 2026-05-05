import { SupabaseClient } from "@supabase/supabase-js";

export async function getAvgRatings(
  admin: SupabaseClient,
  courseIds: string[]
): Promise<Record<string, number>> {
  if (!courseIds.length) return {};

  const { data } = await admin
    .from("course_ratings")
    .select("cheatsheet_id, rating")
    .in("cheatsheet_id", courseIds);

  if (!data?.length) return {};

  const grouped: Record<string, number[]> = {};
  for (const r of data) {
    (grouped[r.cheatsheet_id] ??= []).push(r.rating);
  }

  const result: Record<string, number> = {};
  for (const [id, vals] of Object.entries(grouped)) {
    result[id] = vals.reduce((a, b) => a + b, 0) / vals.length;
  }
  return result;
}
