import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let action: "like" | "unlike";
  try {
    const body = await request.json();
    action = body.action === "unlike" ? "unlike" : "like";
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const admin = getAdminClient();
  const rpcName = action === "like" ? "increment_blog_likes" : "decrement_blog_likes";

  const { error } = await admin.rpc(rpcName, { post_slug: slug });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = await admin
    .from("blog_posts")
    .select("likes")
    .eq("slug", slug)
    .single();

  return NextResponse.json({ likes: data?.likes ?? 0 });
}
