import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Tool Comparisons — PreppTools vs Paid Alternatives",
  description: "See how PreppTools compares to paid tools like Smallpdf, Grammarly, and others. All the same features, completely free.",
  alternates: { canonical: "https://www.prepptools.com/compare" },
};

const comparisons = [
  {
    slug: "prepptools-vs-smallpdf",
    title: "PreppTools vs Smallpdf",
    desc: "Merge, compress, split, and convert PDFs — free vs limited free tier.",
    tags: ["PDF Tools", "Free vs Paid"],
  },
  {
    slug: "free-grammarly-alternatives",
    title: "Free Grammarly Alternatives",
    desc: "Grammar and spell-checking tools that don't charge a monthly fee.",
    tags: ["Grammar", "Writing"],
  },
  {
    slug: "prepptools-vs-ilovepdf",
    title: "PreppTools vs iLovePDF",
    desc: "Full PDF toolkit comparison — features, limits, and privacy.",
    tags: ["PDF Tools", "Free vs Paid"],
  },
  {
    slug: "free-currency-converter-tools",
    title: "Best Free Currency Converters",
    desc: "Live exchange rates, supported currencies, and ease of use compared.",
    tags: ["Finance", "Currency"],
  },
];

const matrix = [
  { feature: "Free to use",           prepptools: true,  competitor: false },
  { feature: "No sign-up required",   prepptools: true,  competitor: false },
  { feature: "No file upload limits", prepptools: true,  competitor: false },
  { feature: "No watermarks",         prepptools: true,  competitor: false },
  { feature: "Works in browser",      prepptools: true,  competitor: true  },
  { feature: "Privacy (no server)",   prepptools: true,  competitor: false },
  { feature: "Dark mode",             prepptools: true,  competitor: false },
  { feature: "100+ tools",            prepptools: true,  competitor: false },
];

export default function ComparePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">Comparisons</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          PreppTools vs the Alternatives
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
          Why pay monthly for tools you can use free? Here&apos;s how we stack up.
        </p>
      </div>

      {/* Quick comparison matrix */}
      <div className="mb-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-50 dark:bg-gray-700/50 px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          <span>Feature</span>
          <span className="text-center text-blue-600 dark:text-blue-400">PreppTools</span>
          <span className="text-center">Typical Paid Tool</span>
        </div>
        {matrix.map((row, i) => (
          <div
            key={row.feature}
            className={`grid grid-cols-3 px-5 py-3.5 items-center text-sm border-t border-gray-100 dark:border-gray-700 ${
              i % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-700/20"
            }`}
          >
            <span className="text-gray-700 dark:text-gray-200">{row.feature}</span>
            <span className="flex justify-center">
              {row.prepptools
                ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                : <XCircle className="w-5 h-5 text-red-400" />}
            </span>
            <span className="flex justify-center">
              {row.competitor
                ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                : <XCircle className="w-5 h-5 text-red-400" />}
            </span>
          </div>
        ))}
      </div>

      {/* Comparison articles */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Detailed Comparisons</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {comparisons.map((c) => (
          <Link
            key={c.slug}
            href={`/compare/${c.slug}`}
            className="group block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="flex flex-wrap gap-1.5 mb-3">
              {c.tags.map((t) => (
                <span key={t} className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 px-2.5 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
              {c.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{c.desc}</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              Read comparison <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/tools" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          Try All Free Tools <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
