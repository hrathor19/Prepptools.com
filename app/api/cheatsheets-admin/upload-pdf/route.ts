import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const type = (formData.get("type") as string) ?? "pdf"; // "pdf" or "image"

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const admin = getAdminClient();

  if (type === "image") {
    const ext = ALLOWED_IMAGE_TYPES[file.type];
    if (!ext) return NextResponse.json({ error: "Only JPG, PNG, WEBP or GIF allowed" }, { status: 400 });
    if (file.size > MAX_IMAGE_SIZE) return NextResponse.json({ error: "Image must be under 5 MB" }, { status: 400 });

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Preview image → public blog-covers bucket
    const { error } = await admin.storage
      .from("blog-covers")
      .upload(filename, await file.arrayBuffer(), { contentType: file.type, upsert: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const { data: { publicUrl } } = admin.storage.from("blog-covers").getPublicUrl(filename);
    return NextResponse.json({ url: publicUrl, path: filename });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
  }
  if (file.size > MAX_PDF_SIZE) return NextResponse.json({ error: "File too large (max 20MB)" }, { status: 400 });

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;

  // PDF → private cheatsheets bucket
  const { error } = await admin.storage
    .from("cheatsheets")
    .upload(filename, await file.arrayBuffer(), { contentType: "application/pdf", upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ path: filename });
}
