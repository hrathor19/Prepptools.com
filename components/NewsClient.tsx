"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ExternalLink, RefreshCw, Clock, Globe } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
type Article = {
  article_id: string;
  title: string;
  description: string | null;
  link: string;
  image_url: string | null;
  source_name: string;
  source_icon: string | null;
  pubDate: string;
  category: string[];
  country: string[];
};

type ApiResponse = {
  status: string;
  totalResults?: number;
  results: Article[];
  nextPage?: string;
  message?: string;
};

// ── Constants ──────────────────────────────────────────────────────────────────
const COUNTRIES = [
  { code: "",   name: "🌍 Worldwide" },
  { code: "in", name: "🇮🇳 India" },
  { code: "us", name: "🇺🇸 United States" },
  { code: "gb", name: "🇬🇧 United Kingdom" },
  { code: "au", name: "🇦🇺 Australia" },
  { code: "ca", name: "🇨🇦 Canada" },
  { code: "ae", name: "🇦🇪 UAE" },
  { code: "sg", name: "🇸🇬 Singapore" },
  { code: "de", name: "🇩🇪 Germany" },
  { code: "fr", name: "🇫🇷 France" },
  { code: "jp", name: "🇯🇵 Japan" },
  { code: "cn", name: "🇨🇳 China" },
  { code: "br", name: "🇧🇷 Brazil" },
  { code: "za", name: "🇿🇦 South Africa" },
  { code: "pk", name: "🇵🇰 Pakistan" },
  { code: "bd", name: "🇧🇩 Bangladesh" },
  { code: "np", name: "🇳🇵 Nepal" },
  { code: "lk", name: "🇱🇰 Sri Lanka" },
  { code: "my", name: "🇲🇾 Malaysia" },
  { code: "ng", name: "🇳🇬 Nigeria" },
];

const CATEGORIES = [
  { id: "top",           label: "Top Stories" },
  { id: "world",         label: "World" },
  { id: "business",      label: "Business" },
  { id: "technology",    label: "Technology" },
  { id: "sports",        label: "Sports" },
  { id: "entertainment", label: "Entertainment" },
  { id: "health",        label: "Health" },
  { id: "science",       label: "Science" },
  { id: "politics",      label: "Politics" },
  { id: "environment",   label: "Environment" },
];

const CAT_COLORS: Record<string, string> = {
  top:           "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  world:         "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300",
  business:      "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
  technology:    "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300",
  sports:        "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300",
  entertainment: "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300",
  health:        "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  science:       "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300",
  politics:      "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
  environment:   "bg-lime-100 dark:bg-lime-900/40 text-lime-700 dark:text-lime-300",
};

const CAT_GRADIENTS: Record<string, string> = {
  top:           "from-blue-500 to-indigo-600",
  world:         "from-sky-500 to-blue-600",
  business:      "from-emerald-500 to-teal-600",
  technology:    "from-violet-500 to-purple-600",
  sports:        "from-orange-500 to-red-500",
  entertainment: "from-pink-500 to-rose-600",
  health:        "from-green-500 to-emerald-600",
  science:       "from-cyan-500 to-blue-600",
  politics:      "from-red-500 to-rose-700",
  environment:   "from-lime-500 to-green-600",
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const date = new Date(dateStr.replace(" ", "T") + "Z");
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)     return "just now";
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function firstCat(cats: string[]): string {
  return cats?.[0] ?? "top";
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function CategoryBadge({ cat }: { cat: string }) {
  const cls = CAT_COLORS[cat] ?? CAT_COLORS.top;
  return (
    <span className={`inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${cls}`}>
      {cat}
    </span>
  );
}

function ImageBox({ url, alt, cat, className }: { url: string | null; alt: string; cat: string; className?: string }) {
  const gradient = CAT_GRADIENTS[cat] ?? CAT_GRADIENTS.top;
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt={alt} className={`object-cover ${className}`} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
    );
  }
  return (
    <div className={`bg-gradient-to-br ${gradient} flex items-center justify-center ${className}`}>
      <Globe className="w-10 h-10 text-white/40" />
    </div>
  );
}

function FeaturedCard({ article }: { article: Article }) {
  const cat = firstCat(article.category);
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 mb-6"
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-[55%] h-56 md:h-auto overflow-hidden flex-shrink-0 min-h-[240px]">
          <ImageBox url={article.image_url} alt={article.title} cat={cat} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-3 left-3">
            <CategoryBadge cat={cat} />
          </div>
        </div>
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              {article.source_icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={article.source_icon} alt={article.source_name} className="w-4 h-4 rounded-sm object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{article.source_name}</span>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />{timeAgo(article.pubDate)}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-3 line-clamp-3">
              {article.title}
            </h2>
            {article.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                {article.description}
              </p>
            )}
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2.5 transition-all">
            Read Full Story <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </a>
  );
}

function NewsCard({ article }: { article: Article }) {
  const cat = firstCat(article.category);
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-200"
    >
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <ImageBox url={article.image_url} alt={article.title} cat={cat} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2.5 left-2.5">
          <CategoryBadge cat={cat} />
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-2 mb-2">
          {article.source_icon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.source_icon} alt={article.source_name} className="w-3.5 h-3.5 rounded-sm object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          )}
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">{article.source_name}</span>
          <span className="ml-auto text-[11px] text-gray-400 dark:text-gray-500 shrink-0 flex items-center gap-1">
            <Clock className="w-3 h-3" />{timeAgo(article.pubDate)}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-3 text-sm flex-1">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 mt-2 leading-relaxed">
            {article.description}
          </p>
        )}
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="h-44 bg-gray-100 dark:bg-gray-700" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded" />
        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-2/3 mt-2" />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function NewsClient() {
  const [articles,    setArticles]    = useState<Article[]>([]);
  const [nextPage,    setNextPage]    = useState<string | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error,       setError]       = useState("");
  const [country,     setCountry]     = useState("");
  const [category,    setCategory]    = useState("top");
  const [query,       setQuery]       = useState("");
  const [inputVal,    setInputVal]    = useState("");

  const fetchNews = useCallback(async (reset: boolean, cursor?: string) => {
    reset ? setLoading(true) : setLoadingMore(true);
    if (reset) { setArticles([]); setNextPage(null); }
    setError("");

    try {
      const p = new URLSearchParams({ category });
      if (country) p.set("country", country);
      if (query)   p.set("q", query);
      if (cursor)  p.set("page", cursor);

      const res  = await fetch(`/api/news?${p}`);
      const data: ApiResponse = await res.json();

      if (data.status === "success") {
        setArticles(prev => reset ? (data.results ?? []) : [...prev, ...(data.results ?? [])]);
        setNextPage(data.nextPage ?? null);
      } else {
        setError(data.message ?? "Failed to load news. You may have hit the daily limit (200 requests/day).");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [country, category, query]);

  useEffect(() => { fetchNews(true); }, [fetchNews]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(inputVal.trim());
  }

  function clearSearch() {
    setInputVal("");
    setQuery("");
  }

  const featured  = articles[0] ?? null;
  const rest      = articles.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── Hero header ── */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-2">Live Feed</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">World News</h1>
          <p className="text-gray-400 text-sm">Latest stories from 80,000+ sources worldwide · updates every few minutes</p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="sticky top-16 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 space-y-3">

          {/* Row 1: Country + Search */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={country}
              onChange={e => { setCountry(e.target.value); }}
              className="sm:w-52 shrink-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>

            <form onSubmit={handleSearch} className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  placeholder="Search city, topic, keyword… (e.g. Mumbai, AI, Elections)"
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                />
              </div>
              <button type="submit" className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
                Search
              </button>
              {query && (
                <button type="button" onClick={clearSearch} className="shrink-0 px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm rounded-xl hover:border-red-400 hover:text-red-500 transition-colors">
                  Clear
                </button>
              )}
            </form>
          </div>

          {/* Row 2: Category tabs */}
          <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  category === cat.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Active filter indicator */}
        {(query || country) && (
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
            <span>Showing results for</span>
            {country && <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-medium">{COUNTRIES.find(c => c.code === country)?.name}</span>}
            {query && <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-full text-xs font-medium">&ldquo;{query}&rdquo;</span>}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-pulse mb-6 h-64" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📡</p>
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Couldn&apos;t load news</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">{error}</p>
            <button
              onClick={() => fetchNews(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">No articles found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Try a different country, category, or search term.</p>
          </div>
        )}

        {/* Articles */}
        {!loading && !error && articles.length > 0 && (
          <>
            {featured && <FeaturedCard article={featured} />}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map(article => (
                  <NewsCard key={article.article_id} article={article} />
                ))}
              </div>
            )}

            {/* Load More */}
            {nextPage && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => fetchNews(false, nextPage)}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-7 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold text-sm rounded-xl hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 transition-all"
                >
                  {loadingMore
                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> Loading…</>
                    : "Load More Stories"
                  }
                </button>
              </div>
            )}

            {!nextPage && articles.length > 0 && (
              <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-10">
                You&apos;ve reached the end · {articles.length} stories loaded
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
