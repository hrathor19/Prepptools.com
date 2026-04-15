import Link from "next/link";
import {
  Type, Calculator, ArrowLeftRight, TrendingUp,
  Heart, Code2, Palette, Clock, ArrowRight, BookOpen,
  FileImage, ImageIcon, FileBox, Zap, Wrench,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import RecentTools from "@/components/RecentTools";
import { categories, getPopularTools } from "@/lib/tools-data";
import { getRecentPosts } from "@/lib/blog-data";

const categoryIconMap: Record<string, React.ReactNode> = {
  Type: <Type className="w-6 h-6" />,
  Calculator: <Calculator className="w-6 h-6" />,
  ArrowLeftRight: <ArrowLeftRight className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  Code2: <Code2 className="w-6 h-6" />,
  Palette: <Palette className="w-6 h-6" />,
  Clock: <Clock className="w-6 h-6" />,
  FileType: <FileImage className="w-6 h-6" />,
  ImageIcon: <ImageIcon className="w-6 h-6" />,
  FileBox: <FileBox className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
};

export default async function HomePage() {
  const popularTools = getPopularTools();
  const recentPosts = await getRecentPosts(3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            100% Free · No Sign-up Required
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-5 leading-tight">
            Free Tools for{" "}
            <span className="text-blue-600">Everyday Life</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto">
            Text, math, health, finance, and developer tools — all in one place.
            Fast, private, and completely free.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar large />
          </div>
        </div>
      </section>

      {/* Recently Used Tools — client component, renders only if localStorage has entries */}
      <div className="border-b border-gray-100 dark:border-gray-700/50">
        <RecentTools />
      </div>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Browse by Category</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {categories.length} categories · 100+ free tools
            </p>
          </div>
          <Link
            href="/tools"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
          >
            All Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/tools?category=${cat.id}`}
              className={`group flex flex-col items-start gap-3 p-5 rounded-xl border ${cat.borderColor} ${cat.bgColor} hover:shadow-md transition-all duration-200`}
            >
              <div className={`${cat.color}`}>
                {categoryIconMap[cat.icon] ?? <Calculator className="w-6 h-6" />}
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${cat.color} group-hover:underline`}>
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Tools */}
      <section className="bg-gray-50 dark:bg-gray-800/50 border-y border-gray-100 dark:border-gray-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Tools</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Most searched tools by our visitors</p>
            </div>
            <Link
              href="/tools"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">From the Blog</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Tips, guides, and useful reads</p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
          >
            All posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
            >
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center h-32 text-5xl border-b border-gray-100 dark:border-gray-700">
                {post.coverEmoji}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{post.readTime} min read</span>
                  <span>·</span>
                  <span>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-600 dark:bg-blue-700 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            All tools are 100% free, forever.
          </h2>
          <p className="text-blue-100 mb-8">
            No sign-up. No credit card. No limits. Just open and use.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Explore All Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
