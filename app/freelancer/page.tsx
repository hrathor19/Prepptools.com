import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, ArrowRight, ExternalLink, Briefcase, IndianRupee, Zap } from "lucide-react";
import RateCalculator from "@/components/freelancer/RateCalculator";
import PlatformCalculator from "@/components/freelancer/PlatformCalculator";

export const metadata: Metadata = {
  title: "Freelancer Hub — Rate Calculator & Platform Profit Calculator",
  description: "Free tools for freelancers: calculate your hourly rate, compare Upwork vs Fiverr fees, estimate project profit, and plan your freelance income. No sign-up.",
  keywords: ["freelancer rate calculator", "upwork fee calculator", "fiverr fee calculator", "freelance income", "hourly rate calculator", "freelancer tools india"],
  alternates: { canonical: "https://www.prepptools.com/freelancer" },
  openGraph: {
    title: "Freelancer Hub — Free Tools for Freelancers",
    description: "Calculate your freelance rate, compare platform fees, and plan your income — all free.",
    url: "https://www.prepptools.com/freelancer",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Freelancer Hub",
  description: "Free freelancer tools including rate calculator and platform fee comparison for Upwork, Fiverr, Toptal, and Freelancer.com.",
  url: "https://www.prepptools.com/freelancer",
};

const stats = [
  { value: "15M+", label: "Freelancers in India" },
  { value: "40%", label: "YoY growth in gig economy" },
  { value: "₹0", label: "Cost to use these tools" },
];

const freelanceTips = [
  { title: "Always charge a discovery fee", body: "Even ₹2,000 for a scoping call filters out time-wasters and makes clients take you seriously." },
  { title: "Bill in milestones, not on delivery", body: "30% upfront, 40% at midpoint, 30% on delivery. Never deliver final work before final payment." },
  { title: "Factor in non-billable time", body: "Only 60–70% of your work hours are billable. Proposals, admin, and chasing payments eat the rest — price accordingly." },
  { title: "Raise your rate every 6 months", body: "Even 10–15% annually is standard. Long-term clients expect it. New clients won't know the difference." },
  { title: "Register as a sole proprietor", body: "Get a GST number if billing above ₹20L/year. It's free, makes you look professional, and unlocks tax deductions on expenses." },
  { title: "Build one anchor client first", body: "A retainer client paying ₹30–50k/month covers your basics. Build everything else on top. Stability lets you be selective." },
];

export default function FreelancerPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white/90 border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-5 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5" /> Built for Indian freelancers
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Freelancer Hub
          </h1>
          <p className="text-purple-100/80 text-lg max-w-2xl mx-auto mb-8">
            Know your worth. Know your real earnings. Tools every freelancer needs — rate calculator, platform fee comparator, and business tips.
          </p>
          <div className="flex justify-center gap-8 sm:gap-16">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</p>
                <p className="text-purple-200 text-xs sm:text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-16">

        {/* Rate Calculator */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee className="w-5 h-5 text-violet-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Freelance Rate Calculator</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your income goal and working preferences — get your minimum hourly, daily, and monthly rate.</p>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <RateCalculator />
          </div>
        </section>

        {/* Platform Fee Calculator */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-5 h-5 text-violet-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Platform Fee Calculator</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">See exactly how much Upwork, Fiverr, Toptal, and others take — and what you actually pocket.</p>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <PlatformCalculator />
          </div>
        </section>

        {/* Freelance Tips */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-violet-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">6 Rules Every Freelancer Should Follow</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {freelanceTips.map((tip, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">{tip.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{tip.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <section className="bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 rounded-2xl p-6">
          <p className="text-sm font-bold text-violet-700 dark:text-violet-300 mb-4">More tools useful for freelancers</p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/tools/gst-calculator", label: "GST Calculator" },
              { href: "/tools/invoice-generator", label: "Invoice Generator" },
              { href: "/tools/salary-calculator", label: "Salary Calculator" },
              { href: "/tools/tax-regime-calculator", label: "Tax Regime Calculator" },
              { href: "/tools/currency-converter", label: "Currency Converter" },
              { href: "/interview-prep", label: "Interview Prep Hub" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-xl hover:border-violet-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> {l.label}
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
