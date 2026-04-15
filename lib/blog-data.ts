import { unstable_cache } from "next/cache";
import { supabase } from "./supabase";

export type BlogPost = {
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
  featured: boolean;
};

type DbRow = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  read_time: number;
  cover_emoji: string;
  cover_image_url: string | null;
  tags: string[];
  likes: number;
  featured: boolean;
};

function mapRow(row: DbRow): BlogPost {
  return {
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
    featured: row.featured ?? false,
  };
}

// Cached for 60 seconds — new posts appear on the listing within 1 minute
export const getAllBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("date", { ascending: false });
    if (error || !data) return [];
    return (data as DbRow[]).map(mapRow);
  },
  ["all-blog-posts"],
  { tags: ["blog-posts"], revalidate: 60 }
);

// Each post cached individually for 1 hour
export const getBlogPostBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) return null;
    return mapRow(data as DbRow);
  },
  ["blog-post-by-slug"],
  { tags: ["blog-posts"], revalidate: 3600 }
);

export async function getRecentPosts(count = 3): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.slice(0, count);
}

// Used by generateStaticParams — not cached (runs once at build time)
export async function getAllSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("published", true);
  return data?.map((r: { slug: string }) => r.slug) ?? [];
}
