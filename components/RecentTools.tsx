"use client";

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { useRecentTools } from "@/hooks/useRecentTools";
import { getToolBySlug } from "@/lib/tools-data";
import ToolCard from "./ToolCard";

export default function RecentTools() {
  const slugs = useRecentTools();
  const tools = slugs
    .map((slug) => getToolBySlug(slug))
    .filter((t) => t !== undefined);

  if (tools.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Jump Back In</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">Your recently used tools</p>
          </div>
        </div>
        <Link
          href="/tools"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
        >
          All Tools <ArrowRight className="w-4 h-4" />
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
