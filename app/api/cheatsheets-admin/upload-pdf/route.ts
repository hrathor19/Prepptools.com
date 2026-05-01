import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminClient } from "@/lib/supabase";

const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

async function isAuthenticated() {
  const cookieStore = await cookies();
  return !!cookieStore.get("admin_token")?.value;
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const type = (formData.get("type") as string) ?? "pdf"; // "pdf" or "image"

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "File too large (max 20MB)" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const admin = getAdminClient();

  if (type === "image") {
    // Preview image → public blog-covers bucket
    const { error } = await admin.storage
      .from("blog-covers")
      .upload(filename, await file.arrayBuffer(), { contentType: file.type, upsert: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const { data: { publicUrl } } = admin.storage.from("blog-covers").getPublicUrl(filename);
    return NextResponse.json({ url: publicUrl, path: filename });
  }

  // PDF → private cheatsheets bucket
  const { error } = await admin.storage
    .from("cheatsheets")
    .upload(filename, await file.arrayBuffer(), { contentType: "application/pdf", upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ path: filename });
}
