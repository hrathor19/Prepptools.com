import Link from "next/link";
import Image from "next/image";
import {
  Type, Calculator, ArrowLeftRight, TrendingUp,
  Heart, Code2, Palette, Clock, ArrowRight, BookOpen,
  FileImage, ImageIcon, FileBox, Zap, Wrench,
  Shield, Sparkles, MousePointerClick,
  FilePlus2, PackageOpen, QrCode, DollarSign,
  SpellCheck, Wand2, IndianRupee, FileSearch,
  Users, GraduationCap, Briefcase, Laptop, FileText,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import RecentTools from "@/components/RecentTools";
import FavoriteTools from "@/components/FavoriteTools";
import ToolOfTheDay from "@/components/ToolOfTheDay";
import TipOfTheDay from "@/components/TipOfTheDay";
import { categories, getPopularTools } from "@/lib/tools-data";
import { getRecentPosts } from "@/lib/blog-data";
import { getAdminClient } from "@/lib/supabase";

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

  let featuredCourses: {
    id: string; slug: string; title: string; description: string;
    price: number; originalPrice: number | null; isFree: boolean;
    category: string; pages: number; previewImageUrl: string | null;
  }[] = [];
  try {
    const admin = getAdminClient();
    const { data } = await admin
      .from("cheatsheets")
      .select("id, slug, title, description, price, original_price, is_free, category, pages, preview_image_url")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(6);
    featuredCourses = (data ?? []).map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description ?? "",
      price: c.price ?? 0,
      originalPrice: c.original_price ?? null,
      isFree: c.is_free ?? true,
      category: c.category ?? "General",
      pages: c.pages ?? 0,
      previewImageUrl: c.preview_image_url ?? null,
    }));
  } catch {
    // Supabase unavailable — skip courses section
  }

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

      {/* ── PDF COURSES ──────────────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">PDF Courses</span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Learn Something New Today</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Instant PDF download · Lifetime access · Starts from free
              </p>
            </div>
            <Link href="/courses" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center gap-1 shrink-0">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-lg transition-all duration-200"
                >
                  <div className="relative h-40 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                    {course.previewImageUrl ? (
                      <Image
                        src={course.previewImageUrl}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FileText className="w-12 h-12 text-purple-300 dark:text-purple-500" />
                      </div>
                    )}
                    {course.isFree ? (
                      <span className="absolute top-3 left-3 text-xs font-bold bg-emerald-500 text-white px-2 py-0.5 rounded">
                        Free
                      </span>
                    ) : (
                      <span className="absolute top-3 left-3 text-xs font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: "#03adc5" }}>
                        Premium
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">{course.category}</span>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">{course.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-gray-900 dark:text-white">
                          {course.isFree
                            ? "Free"
                            : `₹${(course.price / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
                        </span>
                        {!course.isFree && course.originalPrice && course.originalPrice > course.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{(course.originalPrice / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </span>
                        )}
                      </div>
                      {course.pages > 0 && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">{course.pages} pages</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">Courses coming soon!</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">New PDF guides and cheatsheets on the way.</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <BookOpen className="w-4 h-4" /> Browse All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* ── INTERVIEW PREP + RESUME BUILDER SPOTLIGHT ───────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 py-20 px-4">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          {/* Section label */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-400 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Featured
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
              Land Your Dream Job,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-300">Faster</span>
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              Two powerful tools built for job seekers — completely free, no account needed.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Interview Prep */}
            <Link href="/interview-prep"
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-teal-950/60 to-slate-900/80 p-8 hover:border-teal-500/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(20,184,166,0.12)]">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-teal-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-teal-500/20 transition-all duration-500" />

              <div className="relative">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/20 flex items-center justify-center mb-6 group-hover:bg-teal-500/25 transition-colors">
                  <GraduationCap className="w-7 h-7 text-teal-400" />
                </div>

                <div className="inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" /> Free to use
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-3 leading-snug group-hover:text-teal-100 transition-colors">
                  Interview Prep
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Practice real interview questions, get instant AI feedback, and walk into every interview with confidence.
                </p>

                <ul className="space-y-2.5 mb-8">
                  {[
                    "Curated questions by role & domain",
                    "Behavioral + technical prep",
                    "Tips from industry professionals",
                    "Track your readiness score",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0">
                        <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <span className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors group-hover:gap-3 duration-200">
                  Start Preparing <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Resume Builder */}
            <Link href="/resume-builder"
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/60 to-slate-900/80 p-8 hover:border-blue-500/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.12)]">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500" />

              <div className="relative">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500/25 transition-colors">
                  <Briefcase className="w-7 h-7 text-blue-400" />
                </div>

                <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" /> Free to use
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-3 leading-snug group-hover:text-blue-100 transition-colors">
                  Resume Builder
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Build a job-winning resume in minutes with clean, ATS-friendly templates that recruiters love.
                </p>

                <ul className="space-y-2.5 mb-8">
                  {[
                    "Professional ATS-optimised templates",
                    "Easy drag-and-drop sections",
                    "Export as PDF instantly",
                    "Tailored for Indian & global markets",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <span className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors group-hover:gap-3 duration-200">
                  Build My Resume <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

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

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">What people say</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">Loved by students & professionals</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: "Priya S.", role: "Engineering Student", text: "The CGPA to Percentage calculator saved me so much time. Anna University formula was right there!", stars: 5 },
              { name: "Rahul M.", role: "HR Professional", text: "Notice Period Calculator is brilliant. Instant last working day with buyout cost — exactly what I needed.", stars: 5 },
              { name: "Ananya K.", role: "Content Writer", text: "Word Counter, Grammar Checker, Reading Time — I use PreppTools every single day. No sign-up = love it.", stars: 5 },
              { name: "Vikram D.", role: "Finance Analyst", text: "The Tax Regime Calculator saved me ₹18,000 last year. Compared old vs new in 2 minutes flat.", stars: 5 },
              { name: "Sneha R.", role: "Job Seeker", text: "ATS Score Checker helped me optimise my resume. Got 3 interview calls the next week!", stars: 5 },
              { name: "Dev P.", role: "Developer", text: "JSON Formatter, Base64, UUID — all in one place. Beats bookmarking 10 different sites.", stars: 5 },
            ].map((t) => (
              <div key={t.name} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{t.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
