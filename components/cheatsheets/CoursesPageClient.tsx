"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Search, X, BookOpen, ChevronDown, Check, SlidersHorizontal } from "lucide-react";
import StarRating from "./StarRating";
import Link from "next/link";
import CheatsheetCard from "./CheatsheetCard";
import CourseRow from "./CourseRow";
import ContinueLearning from "./ContinueLearning";

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

type Props = {
  courses: Course[];
  categories: string[];
  grouped: Record<string, Course[]>;
};

type OpenDropdown = "category" | "price" | "sort" | null;

const PRICE_LABELS: Record<string, string> = {
  all: "All prices",
  free: "Free",
  paid: "Paid",
};

const SORT_LABELS: Record<string, string> = {
  newest: "Newest first",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

function FilterButton({
  label,
  active,
  open,
  onClick,
}: {
  label: string;
  active: boolean;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium border rounded-lg transition-colors ${
        active
          ? "bg-gray-900 text-white border-gray-900"
          : open
          ? "bg-gray-50 border-gray-400 text-gray-800"
          : "bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
      }`}
    >
      {label}
      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

export default function CoursesPageClient({ courses, categories, grouped }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
  const [sort, setSort] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [categorySearch, setCategorySearch] = useState("");

  const searchRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  const closeAll = useCallback(() => {
    setOpenDropdown(null);
    setCategorySearch("");
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
        closeAll();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closeAll]);

  const toggle = (d: OpenDropdown) => setOpenDropdown((prev) => (prev === d ? null : d));

  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    const q = categorySearch.toLowerCase();
    return categories.filter((c) => c.toLowerCase().includes(q));
  }, [categories, categorySearch]);

  const suggestions = useMemo(() => {
    if (search.trim().length < 2) return [];
    const q = search.toLowerCase();
    return courses
      .filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [search, courses]);

  const activeFilterCount =
    (selectedCategory !== "All" ? 1 : 0) + (priceFilter !== "all" ? 1 : 0);

  const isFiltered = search.trim().length > 0 || selectedCategory !== "All" || priceFilter !== "all";

  const filtered = useMemo(() => {
    let result = courses;
    if (search.trim().length > 0) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "All") result = result.filter((c) => c.category === selectedCategory);
    if (priceFilter === "free") result = result.filter((c) => c.isFree);
    if (priceFilter === "paid") result = result.filter((c) => !c.isFree);
    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [courses, search, selectedCategory, priceFilter, sort]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setPriceFilter("all");
    setSort("newest");
    setShowSuggestions(false);
    closeAll();
  };

  return (
    <div>
      {/* Search + Filters bar */}
      <div className="py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">

          {/* Search — grows to fill space */}
          <div ref={searchRef} className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
              onFocus={() => search.trim().length >= 2 && setShowSuggestions(true)}
              placeholder="Search courses by title, topic, or category…"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-9 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); setShowSuggestions(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && search.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                {suggestions.length > 0 ? (
                  <>
                    <div className="px-4 pt-3 pb-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Courses
                      </p>
                    </div>
                    {suggestions.map((c) => (
                      <Link
                        key={c.id}
                        href={`/courses/${c.slug}`}
                        onClick={() => { setShowSuggestions(false); setSearch(""); }}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-[100px] h-[62px] rounded-lg overflow-hidden bg-purple-50 flex items-center justify-center shrink-0">
                          {c.previewImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={c.previewImageUrl} alt={c.title} className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen className="w-6 h-6 text-purple-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 leading-snug mb-1">
                            {c.title}
                          </p>
                          {c.avgRating != null && (
                            <div className="mb-1">
                              <StarRating rating={c.avgRating} size="sm" />
                            </div>
                          )}
                          <p className="text-xs text-gray-400">
                            {c.category} ·{" "}
                            {c.isFree
                              ? "Free"
                              : `₹${(c.price / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </>
                ) : (
                  <div className="px-4 py-5 text-center">
                    <p className="text-sm text-gray-500">No courses found for &quot;{search}&quot;</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filter dropdowns */}
          <div ref={filtersRef} className="flex items-center gap-2 shrink-0">

            {/* Filters button (mobile-friendly label) + Category + Price grouped */}
            <div className="hidden sm:flex items-center gap-2">

              {/* Category dropdown */}
              <div className="relative">
                <FilterButton
                  label={selectedCategory === "All" ? "Category" : selectedCategory}
                  active={selectedCategory !== "All"}
                  open={openDropdown === "category"}
                  onClick={() => toggle("category")}
                />
                {openDropdown === "category" && (
                  <div className="absolute left-0 top-full mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    {/* Search within categories */}
                    {categories.length > 6 && (
                      <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input
                            type="text"
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            placeholder="Search categories…"
                            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                            autoFocus
                          />
                        </div>
                      </div>
                    )}
                    <div className="max-h-60 overflow-y-auto py-1">
                      {/* All option */}
                      <button
                        onClick={() => { setSelectedCategory("All"); closeAll(); }}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                      >
                        <span className={selectedCategory === "All" ? "font-semibold text-gray-900" : "text-gray-700"}>
                          All categories
                        </span>
                        {selectedCategory === "All" && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                      {filteredCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => { setSelectedCategory(cat); closeAll(); }}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                        >
                          <span className={selectedCategory === cat ? "font-semibold text-gray-900" : "text-gray-700"}>
                            {cat}
                          </span>
                          {selectedCategory === cat && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                      ))}
                      {filteredCategories.length === 0 && (
                        <p className="px-3.5 py-3 text-sm text-gray-400 text-center">No match</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Price dropdown */}
              <div className="relative">
                <FilterButton
                  label={PRICE_LABELS[priceFilter]}
                  active={priceFilter !== "all"}
                  open={openDropdown === "price"}
                  onClick={() => toggle("price")}
                />
                {openDropdown === "price" && (
                  <div className="absolute left-0 top-full mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                    {(["all", "free", "paid"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPriceFilter(p); closeAll(); }}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                      >
                        <span className={priceFilter === p ? "font-semibold text-gray-900" : "text-gray-700"}>
                          {PRICE_LABELS[p]}
                        </span>
                        {priceFilter === p && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <FilterButton
                label={SORT_LABELS[sort]}
                active={sort !== "newest"}
                open={openDropdown === "sort"}
                onClick={() => toggle("sort")}
              />
              {openDropdown === "sort" && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                  {(["newest", "price-asc", "price-desc"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSort(s); closeAll(); }}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <span className={sort === s ? "font-semibold text-gray-900" : "text-gray-700"}>
                        {SORT_LABELS[s]}
                      </span>
                      {sort === s && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Active filter count + clear */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear{activeFilterCount > 1 ? ` (${activeFilterCount})` : ""}
              </button>
            )}

            {/* Mobile: compact filters button */}
            <div className="sm:hidden relative">
              <button
                onClick={() => toggle("category")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium border rounded-lg transition-colors ${
                  activeFilterCount > 0
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-0.5 w-4 h-4 flex items-center justify-center bg-white text-gray-900 text-[10px] font-bold rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Content area */}
      {isFiltered ? (
        <div>
          <p className="text-sm text-gray-500 py-4">
            {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
            {search && ` for "${search}"`}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search className="w-12 h-12 text-gray-200 mb-4" />
              <p className="text-base font-semibold text-gray-500">No courses match your filters</p>
              <button onClick={clearFilters} className="mt-3 text-sm text-blue-600 hover:underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-6 pb-12">
              {filtered.map((c) => (
                <CheatsheetCard key={c.id} {...c} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <ContinueLearning courses={courses} />
          <div className="pt-8 pb-1">
            <h2 className="text-2xl font-bold text-gray-900">What to learn next</h2>
          </div>
          <CourseRow
            title="Recommended for you"
            courses={courses}
          />
          {categories.map((cat) =>
            grouped[cat].length >= 2 ? (
              <CourseRow key={cat} title={cat} courses={grouped[cat]} />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
