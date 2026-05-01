import { getAdminClient } from "@/lib/supabase";
import CheatsheetForm from "@/components/cheatsheets/CheatsheetForm";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Cheatsheet" };

export default async function EditCheatsheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = getAdminClient();

  const { data: sheet } = await admin
    .from("cheatsheets")
    .select("*")
    .eq("id", id)
    .single();

  if (!sheet) notFound();

  const initial = {
    title: sheet.title ?? "",
    description: sheet.description ?? "",
    longDescription: sheet.long_description ?? "",
    price: sheet.price ? String(sheet.price / 100) : "",
    category: sheet.category ?? "General",
    tags: Array.isArray(sheet.tags) ? sheet.tags.join(", ") : "",
    pages: sheet.pages ? String(sheet.pages) : "",
    isPublished: sheet.is_published ?? false,
    isFree: sheet.is_free ?? false,
    pdfPath: sheet.pdf_path ?? "",
    previewImageUrl: sheet.preview_image_url ?? "",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Edit Cheatsheet</h1>
        <p className="text-sm text-gray-400 mt-0.5">{sheet.title}</p>
      </div>
      <CheatsheetForm initial={initial} id={id} />
    </div>
  );
}
