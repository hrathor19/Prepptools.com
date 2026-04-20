import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft } from "lucide-react";

type ComparisonData = {
  title: string;
  description: string;
  competitor: string;
  intro: string;
  rows: { feature: string; prepptools: string | boolean; them: string | boolean; note?: string }[];
  verdict: string;
  toolLink?: string;
  toolName?: string;
};

const comparisons: Record<string, ComparisonData> = {
  "prepptools-vs-smallpdf": {
    title: "PreppTools vs Smallpdf",
    description: "Compare PreppTools and Smallpdf for PDF merging, compression, splitting, and conversion. See which is truly free.",
    competitor: "Smallpdf",
    intro: "Smallpdf is a popular PDF tool but limits free users to 2 tasks per day and requires sign-up for most features. PreppTools offers the same PDF tools — merge, split, compress, rotate, watermark, sign — all free, all in-browser, with no account needed.",
    rows: [
      { feature: "Free tier",               prepptools: "Unlimited",      them: "2 tasks/day" },
      { feature: "Sign-up required",        prepptools: false,            them: true },
      { feature: "Merge PDF",               prepptools: true,             them: true },
      { feature: "Split PDF",               prepptools: true,             them: true },
      { feature: "Compress PDF",            prepptools: true,             them: true },
      { feature: "PDF to Image",            prepptools: true,             them: true },
      { feature: "Sign PDF",                prepptools: true,             them: "Pro only" },
      { feature: "Watermark PDF",           prepptools: true,             them: "Pro only" },
      { feature: "Files stay on device",    prepptools: true,             them: false, note: "Smallpdf uploads files to its servers" },
      { feature: "Dark mode",               prepptools: true,             them: false },
      { feature: "Cost",                    prepptools: "Free forever",   them: "₹899/month (Pro)" },
    ],
    verdict: "For casual PDF work, PreppTools gives you everything Smallpdf's free tier does — without the daily limit or account requirement. If you need OCR or cloud storage integration, Smallpdf Pro may be worth it.",
    toolLink: "/tools?category=pdf",
    toolName: "Browse PDF Tools",
  },
  "free-grammarly-alternatives": {
    title: "Free Grammarly Alternatives",
    description: "Best free grammar checker tools that work without a Grammarly subscription. Compare features, accuracy, and privacy.",
    competitor: "Grammarly",
    intro: "Grammarly's free tier checks basic grammar but hides tone, clarity, and plagiarism checks behind a paywall. PreppTools' Grammar Checker, powered by LanguageTool, checks grammar, spelling, punctuation, and style — all free, no word limits, no sign-up.",
    rows: [
      { feature: "Free tier",               prepptools: "Unlimited",       them: "Basic checks only" },
      { feature: "Sign-up required",        prepptools: false,             them: true },
      { feature: "Grammar check",           prepptools: true,              them: true },
      { feature: "Spelling check",          prepptools: true,              them: true },
      { feature: "Punctuation check",       prepptools: true,              them: true },
      { feature: "Style suggestions",       prepptools: true,              them: "Premium only" },
      { feature: "Tone detection",          prepptools: false,             them: "Premium only" },
      { feature: "Browser extension",       prepptools: false,             them: true },
      { feature: "Text stays on device",    prepptools: false,             them: false, note: "Both send text to external APIs for checking" },
      { feature: "Cost",                    prepptools: "Free forever",    them: "₹1,200/month (Premium)" },
    ],
    verdict: "For most writing tasks, PreppTools' Grammar Checker catches the same issues as Grammarly's free tier — without any account. Grammarly Premium is worth it for professional writers who need tone analysis and real-time browser integration.",
    toolLink: "/tools/grammar-checker",
    toolName: "Try Grammar Checker",
  },
  "prepptools-vs-ilovepdf": {
    title: "PreppTools vs iLovePDF",
    description: "Compare PreppTools and iLovePDF for PDF tools. Features, limits, privacy, and cost compared side by side.",
    competitor: "iLovePDF",
    intro: "iLovePDF is a well-known PDF toolkit with similar tools to PreppTools. Both offer free usage, but iLovePDF has file size limits on free tier and uploads files to their servers. PreppTools processes PDFs entirely in your browser.",
    rows: [
      { feature: "Free tier",               prepptools: "Unlimited",      them: "Limited file size" },
      { feature: "Sign-up required",        prepptools: false,            them: false },
      { feature: "Merge PDF",               prepptools: true,             them: true },
      { feature: "Split PDF",               prepptools: true,             them: true },
      { feature: "Compress PDF",            prepptools: true,             them: true },
      { feature: "Rotate PDF",              prepptools: true,             them: true },
      { feature: "Watermark PDF",           prepptools: true,             them: true },
      { feature: "OCR (text from image)",   prepptools: false,            them: true },
      { feature: "Files stay on device",    prepptools: true,             them: false, note: "iLovePDF uploads files to their servers" },
      { feature: "Dark mode",               prepptools: true,             them: false },
      { feature: "Cost",                    prepptools: "Free forever",   them: "₹600/month (Premium)" },
    ],
    verdict: "Both are solid free PDF tools. PreppTools wins on privacy (no server uploads) and no file size limits. iLovePDF wins if you need OCR functionality.",
    toolLink: "/tools?category=pdf",
    toolName: "Browse PDF Tools",
  },
  "free-currency-converter-tools": {
    title: "Best Free Currency Converter Tools",
    description: "Compare the best free online currency converters — live rates, supported currencies, and ease of use.",
    competitor: "XE Currency",
    intro: "XE.com is the most popular currency converter but shows ads and requires an account for the app. PreppTools' Currency Converter offers live rates for 30+ currencies in a clean, ad-free interface with no sign-up.",
    rows: [
      { feature: "Free to use",             prepptools: true,             them: true },
      { feature: "Sign-up required",        prepptools: false,            them: "For app features" },
      { feature: "Live rates",              prepptools: true,             them: true },
      { feature: "Currencies supported",    prepptools: "30+",            them: "170+" },
      { feature: "Historical rates",        prepptools: false,            them: true },
      { feature: "Rate alerts",             prepptools: false,            them: "Paid" },
      { feature: "No ads",                  prepptools: true,             them: false },
      { feature: "Dark mode",               prepptools: true,             them: false },
      { feature: "Cost",                    prepptools: "Free forever",   them: "Free with ads / Premium available" },
    ],
    verdict: "For quick conversions between major currencies, PreppTools is faster and cleaner. XE is better if you need historical rates, 170+ currencies, or rate alerts.",
    toolLink: "/tools/currency-converter",
    toolName: "Try Currency Converter",
  },
};

export async function generateStaticParams() {
  return Object.keys(comparisons).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = comparisons[slug];
  if (!data) return { title: "Not Found" };
  return {
    title: `${data.title} | PreppTools`,
    description: data.description,
    alternates: { canonical: `https://www.prepptools.com/compare/${slug}` },
  };
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true)  return <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />;
  if (value === false) return <XCircle className="w-5 h-5 text-red-400 mx-auto" />;
  return <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>;
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = comparisons[slug];
  if (!data) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/compare" className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All Comparisons
      </Link>

      <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Comparison</p>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">{data.title}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">{data.intro}</p>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden mb-8">
        <div className="grid grid-cols-3 bg-gray-50 dark:bg-gray-700/50 px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          <span>Feature</span>
          <span className="text-center text-blue-600 dark:text-blue-400">PreppTools</span>
          <span className="text-center">{data.competitor}</span>
        </div>
        {data.rows.map((row, i) => (
          <div key={row.feature} className={`grid grid-cols-3 px-5 py-3.5 items-center border-t border-gray-100 dark:border-gray-700 ${i % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-700/20"}`}>
            <div>
              <span className="text-sm text-gray-700 dark:text-gray-200">{row.feature}</span>
              {row.note && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{row.note}</p>}
            </div>
            <div className="flex justify-center"><Cell value={row.prepptools} /></div>
            <div className="flex justify-center"><Cell value={row.them} /></div>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl px-5 py-4 mb-8">
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">Verdict</p>
        <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{data.verdict}</p>
      </div>

      {data.toolLink && (
        <Link href={data.toolLink} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          {data.toolName} <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
