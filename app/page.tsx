import Link from "next/link";
import Image from "next/image";
import {
  Type, Calculator, ArrowLeftRight, TrendingUp,
  Heart, Code2, Palette, Clock, ArrowRight, BookOpen,
  FileImage, ImageIcon, FileBox, Zap, Wrench,
  Shield, Sparkles, MousePointerClick,
  FilePlus2, PackageOpen, QrCode, DollarSign,
  SpellCheck, Wand2, IndianRupee, FileSearch,
  Users, GraduationCap, Briefcase, Laptop,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import RecentTools from "@/components/RecentTools";
import FavoriteTools from "@/components/FavoriteTools";
import ToolOfTheDay from "@/components/ToolOfTheDay";
import TipOfTheDay from "@/components/TipOfTheDay";
import { categories, getPopularTools } from "@/lib/tools-data";
import { getRecentPosts } from "@/lib/blog-data";

const categoryIconMap: Record<string, React.ReactNode> = {
  Type: <Type className="w-5 h-5" />,
  Calculator: <Calculator className="w-5 h-5" />,
  ArrowLeftRight: <ArrowLeftRight className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Code2: <Code2 className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  FileType: <FileImage className="w-5 h-5" />,
  ImageIcon: <ImageIcon className="w-5 h-5" />,
  FileBox: <FileBox className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Wrench: <Wrench className="w-5 h-5" />,
};

const heroTools = [
  { name: "ATS Resume Scorer", icon: FileSearch,    bg: "bg-violet-100", color: "text-violet-600", slug: "ats-score" },
  { name: "Merge PDF",          icon: FilePlus2,     bg: "bg-orange-100", color: "text-orange-600", slug: "merge-pdf" },
  { name: "Grammar Checker",    icon: SpellCheck,    bg: "bg-green-100",  color: "text-green-600",  slug: "grammar-checker" },
  { name: "AI Prompt Generator",icon: Wand2,         bg: "bg-purple-100", color: "text-purple-600", slug: "ai-prompt-generator" },
  { name: "Compress PDF",       icon: PackageOpen,   bg: "bg-red-100",    color: "text-red-600",    slug: "compress-pdf" },
  { name: "Currency Converter", icon: DollarSign,    bg: "bg-amber-100",  color: "text-amber-600",  slug: "currency-converter" },
  { name: "QR Code Generator",  icon: QrCode,        bg: "bg-emerald-100",color: "text-emerald-600",slug: "qr-code-generator" },
  { name: "Tax Calculator",     icon: IndianRupee,   bg: "bg-blue-100",   color: "text-blue-600",   slug: "tax-regime-calculator" },
];

const stats = [
  { value: "100+", label: "Free Tools" },
  { value: "13",   label: "Categories" },
  { value: "No",   label: "Sign-ups Needed" },
  { value: "100%", label: "Browser-based" },
];

const features = [
  {
    icon: <MousePointerClick className="w-6 h-6" />,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/30",
    title: "Instant Results",
    desc: "No loading screens, no queues. Every tool opens and runs immediately inside your browser.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/30",
    title: "Completely Private",
    desc: "Your files, text, and data never leave your device. Nothing is uploaded to any server.",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/30",
    title: "Always Free",
    desc: "No premium plan. No credit card. No hidden limits. Every tool is free — permanently.",
  },
];

const audiences = [
  { icon: <GraduationCap className="w-4 h-4" />, label: "Students" },
  { icon: <Laptop className="w-4 h-4" />,        label: "Developers" },
  { icon: <Briefcase className="w-4 h-4" />,     label: "Freelancers" },
  { icon: <Users className="w-4 h-4" />,         label: "Business Owners" },
  { icon: <Heart className="w-4 h-4" />,         label: "Job Seekers" },
  { icon: <Palette className="w-4 h-4" />,       label: "Designers" },
  { icon: <Type className="w-4 h-4" />,          label: "Writers" },
  { icon: <TrendingUp className="w-4 h-4" />,    label: "Finance Pros" },
];

export default async function HomePage() {
  const popularTools = getPopularTools();
  const recentPosts = await getRecentPosts(3);

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900">
        {/* Glow blobs — clipped inside their own div so they don't affect dropdown z-stacking */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-3xl" />
          {/* Dot grid overlay */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left — text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 border border-white/10 px-4 py-1.5 rounded-full text-sm font-medium mb-7 backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                100% Free · No Sign-up Required
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-white mb-6 leading-[1.12]">
                The Only Toolkit<br />
                You&apos;ll Ever{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300">
                  Need
                </span>
              </h1>

              <p className="text-blue-100/80 text-lg mb-8 max-w-lg leading-relaxed">
                100+ tools for PDF, text, math, health, finance, and code — all free, all private, all running right in your browser.
              </p>

              <div className="max-w-lg relative z-20">
                <SearchBar large />
              </div>

              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-extrabold text-white">{s.value}</p>
                    <p className="text-sm text-blue-300/80">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating tool cards */}
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {heroTools.map((tool, i) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    style={{ transform: i % 2 === 0 ? "translateY(0)" : "translateY(20px)" }}
                    className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 hover:border-white/25 rounded-2xl px-4 py-3.5 transition-all duration-200"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tool.bg}`}>
                      <Icon className={`w-4.5 h-4.5 ${tool.color}`} />
                    </div>
                    <span className="text-sm font-medium text-white/90 group-hover:text-white leading-tight">
                      {tool.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── RECENTLY USED ────────────────────────────────────────── */}
      <div className="border-b border-gray-100 dark:border-gray-700/50">
        <RecentTools />
      </div>

      {/* ── FAVORITES ────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 dark:border-gray-700/50">
        <FavoriteTools />
      </div>

      {/* ── TOOL OF THE DAY ──────────────────────────────────────── */}
      <ToolOfTheDay />

      {/* ── TIP OF THE DAY ───────────────────────────────────────── */}
      <TipOfTheDay />

      {/* ── FEATURES STRIP ───────────────────────────────────────── */}
      <section className="border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4 items-start">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${f.bg} ${f.color}`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Browse by Category</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{categories.length} categories · 100+ free tools</p>
          </div>
          <Link href="/tools" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1">
            All Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/tools?category=${cat.id}`}
              className={`group flex flex-col gap-3 p-5 rounded-2xl border ${cat.borderColor} ${cat.bgColor} dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.bgColor} dark:bg-gray-700 border ${cat.borderColor} dark:border-gray-600 ${cat.color}`}>
                {categoryIconMap[cat.icon] ?? <Calculator className="w-5 h-5" />}
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${cat.color} group-hover:underline`}>{cat.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── POPULAR TOOLS ────────────────────────────────────────── */}
      <section className="bg-gray-50 dark:bg-gray-800/50 border-y border-gray-100 dark:border-gray-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Tools</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Most used tools by our visitors</p>
            </div>
            <Link href="/tools" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1">
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

      {/* ── WHO USES IT ──────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Built for Everyone</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">From students to professionals — our tools work for every use case.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {audiences.map((a) => (
            <div
              key={a.label}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all"
            >
              <span className="text-blue-500">{a.icon}</span>
              {a.label}
            </div>
          ))}
        </div>
      </section>

      {/* ── BLOG PREVIEW ─────────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">From the Blog</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Tips, guides, and useful reads</p>
              </div>
              <Link href="/blog" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1">
                All posts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200"
                >
                  <div className="relative h-44 border-b border-gray-100 dark:border-gray-700 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                    {post.coverImageUrl ? (
                      <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-6xl group-hover:scale-110 transition-transform duration-300">{post.coverEmoji}</div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">{post.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{post.readTime} min read</span>
                      <span>·</span>
                      <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ───────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 overflow-hidden py-20">
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white/90 border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            No catch. Seriously.
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            All tools are 100% free.<br />
            <span className="text-blue-200">No account. No limits.</span>
          </h2>
          <p className="text-blue-100/80 mb-8 text-lg">
            Just pick a tool, use it, and get on with your day.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Explore All Tools <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/qa"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-xl border border-white/20 transition-colors backdrop-blur-sm"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
