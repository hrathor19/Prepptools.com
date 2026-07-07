import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { parseCheatsheetInput } from "@/lib/cheatsheet-validation";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const body = await request.json();
  const parsed = parseCheatsheetInput(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const input = parsed.data;

  const admin = getAdminClient();
  const { error } = await admin
    .from("cheatsheets")
    .update({
      title: input.title,
      description: input.description,
      long_description: input.longDescription,
      price: input.price,
      original_price: input.originalPrice,
      category: input.category,
      tags: input.tags,
      preview_image_url: input.previewImageUrl,
      pdf_path: input.pdfPath,
      pages: input.pages,
      is_published: input.isPublished,
      is_free: input.isFree,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const admin = getAdminClient();

  // Get pdf_path first to delete from storage
  const { data: sheet } = await admin.from("cheatsheets").select("pdf_path, preview_image_url").eq("id", id).single();

  if (sheet?.pdf_path) {
    await admin.storage.from("cheatsheets").remove([sheet.pdf_path]);
  }

  const { error } = await admin.from("cheatsheets").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
