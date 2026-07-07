import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { parseCheatsheetInput } from "@/lib/cheatsheet-validation";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = getAdminClient();
  const { data, error } = await admin
    .from("cheatsheets")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = parseCheatsheetInput(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const input = parsed.data;

  const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const admin = getAdminClient();
  const { data, error } = await admin
    .from("cheatsheets")
    .insert({
      slug,
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
    })
    .select("id, slug")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
