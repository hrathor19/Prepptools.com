import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, BookOpen, Clock, User, ArrowLeft } from "lucide-react";
import { getBlogPostBySlug, getRecentPosts, getAllSlugs } from "@/lib/blog-data";
import LikeButton from "@/components/blog/LikeButton";
import ShareButton from "@/components/blog/ShareButton";
import BlogContent from "@/components/blog/BlogContent";

// Pre-build all known slugs at deploy time; new slugs are rendered on-demand
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Allow slugs not in generateStaticParams (new posts added after deploy)
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = (await getRecentPosts(4)).filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/blog" className="hover:text-gray-600 transition-colors">Blog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600 font-medium truncate">{post.title}</span>
      </nav>

      {/* Cover */}
      {post.coverImageUrl ? (
        <div className="mb-8 rounded-2xl border border-gray-100 overflow-hidden aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="text-center text-7xl mb-8 py-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-100">
          {post.coverEmoji}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span key={tag} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full font-medium">
            #{tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
        <span className="flex items-center gap-1.5">
          <User className="w-4 h-4" />
          {post.author}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {new Date(post.date).toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric",
          })}
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          {post.readTime} min read
        </span>
      </div>

      {/* Excerpt */}
      <p className="text-lg text-gray-600 leading-relaxed mb-8 italic border-l-4 border-blue-400 pl-4">
        {post.excerpt}
      </p>

      {/* Content */}
      <article className="prose">
        <BlogContent content={post.content} />
      </article>

      {/* Like / Share */}
      <div className="flex items-center gap-3 mt-10 pt-8 border-t border-gray-100">
        <span className="text-sm text-gray-500 mr-1">Found this helpful?</span>
        <LikeButton slug={post.slug} initialLikes={post.likes} />
        <ShareButton title={post.title} slug={post.slug} />
      </div>

      {/* Back */}
      <Link href="/blog"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition-colors mt-8 mb-10">
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      {/* Related Posts */}
      {related.length > 0 && (
        <div className="border-t border-gray-100 pt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">More Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`}
                className="group block bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="text-3xl mb-2">{p.coverEmoji}</div>
                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {p.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{p.readTime} min read</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
