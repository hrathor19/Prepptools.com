import { getAdminClient } from "@/lib/supabase";
import CoursesWelcome from "@/components/cheatsheets/CoursesWelcome";
import CourseRow from "@/components/cheatsheets/CourseRow";
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

  const all = (sheets ?? []).map((s) => ({
    id:             s.id,
    slug:           s.slug,
    title:          s.title,
    description:    s.description ?? "",
    price:          s.price ?? 0,
    originalPrice:  s.original_price ?? null,
    isFree:         s.is_free ?? true,
    category:       s.category ?? "General",
    pages:          s.pages ?? 0,
    previewImageUrl: s.preview_image_url ?? null,
  }));

  // Group by category (preserving insertion order)
  const grouped = all.reduce<Record<string, typeof all>>((acc, c) => {
    (acc[c.category] ??= []).push(c);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome header — client component reads auth */}
        <CoursesWelcome />

        {all.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <FileText className="w-14 h-14 text-gray-300 mb-4" />
            <p className="text-lg font-semibold text-gray-500">No courses yet</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon — new content is on the way.</p>
          </div>
        ) : (
          <div>
            <div className="pt-8 pb-1">
              <h2 className="text-2xl font-bold text-gray-900">What to learn next</h2>
            </div>

            {/* All courses — first row */}
            <CourseRow
              title="Recommended for you"
              subtitle={`${all.length} course${all.length !== 1 ? "s" : ""} available`}
              courses={all}
            />

            {/* Per-category rows */}
            {categories.map((cat) =>
              grouped[cat].length >= 2 ? (
                <CourseRow
                  key={cat}
                  title={cat}
                  courses={grouped[cat]}
                />
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}
