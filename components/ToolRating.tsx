"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { useToolRating } from "@/hooks/useToolRating";

export default function ToolRating({ slug }: { slug: string }) {
  const { rating, rate } = useToolRating(slug);
  const [hovered, setHovered] = useState<number | null>(null);

  const display = hovered ?? rating ?? 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {rating ? "Your rating:" : "Rate this tool:"}
      </span>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => rate(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            aria-label={`Rate ${star} stars`}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-5 h-5 transition-colors ${
                star <= display
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          </button>
        ))}
      </div>
      {rating && (
        <span className="text-xs text-gray-400 dark:text-gray-500">{rating}/5</span>
      )}
    </div>
  );
}
