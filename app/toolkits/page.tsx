import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, Briefcase, Code2, TrendingUp, PenLine, Building2 } from "lucide-react";
import { getToolBySlug } from "@/lib/tools-data";
import ToolCard from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "Tool Kits — Curated Tool Collections | PreppTools",
  description: "Hand-picked tool collections for students, job seekers, developers, finance pros, content creators, and businesses — all free.",
  alternates: { canonical: "https://www.prepptools.com/toolkits" },
};

const kits = [
  {
    id: "student",
    label: "Student Kit",
    icon: GraduationCap,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-700",
    desc: "Everything you need for assignments, essays, and academic work.",
    slugs: ["word-counter", "grammar-checker", "plagiarism-checker", "case-converter", "reading-time", "pdf-to-text"],
  },
  {
    id: "job-seeker",
    label: "Job Seeker Kit",
    icon: Briefcase,
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-700",
    desc: "Tools to prepare your resume and stand out from the crowd.",
    slugs: ["ats-score", "grammar-checker", "word-counter", "pdf-to-word", "salary-calculator", "reading-time"],
  },
  {
    id: "developer",
    label: "Developer Kit",
    icon: Code2,
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-200 dark:border-indigo-700",
    desc: "Everyday utilities that every developer reaches for constantly.",
    slugs: ["json-formatter", "base64", "jwt-decoder", "regex-tester", "uuid-generator", "url-encoder"],
  },
  {
    id: "finance",
    label: "Finance Kit",
    icon: TrendingUp,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-700",
    desc: "Plan your money, compare tax regimes, and grow your savings.",
    slugs: ["loan-calculator", "sip-calculator", "tax-regime-calculator", "compound-interest", "currency-converter", "salary-calculator"],
  },
  {
    id: "content-creator",
    label: "Content Creator Kit",
    icon: PenLine,
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-200 dark:border-rose-700",
    desc: "Write better, faster, and publish with confidence.",
    slugs: ["grammar-checker", "ai-prompt-generator", "word-counter", "reading-time", "plagiarism-checker", "character-limit"],
  },
  {
    id: "business",
    label: "Business Kit",
    icon: Building2,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-700",
    desc: "Run smoother day-to-day operations without expensive software.",
    slugs: ["invoice-generator", "gst-calculator", "currency-converter", "qr-code-generator", "word-to-pdf", "excel-to-csv"],
  },
];

export default function ToolkitsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">Collections</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Curated Tool Kits
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
          Not sure where to start? We&apos;ve grouped the most useful tools by use case — pick your kit and get going.
        </p>
      </div>

      {/* Kits */}
      <div className="space-y-14">
        {kits.map((kit) => {
          const kitTools = kit.slugs
            .map((s) => getToolBySlug(s))
            .filter((t) => t !== undefined);
          const Icon = kit.icon;

          return (
            <section key={kit.id}>
              {/* Kit header */}
              <div className={`flex items-center gap-4 mb-6 p-5 rounded-2xl border ${kit.bg} ${kit.border}`}>
                <div className={`w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center ${kit.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className={`text-xl font-bold ${kit.color}`}>{kit.label}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{kit.desc}</p>
                </div>
                <Link
                  href="/tools"
                  className={`hidden sm:inline-flex items-center gap-1.5 text-sm font-medium ${kit.color} hover:underline`}
                >
                  All Tools <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Tools grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {kitTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
