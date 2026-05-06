"use client";

import { useState, useEffect } from "react";
import CourseRow from "./CourseRow";

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  isFree: boolean;
  category: string;
  pages: number;
  previewImageUrl: string | null;
  avgRating?: number | null;
};

const LS_KEY = "prepptools_cl";

export default function ContinueLearning({ courses }: { courses: Course[] }) {
  const [inProgress, setInProgress] = useState<Course[]>([]);

  useEffect(() => {
    try {
      const slugs: string[] = JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
      const bySlug = Object.fromEntries(courses.map((c) => [c.slug, c]));
      const ordered = slugs.map((s) => bySlug[s]).filter(Boolean) as Course[];
      setInProgress(ordered);
    } catch { /* ignore */ }
  }, [courses]);

  if (!inProgress.length) return null;

  return <CourseRow title="Continue Learning" courses={inProgress} />;
}
