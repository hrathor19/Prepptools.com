import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminClient } from "@/lib/supabase";

async function isAuthenticated() {
  const cookieStore = await cookies();
  return !!cookieStore.get("admin_token")?.value;
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = getAdminClient();
  const { data, error } = await admin
    .from("cheatsheets")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const admin = getAdminClient();
  const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const { data, error } = await admin
    .from("cheatsheets")
    .insert({
      slug,
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
    })
    .select("id, slug")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
