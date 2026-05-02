import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Get user from auth header
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify user token
  const userClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user }, error: authError } = await userClient.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = getAdminClient();

  // Get cheatsheet
  const { data: sheet } = await admin
    .from("cheatsheets")
    .select("id, pdf_path, is_free, is_published")
    .eq("slug", slug)
    .single();

  if (!sheet || !sheet.is_published) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Check access — free or purchased
  if (!sheet.is_free) {
    const { data: purchase } = await admin
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("cheatsheet_id", sheet.id)
      .maybeSingle();

    if (!purchase) return NextResponse.json({ error: "Purchase required" }, { status: 403 });
  }

  // Stream PDF from private bucket
  const { data, error } = await admin.storage.from("cheatsheets").download(sheet.pdf_path);
  if (error || !data) return NextResponse.json({ error: "PDF not found" }, { status: 404 });

  const buffer = await data.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Cache-Control": "private, no-store",
      "X-Frame-Options": "SAMEORIGIN",
    },
  });
}
