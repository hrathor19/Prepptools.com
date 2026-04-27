import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Briefcase, Star, DollarSign, ExternalLink, CheckCircle2 } from "lucide-react";
import QuestionBank from "@/components/interview/QuestionBank";
import StarBuilder from "@/components/interview/StarBuilder";
import SalaryScript from "@/components/interview/SalaryScript";

export const metadata: Metadata = {
  title: "Interview Prep Hub — Free Interview Questions & STAR Builder",
  description: "Free interview preparation: 60+ role-specific questions with sample answers, STAR answer builder, and salary negotiation script generator. No sign-up required.",
  keywords: ["interview questions", "interview preparation", "STAR method", "salary negotiation", "software engineer interview", "HR interview questions", "free interview prep"],
  alternates: { canonical: "https://www.prepptools.com/interview-prep" },
  openGraph: {
    title: "Interview Prep Hub — Free Interview Questions & STAR Builder",
    description: "60+ role-specific interview questions, STAR answer builder, and salary negotiation scripts. Free, no sign-up.",
    url: "https://www.prepptools.com/interview-prep",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Interview Prep Hub",
  description: "Free interview preparation tools including role-specific questions, STAR method builder, and salary negotiation script generator.",
  url: "https://www.prepptools.com/interview-prep",
  provider: { "@type": "Organization", name: "PreppTools", url: "https://www.prepptools.com" },
};

const tips = [
  "Research the company's product, recent news, and mission before every interview",
  "Prepare 3 strong STAR stories that can answer multiple question types",
  "Always ask 2–3 thoughtful questions at the end — it signals genuine interest",
  "Practice out loud, not just in your head — it feels very different",
  "Send a thank-you email within 24 hours of every interview",
  "Know your numbers — projects you've worked on should have quantified outcomes",
];

export default function InterviewPrepPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white/90 border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-5 backdrop-blur-sm">
            <Briefcase className="w-3.5 h-3.5" /> Free · No sign-up · 10+ roles covered
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Interview Prep Hub
          </h1>
          <p className="text-blue-100/80 text-lg max-w-2xl mx-auto">
            60+ role-specific questions with expert tips, a STAR answer builder, and a salary negotiation script — everything you need to walk in confident.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-16">

        {/* Quick Tips */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Golden Rules Before Every Interview</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl px-4 py-3">
                <span className="text-green-500 font-bold text-sm shrink-0 mt-0.5">{i + 1}.</span>
                <p className="text-sm text-gray-700 dark:text-gray-200">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Question Bank */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Interview Question Bank</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Select your role, expand a question, and get expert tips and a sample answer.</p>
          <QuestionBank />
        </section>

        {/* STAR Builder */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">STAR Answer Builder</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">The STAR method (Situation, Task, Action, Result) is the gold standard for behavioural questions. Build your answer below.</p>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <StarBuilder />
          </div>
        </section>

        {/* Salary Negotiation */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Salary Negotiation Script Generator</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Don't leave money on the table. Enter your offer and expectation and get a professional script that works.</p>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <SalaryScript />
          </div>
        </section>

        {/* Resources CTA */}
        <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6">
          <p className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-3">Also useful for your job search</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/tools/ats-score" className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-xl hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> ATS Resume Score
            </Link>
            <Link href="/resume-templates" className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-xl hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Resume Templates
            </Link>
            <Link href="/tools/notice-period-calculator" className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-xl hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Notice Period Calculator
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
