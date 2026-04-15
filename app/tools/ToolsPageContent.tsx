"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Type, Calculator, ArrowLeftRight, TrendingUp,
  Heart, Code2, Palette, Clock, FileImage, ImageIcon,
  FileBox, FileType, Zap, Wrench,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import { categories, getToolsByCategory, searchTools, tools } from "@/lib/tools-data";

const categoryIconMap: Record<string, React.ReactNode> = {
  Type: <Type className="w-4 h-4" />,
  Calculator: <Calculator className="w-4 h-4" />,
  ArrowLeftRight: <ArrowLeftRight className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Code2: <Code2 className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  FileType: <FileImage className="w-4 h-4" />,
  ImageIcon: <ImageIcon className="w-4 h-4" />,
  FileBox: <FileBox className="w-4 h-4" />,
  FileType2: <FileType className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Wrench: <Wrench className="w-4 h-4" />,
};

export default function ToolsPageContent() {
  const params = useSearchParams();
  const categoryFilter = params.get("category") ?? "";
  const searchQuery = params.get("q") ?? "";

  const isFiltered = !!(searchQuery || categoryFilter);

  // Filtered / search view — flat list
  let filteredTools = tools;
  let pageTitle = "";
  if (searchQuery) {
    filteredTools = searchTools(searchQuery);
    pageTitle = `Results for "${searchQuery}"`;
  } else if (categoryFilter) {
    filteredTools = getToolsByCategory(categoryFilter);
    const cat = categories.find((c) => c.id === categoryFilter);
    pageTitle = cat?.name ?? "All Tools";
  }

  // Categories that actually have tools
  const populatedCategories = categories.filter(
    (cat) => getToolsByCategory(cat.id).length > 0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search */}
      <div className="mb-8">
        <SearchBar />
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        <Link
          href="/tools"
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            !categoryFilter && !searchQuery
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/tools?category=${cat.id}`}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              categoryFilter === cat.id
                ? `${cat.bgColor} ${cat.color} ${cat.borderColor}`
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {categoryIconMap[cat.icon]}
            {cat.name}
          </Link>
        ))}
      </div>

      {/* ── FILTERED / SEARCH VIEW ── flat list */}
      {isFiltered ? (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{pageTitle}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""}
            </p>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No tools found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Try a different search term or browse by category.</p>
              <Link
                href="/tools"
                className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Browse all tools
              </Link>
            </div>
          )}
        </>
      ) : (
        /* ── DEFAULT VIEW ── grouped by category */
        <div className="space-y-12">
          {populatedCategories.map((cat) => {
            const catTools = getToolsByCategory(cat.id);
            return (
              <section key={cat.id}>
                {/* Category heading */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg ${cat.bgColor} ${cat.color}`}>
                      {categoryIconMap[cat.icon]}
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{cat.name}</h2>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{catTools.length} tool{catTools.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <Link
                    href={`/tools?category=${cat.id}`}
                    className={`text-xs font-medium ${cat.color} hover:underline`}
                  >
                    View all →
                  </Link>
                </div>

                {/* Tools grid for this category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>

                {/* Divider */}
                <div className="border-b border-gray-100 dark:border-gray-700/50 mt-10" />
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
