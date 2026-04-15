import { getAdminClient } from "./supabase";

export type AdminPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: number;
  coverEmoji: string;
  coverImageUrl: string | null;
  tags: string[];
  likes: number;
  published: boolean;
  featured: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): AdminPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    date: row.date,
    readTime: row.read_time,
    coverEmoji: row.cover_emoji,
    coverImageUrl: row.cover_image_url ?? null,
    tags: row.tags ?? [],
    likes: row.likes ?? 0,
    published: row.published,
    featured: row.featured ?? false,
  };
}

export async function getAllPostsAdmin(): Promise<AdminPost[]> {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from("blog_posts")
    .select("*")
    .order("date", { ascending: false });
  if (error || !data) return [];
  return data.map(mapRow);
}

export async function getPostByIdAdmin(id: string): Promise<AdminPost | null> {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return mapRow(data);
}
