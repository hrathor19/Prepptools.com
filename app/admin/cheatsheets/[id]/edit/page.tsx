import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminClient } from "@/lib/supabase";
import CheatsheetForm from "@/components/cheatsheets/CheatsheetForm";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Course | Admin" };
export const dynamic = "force-dynamic";

export default async function EditCheatsheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = getAdminClient();

  const [{ data: sheet }, { data: catData }] = await Promise.all([
    admin.from("cheatsheets").select("*").eq("id", id).single(),
    admin.from("course_categories").select("name").order("name"),
  ]);
  if (!sheet) notFound();

  const categories = (catData ?? []).map((r) => r.name);

  const initial = {
    title: sheet.title ?? "",
    description: sheet.description ?? "",
    longDescription: sheet.long_description ?? "",
    price: sheet.price ? String(sheet.price / 100) : "",
    originalPrice: sheet.original_price ? String(sheet.original_price / 100) : "",
    category: sheet.category ?? "General",
    tags: Array.isArray(sheet.tags) ? sheet.tags.join(", ") : "",
    pages: sheet.pages ? String(sheet.pages) : "",
    isPublished: sheet.is_published ?? false,
    isFree: sheet.is_free ?? false,
    pdfPath: sheet.pdf_path ?? "",
    previewImageUrl: sheet.preview_image_url ?? "",
  };

  return (
    <div className="space-y-6">
      <Link href="/admin/cheatsheets" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Courses
      </Link>
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Edit Course</h1>
        <p className="text-sm text-gray-500 mt-0.5">{sheet.title}</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8">
        <CheatsheetForm initial={initial} id={id} redirectTo="/admin/cheatsheets" categories={categories} />
      </div>
    </div>
  );
}
