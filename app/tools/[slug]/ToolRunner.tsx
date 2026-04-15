"use client";

import { useEffect } from "react";
import { toolComponents } from "@/components/tools";
import { addRecentTool } from "@/hooks/useRecentTools";

export default function ToolRunner({ slug }: { slug: string }) {
  useEffect(() => {
    addRecentTool(slug);
  }, [slug]);

  const ToolComponent = toolComponents[slug];

  if (!ToolComponent) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        <p className="text-4xl mb-3">🚧</p>
        <p className="font-medium text-gray-600 dark:text-gray-300">This tool is coming soon!</p>
        <p className="text-sm mt-1">We&apos;re working on it.</p>
      </div>
    );
  }

  return <ToolComponent />;
}
