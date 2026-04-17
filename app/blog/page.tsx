import Link from "next/link";
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllBlogPosts } from "@/lib/blog-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog — Tips, Guides & How-Tos",
  description: "Tips, guides, and how-tos on productivity, health, finance, PDF tools, and everyday tools from PreppTools.",
  alternates: { canonical: "https://www.prepptools.com/blog" },
  openGraph: {
    title: "Blog — PreppTools",
    description: "Tips, guides, and how-tos on productivity, health, finance, and everyday tools.",
    url: "https://www.prepptools.com/blog",
  },
};

const POSTS_PER_PAGE = 4;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt((pageParam as string) || "1", 10));

  const allPosts = await getAllBlogPosts();

  if (allPosts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Articles</h1>
        <p className="text-gray-500">No articles yet. Add your first article in Supabase!</p>
      </div>
    );
  }

  const featuredPost = allPosts.find((p) => p.featured) ?? null;
  const regularPosts = allPosts.filter((p) => !p.featured);

  const totalPages = Math.max(1, Math.ceil(regularPosts.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pagePosts = regularPosts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* ── Featured Article ─────────────────────────────────── */}
      {featuredPost && (
        <section className="mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Featured Article</h2>

          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative md:w-[55%] flex-shrink-0 h-64 md:h-auto overflow-hidden">
                {featuredPost.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featuredPost.coverImageUrl}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-8xl h-full min-h-[260px]">
                    {featuredPost.coverEmoji}
                  </div>
                )}
                {/* Featured badge overlaid on image */}
                <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Featured
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center p-8 md:p-10 flex-1">
                {/* Category tag */}
                {featuredPost.tags[0] && (
                  <span className="inline-block self-start text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-4">
                    {featuredPost.tags[0]}
                  </span>
                )}

                <h3 className="text-2xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-3">
                  {featuredPost.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(featuredPost.date).toLocaleDateString("en-US", {
                      month: "long", day: "numeric", year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readTime} min read
                  </span>
                </div>

                <span className="inline-flex items-center gap-2 self-start bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── Latest Articles ──────────────────────────────────── */}
      {pagePosts.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-6">Latest Articles</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pagePosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  {post.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 h-full text-6xl">
                      {post.coverEmoji}
                    </div>
                  )}
                  {/* Category badge on image */}
                  {post.tags[0] && (
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {post.tags[0]}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime} min
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {regularPosts.length === 0 && !featuredPost && (
        <p className="text-gray-400 text-sm">No articles available.</p>
      )}

      {/* ── Pagination ───────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            {safePage > 1 ? (
              <Link
                href={`/blog?page=${safePage - 1}`}
                className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </Link>
            ) : (
              <span className="flex items-center gap-1 px-4 py-2 text-sm text-gray-300 bg-white border border-gray-100 rounded-lg cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
                Prev
              </span>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/blog?page=${p}`}
                className={`w-9 h-9 flex items-center justify-center text-sm rounded-lg border font-medium transition-all ${
                  p === safePage
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                {p}
              </Link>
            ))}

            {safePage < totalPages ? (
              <Link
                href={`/blog?page=${safePage + 1}`}
                className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="flex items-center gap-1 px-4 py-2 text-sm text-gray-300 bg-white border border-gray-100 rounded-lg cursor-not-allowed">
                Next
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400">
            Page {safePage} of {totalPages}
          </p>
        </div>
      )}
    </div>
  );
}
