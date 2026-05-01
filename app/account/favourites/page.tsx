"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useAuth, getAuthClient } from "@/components/AuthProvider";
import { getToolBySlug } from "@/lib/tools-data";
import ToolCard from "@/components/ToolCard";

export default function FavouritesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tools, setTools] = useState<ReturnType<typeof getToolBySlug>[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) { router.replace("/login"); return; }
    if (!user) return;

    const client = getAuthClient();
    client
      .from("user_favourites")
      .select("tool_slug, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else {
          const resolved = (data ?? [])
            .map((r: { tool_slug: string }) => getToolBySlug(r.tool_slug))
            .filter(Boolean);
          setTools(resolved);
        }
        setFetching(false);
      });
  }, [user, loading, router]);

  const removeFavourite = async (slug: string) => {
    if (!user) return;
    const client = getAuthClient();
    await client.from("user_favourites").delete().eq("user_id", user.id).eq("tool_slug", slug);
    setTools((prev) => prev.filter((t) => t?.slug !== slug));
  };

  if (loading || fetching) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Favourite Tools</h1>
        <span className="text-sm text-gray-400 dark:text-gray-500">({tools.length})</span>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 mb-6 text-sm text-red-600 dark:text-red-400">
          Error loading favourites: {error}
        </div>
      )}

      {tools.length === 0 && !error ? (
        <div className="text-center py-16">
          <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No favourite tools yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-5">
            Click the heart icon on any tool to save it here
          </p>
          <Link href="/tools"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
            Browse Tools
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tools.map((tool) =>
            tool ? (
              <div key={tool.slug} className="relative group">
                <ToolCard tool={tool} />
                <button
                  onClick={() => removeFavourite(tool.slug)}
                  title="Remove from favourites"
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
