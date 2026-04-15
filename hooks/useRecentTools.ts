"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "recentTools";
const MAX_RECENT = 6;

export function addRecentTool(slug: string) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const existing: string[] = stored ? JSON.parse(stored) : [];
    const updated = [slug, ...existing.filter((s) => s !== slug)].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage may be unavailable (SSR, private browsing)
  }
}

export function useRecentTools() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSlugs(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  return slugs;
}
