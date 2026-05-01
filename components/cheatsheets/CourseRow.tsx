"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import CheatsheetCard from "./CheatsheetCard";

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
};

type Props = {
  title: string;
  subtitle?: string;
  courses: Course[];
};

export default function CourseRow({ title, subtitle, courses }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(false);

  const check = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    check();
    const el = scrollRef.current;
    el?.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el?.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [courses]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 700 : -700, behavior: "smooth" });
  };

  if (!courses.length) return null;

  return (
    <section className="py-7 border-b border-gray-100 last:border-0">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="relative group/row">
        {/* Left arrow */}
        {canLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-300 shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {courses.map((c) => (
            <CheatsheetCard
              key={c.id}
              id={c.id}
              title={c.title}
              description={c.description}
              slug={c.slug}
              price={c.price}
              originalPrice={c.originalPrice}
              isFree={c.isFree}
              category={c.category}
              pages={c.pages}
              previewImageUrl={c.previewImageUrl}
            />
          ))}
          {/* Trailing spacer so last card isn't clipped */}
          <div className="shrink-0 w-1" />
        </div>

        {/* Right arrow */}
        {canRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-300 shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>
    </section>
  );
}
