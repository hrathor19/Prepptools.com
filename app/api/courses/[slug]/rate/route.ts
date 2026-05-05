import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

async function getUser(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user } } = await client.auth.getUser(token);
  return user ?? null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const user = await getUser(request);
  if (!user) return NextResponse.json({ canRate: false, currentRating: null });

  const admin = getAdminClient();

  const { data: sheet } = await admin
    .from("cheatsheets")
    .select("id, is_free")
    .eq("slug", slug)
    .single();

  if (!sheet) return NextResponse.json({ canRate: false, currentRating: null });

  // Check access: free courses anyone can rate; paid require purchase
  let canRate = sheet.is_free;
  if (!canRate) {
    const { data: purchase } = await admin
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("cheatsheet_id", sheet.id)
      .maybeSingle();
    canRate = !!purchase;
  }

  if (!canRate) return NextResponse.json({ canRate: false, currentRating: null });

  const { data: existing } = await admin
    .from("course_ratings")
    .select("rating")
    .eq("cheatsheet_id", sheet.id)
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({ canRate: true, currentRating: existing?.rating ?? null });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let rating: number;
  try {
    const body = await request.json();
    rating = Number(body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error();
  } catch {
    return NextResponse.json({ error: "Rating must be an integer 1–5" }, { status: 400 });
  }

  const admin = getAdminClient();

  const { data: sheet } = await admin
    .from("cheatsheets")
    .select("id, is_free")
    .eq("slug", slug)
    .single();

  if (!sheet) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  // Verify access
  let canRate = sheet.is_free;
  if (!canRate) {
    const { data: purchase } = await admin
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("cheatsheet_id", sheet.id)
      .maybeSingle();
    canRate = !!purchase;
  }

  if (!canRate) {
    return NextResponse.json({ error: "Purchase required to rate" }, { status: 403 });
  }

  const { error } = await admin
    .from("course_ratings")
    .upsert(
      { cheatsheet_id: sheet.id, user_id: user.id, rating },
      { onConflict: "cheatsheet_id,user_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
