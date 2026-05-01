import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight, ArrowLeft, ChevronDown,
  AlignLeft, CaseSensitive, FileText, Repeat,
  Percent, Receipt, Calculator, Ruler, Thermometer, Scale,
  Landmark, TrendingUp, Activity, Cake, Flame,
  Braces, Binary, ShieldCheck, Pipette, CalendarDays,
  Type, ArrowLeftRight, Heart, Code2, Palette, Clock,
  ImageDown, FilePlus2, Scissors, PackageOpen, RotateCw,
  FileX, Stamp, FileImage, Minimize2, Maximize2, RefreshCw,
  FlipHorizontal, Keyboard, Wand2, SpellCheck, ScanText, IndianRupee,
  GraduationCap, Banknote, CalendarClock, Users, Briefcase,
  Sparkles, Megaphone, Hash, UserCircle2, Mail,
} from "lucide-react";
import { getToolBySlug, getCategoryById, getToolsByCategory, tools } from "@/lib/tools-data";
import { toolDescriptions } from "@/lib/tool-descriptions";
import { faqData } from "@/lib/faq-data";
import { alsoUsed } from "@/lib/also-used-data";
import ToolCard from "@/components/ToolCard";
import FeedbackWidget from "@/components/FeedbackWidget";
import ToolRating from "@/components/ToolRating";
import FavouriteToolButton from "@/components/tools/FavouriteToolButton";
import ToolRunner from "./ToolRunner";

const iconMap: Record<string, React.ReactNode> = {
  AlignLeft: <AlignLeft className="w-7 h-7" />,
  CaseSensitive: <CaseSensitive className="w-7 h-7" />,
  FileText: <FileText className="w-7 h-7" />,
  Repeat: <Repeat className="w-7 h-7" />,
  Percent: <Percent className="w-7 h-7" />,
  Receipt: <Receipt className="w-7 h-7" />,
  Calculator: <Calculator className="w-7 h-7" />,
  Ruler: <Ruler className="w-7 h-7" />,
  Thermometer: <Thermometer className="w-7 h-7" />,
  Scale: <Scale className="w-7 h-7" />,
  Landmark: <Landmark className="w-7 h-7" />,
  TrendingUp: <TrendingUp className="w-7 h-7" />,
  Activity: <Activity className="w-7 h-7" />,
  Cake: <Cake className="w-7 h-7" />,
  Flame: <Flame className="w-7 h-7" />,
  Braces: <Braces className="w-7 h-7" />,
  Binary: <Binary className="w-7 h-7" />,
  ShieldCheck: <ShieldCheck className="w-7 h-7" />,
  Pipette: <Pipette className="w-7 h-7" />,
  CalendarDays: <CalendarDays className="w-7 h-7" />,
  ImageDown: <ImageDown className="w-7 h-7" />,
  FilePlus2: <FilePlus2 className="w-7 h-7" />,
  Scissors: <Scissors className="w-7 h-7" />,
  PackageOpen: <PackageOpen className="w-7 h-7" />,
  RotateCw: <RotateCw className="w-7 h-7" />,
  FileX: <FileX className="w-7 h-7" />,
  Stamp: <Stamp className="w-7 h-7" />,
  FileImage: <FileImage className="w-7 h-7" />,
  Minimize2: <Minimize2 className="w-7 h-7" />,
  Maximize2: <Maximize2 className="w-7 h-7" />,
  RefreshCw: <RefreshCw className="w-7 h-7" />,
  FlipHorizontal: <FlipHorizontal className="w-7 h-7" />,
  Keyboard: <Keyboard className="w-7 h-7" />,
  Wand2: <Wand2 className="w-7 h-7" />,
  SpellCheck: <SpellCheck className="w-7 h-7" />,
  ScanText: <ScanText className="w-7 h-7" />,
  IndianRupee: <IndianRupee className="w-7 h-7" />,
  GraduationCap: <GraduationCap className="w-7 h-7" />,
  Banknote: <Banknote className="w-7 h-7" />,
  CalendarClock: <CalendarClock className="w-7 h-7" />,
  Briefcase: <Briefcase className="w-7 h-7" />,
  Sparkles: <Sparkles className="w-7 h-7" />,
  Megaphone: <Megaphone className="w-7 h-7" />,
  Hash: <Hash className="w-7 h-7" />,
  UserCircle2: <UserCircle2 className="w-7 h-7" />,
  Mail: <Mail className="w-7 h-7" />,
};

const categoryIconMap: Record<string, React.ReactNode> = {
  text: <Type className="w-4 h-4" />,
  math: <Calculator className="w-4 h-4" />,
  converters: <ArrowLeftRight className="w-4 h-4" />,
  finance: <TrendingUp className="w-4 h-4" />,
  health: <Heart className="w-4 h-4" />,
  developer: <Code2 className="w-4 h-4" />,
  color: <Palette className="w-4 h-4" />,
  datetime: <Clock className="w-4 h-4" />,
  pdf: <FileImage className="w-4 h-4" />,
  image: <Palette className="w-4 h-4" />,
  "ai-tools": <Sparkles className="w-4 h-4" />,
};

function getUsageCount(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  const base = 4200 + (hash % 91800);
  const daysSeed = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
  const count = base + (daysSeed % 300);
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

export async function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Tool Not Found" };
  const url = `https://www.prepptools.com/tools/${slug}`;
  return {
    title: `${tool.name} — Free Online Tool`,
    description: tool.description,
    keywords: [...tool.tags, tool.name, "free online", "PreppTools"],
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.name} — Free Online Tool`,
      description: tool.description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${tool.name} — Free Online Tool`,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();
  const usageCount = getUsageCount(slug);

  const category = getCategoryById(tool.category);
  const related = getToolsByCategory(tool.category)
    .filter((t) => t.slug !== tool.slug)
    .slice(0, 3);

  const faqs = faqData[slug] ?? [];

  const alsoUsedSlugs = alsoUsed[slug] ?? [];
  const alsoUsedTools = alsoUsedSlugs
    .map((s) => getToolBySlug(s))
    .filter((t) => t !== undefined)
    .slice(0, 3);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `https://www.prepptools.com/tools/${slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    provider: { "@type": "Organization", name: "PreppTools", url: "https://www.prepptools.com" },
  };

  if (faqs.length > 0) {
    jsonLd["mainEntity"] = {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    };
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/tools" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Tools</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/tools?category=${tool.category}`} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          {category?.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600 dark:text-gray-300 font-medium">{tool.name}</span>
      </nav>

      {/* Tool Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${category?.bgColor ?? "bg-blue-50"} ${category?.color ?? "text-blue-600"}`}>
          {iconMap[tool.icon] ?? <Calculator className="w-7 h-7" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/tools?category=${tool.category}`}
              className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${category?.bgColor} ${category?.color} ${category?.borderColor} border`}
            >
              {categoryIconMap[tool.category]}
              {category?.name}
            </Link>
            <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700 px-2.5 py-1 rounded-full font-medium">
              Free
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Users className="w-3.5 h-3.5" />
              {usageCount} uses this week
            </span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">{tool.description}</p>
            </div>
            <FavouriteToolButton slug={slug} />
          </div>
        </div>
      </div>

      {/* Tool Panel */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 mb-10">
        <ToolRunner slug={slug} />
      </div>

      {/* SEO Description */}
      {toolDescriptions[slug] && (
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-8 space-y-5">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">How it works</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{toolDescriptions[slug].howItWorks}</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">Why use this tool?</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{toolDescriptions[slug].whyUse}</p>
          </div>
        </div>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none font-medium text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  {faq.q}
                  <ChevronDown className="w-4 h-4 shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Rating + Feedback */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <ToolRating slug={slug} />
        <span className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-600" />
        <FeedbackWidget slug={slug} />
      </div>

      {/* Back link */}
      <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-10">
        <ArrowLeft className="w-4 h-4" />
        Back to all tools
      </Link>

      {/* People Also Used */}
      {alsoUsedTools.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">People Also Used</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {alsoUsedTools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </div>
      )}

      {/* Related Tools */}
      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            More {category?.name} Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
