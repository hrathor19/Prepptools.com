"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bookmark, Clock, BookOpen } from "lucide-react";
import { useAuth, getAuthClient } from "@/components/AuthProvider";

type SavedBlog = {
  blog_slug: string;
  saved_at: string;
  title: string;
  cover_emoji: string;
  read_time: number;
  excerpt: string;
};

export default function SavedBlogsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [blogs, setBlogs] = useState<SavedBlog[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) { router.replace("/login"); return; }
    if (!user) return;

    const client = getAuthClient();

    const fetchSavedBlogs = async () => {
      // Step 1: get saved slugs
      const { data: saved, error: savedErr } = await client
        .from("user_saved_blogs")
        .select("blog_slug, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (savedErr) { setError(savedErr.message); setFetching(false); return; }
      if (!saved || saved.length === 0) { setFetching(false); return; }

      const slugs = saved.map((r: { blog_slug: string }) => r.blog_slug);

      // Step 2: fetch actual blog data from blog_posts table
      const { data: posts, error: postsErr } = await client
        .from("blog_posts")
        .select("slug, title, cover_emoji, read_time, excerpt")
        .in("slug", slugs);

      if (postsErr) { setError(postsErr.message); setFetching(false); return; }

      // Merge saved order with blog data
      const postMap = new Map((posts ?? []).map((p: { slug: string; title: string; cover_emoji: string; read_time: number; excerpt: string }) => [p.slug, p]));
      const merged: SavedBlog[] = saved.map((r: { blog_slug: string; created_at: string }) => {
        const post = postMap.get(r.blog_slug);
        return {
          blog_slug: r.blog_slug,
          saved_at: r.created_at,
          title: post?.title ?? r.blog_slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
          cover_emoji: post?.cover_emoji ?? "📄",
          read_time: post?.read_time ?? 0,
          excerpt: post?.excerpt ?? "",
        };
      });

      setBlogs(merged);
      setFetching(false);
    };

    fetchSavedBlogs();
  }, [user, loading, router]);

  const unsave = async (slug: string) => {
    if (!user) return;
    const client = getAuthClient();
    const { error } = await client
      .from("user_saved_blogs")
      .delete()
      .eq("user_id", user.id)
      .eq("blog_slug", slug);
    if (!error) setBlogs((prev) => prev.filter((b) => b.blog_slug !== slug));
  };

  if (loading || fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-2 mb-6">
        <Bookmark className="w-5 h-5 text-blue-600 fill-blue-600" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Saved Blogs</h1>
        <span className="text-sm text-gray-400 dark:text-gray-500">({blogs.length})</span>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 mb-6 text-sm text-red-600 dark:text-red-400">
          Error loading saved blogs: {error}
        </div>
      )}

      {blogs.length === 0 && !error ? (
        <div className="text-center py-16">
          <Bookmark className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No saved blogs yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-5">
            Click the bookmark icon on any blog post to save it here
          </p>
          <Link href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
            Browse Blogs
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map((b) => (
            <div key={b.blog_slug}
              className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-200 dark:hover:border-blue-700 transition-colors">
              <span className="text-3xl shrink-0">{b.cover_emoji}</span>
              <div className="flex-1 min-w-0">
                <Link href={`/blog/${b.blog_slug}`}
                  className="text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1 block transition-colors">
                  {b.title}
                </Link>
                {b.excerpt && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">{b.excerpt}</p>
                )}
                <div className="flex items-center gap-3 mt-1.5">
                  {b.read_time > 0 && (
                    <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <BookOpen className="w-3 h-3" />{b.read_time} min read
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                    <Clock className="w-3 h-3" />
                    Saved {new Date(b.saved_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => unsave(b.blog_slug)}
                title="Remove saved blog"
                className="shrink-0 p-1.5 rounded-lg text-blue-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
