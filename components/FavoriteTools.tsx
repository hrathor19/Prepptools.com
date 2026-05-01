"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useAuth, getAuthClient } from "@/components/AuthProvider";
import { getToolBySlug } from "@/lib/tools-data";
import type { Tool } from "@/lib/tools-data";
import ToolCard from "./ToolCard";

export default function FavoriteTools() {
  const { user, loading } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) { setFetching(false); return; }

    const client = getAuthClient();
    client
      .from("user_favourites")
      .select("tool_slug")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        const resolved = (data ?? [])
          .map((r: { tool_slug: string }) => getToolBySlug(r.tool_slug))
          .filter((t): t is Tool => t !== undefined);
        setTools(resolved);
        setFetching(false);
      });
  }, [user]);

  // Don't show if not logged in, still loading, or no favourites
  if (loading || fetching || !user || tools.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-red-500 fill-current" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Your Favorites</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">Tools you&apos;ve saved</p>
          </div>
        </div>
        <Link
          href="/account/favourites"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
