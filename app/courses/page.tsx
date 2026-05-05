import { getAdminClient } from "@/lib/supabase";
import CoursesWelcome from "@/components/cheatsheets/CoursesWelcome";
import CoursesPageClient from "@/components/cheatsheets/CoursesPageClient";
import { getAvgRatings } from "@/lib/ratings";
import { FileText } from "lucide-react";

export const metadata = { title: "Courses | PreppTools" };
export const revalidate = 60;

export default async function CheatsheetListPage() {
  const admin = getAdminClient();

  const { data: sheets } = await admin
    .from("cheatsheets")
    .select("id, slug, title, description, price, original_price, category, pages, is_free, preview_image_url")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const rawCourses = (sheets ?? []).map((s) => ({
    id:              s.id,
    slug:            s.slug,
    title:           s.title,
    description:     s.description ?? "",
    price:           s.price ?? 0,
    originalPrice:   s.original_price ?? null,
    isFree:          s.is_free ?? true,
    category:        s.category ?? "General",
    pages:           s.pages ?? 0,
    previewImageUrl: s.preview_image_url ?? null,
  }));

  const ratingMap = await getAvgRatings(admin, rawCourses.map((c) => c.id));
  const all = rawCourses.map((c) => ({ ...c, avgRating: ratingMap[c.id] ?? null }));

  const grouped = all.reduce<Record<string, typeof all>>((acc, c) => {
    (acc[c.category] ??= []).push(c);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CoursesWelcome />

        {all.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <FileText className="w-14 h-14 text-gray-300 mb-4" />
            <p className="text-lg font-semibold text-gray-500">No courses yet</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon — new content is on the way.</p>
          </div>
        ) : (
          <CoursesPageClient courses={all} categories={categories} grouped={grouped} />
        )}
      </div>
    </div>
  );
}
