import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

async function isAuthenticated() {
  const cookieStore = await cookies();
  return !!cookieStore.get("admin_token")?.value;
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const admin = getAdminClient();

  const { data, error } = await admin
    .from("blog_posts")
    .insert({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      author: body.author,
      date: body.date,
      read_time: Number(body.readTime),
      cover_emoji: body.coverEmoji,
      cover_image_url: body.coverImageUrl ?? null,
      tags: body.tags,
      published: body.published,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  revalidatePath("/blog", "layout");
  return NextResponse.json({ id: data.id });
}
