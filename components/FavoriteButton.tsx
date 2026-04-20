"use client";

import { Heart } from "lucide-react";
import { useFavoriteTools } from "@/hooks/useFavoriteTools";

export default function FavoriteButton({ slug }: { slug: string }) {
  const { isFavorite, toggle } = useFavoriteTools();
  const active = isFavorite(slug);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className={`w-7 h-7 flex items-center justify-center rounded-full transition-all duration-150 ${
        active
          ? "bg-red-50 dark:bg-red-900/30 text-red-500"
          : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
      }`}
    >
      <Heart className={`w-3.5 h-3.5 ${active ? "fill-current" : ""}`} />
    </button>
  );
}
