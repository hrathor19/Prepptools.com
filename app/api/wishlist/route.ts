import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminClient } from "@/lib/supabase";

async function getUser(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ).auth.getUser(token);
  return user ?? null;
}

// GET /api/wishlist                    → list all wishlisted courses
// GET /api/wishlist?cheatsheetId=xxx   → check if specific course is wishlisted
export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cheatsheetId = request.nextUrl.searchParams.get("cheatsheetId");
  const admin = getAdminClient();

  if (cheatsheetId) {
    const { data } = await admin
      .from("course_wishlists")
      .select("id")
      .eq("user_id", user.id)
      .eq("cheatsheet_id", cheatsheetId)
      .maybeSingle();
    return NextResponse.json({ wishlisted: !!data });
  }

  const { data: wishlist } = await admin
    .from("course_wishlists")
    .select("id, cheatsheet_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!wishlist?.length) return NextResponse.json({ items: [] });

  const ids = wishlist.map((w) => w.cheatsheet_id);
  const { data: courses } = await admin
    .from("cheatsheets")
    .select("id, slug, title, description, price, is_free, category, pages, preview_image_url")
    .in("id", ids);

  const courseMap = new Map((courses ?? []).map((c) => [c.id, c]));

  const items = wishlist
    .map((w) => {
      const c = courseMap.get(w.cheatsheet_id);
      if (!c) return null;
      return {
        wishlistId: w.id,
        id: c.id,
        slug: c.slug,
        title: c.title,
        description: c.description ?? "",
        price: c.price ?? 0,
        isFree: c.is_free,
        category: c.category,
        pages: c.pages ?? 0,
        previewImageUrl: c.preview_image_url ?? null,
      };
    })
    .filter(Boolean);

  return NextResponse.json({ items });
}

// POST /api/wishlist  { cheatsheetId } → add to wishlist
export async function POST(request: NextRequest) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cheatsheetId } = await request.json();
  if (!cheatsheetId) return NextResponse.json({ error: "Missing cheatsheetId" }, { status: 400 });

  const admin = getAdminClient();
  const { error } = await admin
    .from("course_wishlists")
    .insert({ user_id: user.id, cheatsheet_id: cheatsheetId });

  // 23505 = unique_violation (already in wishlist) — treat as success
  if (error && error.code !== "23505") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/wishlist  { cheatsheetId } → remove from wishlist
export async function DELETE(request: NextRequest) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cheatsheetId } = await request.json();
  if (!cheatsheetId) return NextResponse.json({ error: "Missing cheatsheetId" }, { status: 400 });

  const admin = getAdminClient();
  await admin
    .from("course_wishlists")
    .delete()
    .eq("user_id", user.id)
    .eq("cheatsheet_id", cheatsheetId);

  return NextResponse.json({ success: true });
}
