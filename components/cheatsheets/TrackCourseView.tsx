"use client";

import { useEffect } from "react";

const LS_KEY = "prepptools_cl";
const MAX    = 10;

export default function TrackCourseView({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const stored: string[] = JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
      const updated = [slug, ...stored.filter((s) => s !== slug)].slice(0, MAX);
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
    } catch { /* ignore */ }
  }, [slug]);

  return null;
}
