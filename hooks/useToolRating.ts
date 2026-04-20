"use client";

import { useEffect, useState, useCallback } from "react";

export function useToolRating(slug: string) {
  const key = `rating_${slug}`;
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setRating(Number(stored));
    } catch {}
  }, [key]);

  const rate = useCallback(
    (stars: number) => {
      setRating(stars);
      try {
        localStorage.setItem(key, String(stars));
      } catch {}
    },
    [key]
  );

  return { rating, rate };
}
