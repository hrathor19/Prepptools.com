import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminClient } from "@/lib/supabase";

async function isAuthenticated() {
  const cookieStore = await cookies();
  return !!cookieStore.get("admin_token")?.value;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const admin = getAdminClient();
  const { error } = await admin
    .from("cheatsheets")
    .update({
      title: body.title,
      description: body.description,
      long_description: body.longDescription ?? "",
      price: Number(body.price) * 100,
      original_price: body.originalPrice ? Number(body.originalPrice) * 100 : null,
      category: body.category ?? "General",
      tags: body.tags ?? [],
      preview_image_url: body.previewImageUrl ?? null,
      pdf_path: body.pdfPath,
      pages: Number(body.pages) || 0,
      is_published: body.isPublished ?? false,
      is_free: body.isFree ?? false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
