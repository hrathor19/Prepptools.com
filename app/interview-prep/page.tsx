import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen, Briefcase, Star, DollarSign, ExternalLink,
  Globe, MessageSquare, Mic, Mail, TrendingUp,
  Users, FileSearch,
} from "lucide-react";
import QuestionBank from "@/components/interview/QuestionBank";
import StarBuilder from "@/components/interview/StarBuilder";
import SalaryScript from "@/components/interview/SalaryScript";

export const metadata: Metadata = {
  title: "Interview Prep Hub — Free Interview Questions & STAR Builder",
  description: "Free interview preparation: 140+ role-specific questions with sample answers, STAR answer builder, and salary negotiation script generator. No sign-up required.",
  keywords: ["interview questions", "interview preparation", "STAR method", "salary negotiation", "software engineer interview", "HR interview questions", "free interview prep"],
  alternates: { canonical: "https://www.prepptools.com/interview-prep" },
  openGraph: {
    title: "Interview Prep Hub — Free Interview Questions & STAR Builder",
    description: "140+ role-specific interview questions, STAR answer builder, and salary negotiation scripts. Free, no sign-up.",
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

const heroStats = [
  { value: "140+", label: "Questions" },
  { value: "14",   label: "Job Roles" },
  { value: "4",    label: "Domains" },
  { value: "Free", label: "No sign-up" },
];

const steps = [
  {
    icon: <Users className="w-5 h-5" />,
    num: "01",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/30",
    title: "Choose Your Role",
    desc: "14 roles across Technology, Business, Data & Design",
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    num: "02",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/30",
    title: "Practice Questions",
    desc: "Expert tips + sample answers for every question",
  },
  {
    icon: <Star className="w-5 h-5" />,
    num: "03",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/30",
    title: "Build STAR Answers",
    desc: "Structure responses with the gold-standard method",
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    num: "04",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/30",
    title: "Negotiate Your Offer",
    desc: "Get a personalised salary negotiation script",
  },
];

const tips = [
  {
    icon: <Globe className="w-5 h-5" />,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-100 dark:border-blue-800",
    title: "Research the Company",
    body: "Research the company's product, recent news, and mission statement before every interview.",
  },
  {
    icon: <Star className="w-5 h-5" />,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-100 dark:border-amber-800",
    title: "Prepare 3 STAR Stories",
    body: "Prepare 3 strong STAR stories that can flex to answer multiple question types.",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-100 dark:border-purple-800",
    title: "Ask Great Questions",
    body: "Always ask 2–3 thoughtful questions at the end — it signals genuine interest.",
  },
  {
    icon: <Mic className="w-5 h-5" />,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-100 dark:border-green-800",
    title: "Practice Out Loud",
    body: "Practice out loud, not just in your head — answering aloud feels very different.",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    color: "text-cyan-600",
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
    border: "border-cyan-100 dark:border-cyan-800",
    title: "Follow Up Promptly",
    body: "Send a personalised thank-you email within 24 hours of every interview.",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-100 dark:border-indigo-800",
    title: "Know Your Numbers",
    body: "Every project you mention should have quantified outcomes — numbers make stories land.",
  },
];

const relatedTools = [
  {
    href: "/tools/ats-score",
    icon: <FileSearch className="w-5 h-5" />,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    title: "ATS Resume Scorer",
    desc: "See how your resume scores against ATS algorithms before you apply.",
  },
  {
    href: "/resume-builder",
    icon: <Briefcase className="w-5 h-5" />,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    title: "Resume Builder",
    desc: "Build an ATS-optimised resume in minutes with clean, professional templates.",
  },
  {
    href: "/tools/notice-period-calculator",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/20",
    title: "Notice Period Calculator",
    desc: "Calculate your last working day and buyout cost in seconds.",
  },
];

export default function InterviewPrepPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white/90 border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <Briefcase className="w-3.5 h-3.5" />
            Free Interview Prep · 14 Roles · No Sign-up Required
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight max-w-3xl">
            Walk Into Every Interview<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">
              Fully Prepared
            </span>
          </h1>

          <p className="text-blue-100/80 text-lg max-w-2xl mb-10 leading-relaxed">
            140+ role-specific questions with expert tips, a STAR answer builder, and a salary negotiation script generator — everything in one place, completely free.
          </p>

          <div className="flex flex-wrap gap-x-10 gap-y-5">
            {heroStats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-white">{s.value}</p>
                <p className="text-sm text-blue-300/80 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-gray-50 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg} ${s.color}`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-0.5 uppercase tracking-widest">{s.num}</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-snug">{s.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-20">

        {/* Golden Rules */}
        <section>
          <div className="mb-7">
            <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Must-Know</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Golden Rules Before Every Interview</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Apply these consistently and you&apos;ll always be better prepared than the competition.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map((t) => (
              <div key={t.title} className={`flex gap-3.5 p-4 rounded-2xl border ${t.bg} ${t.border}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white dark:bg-gray-800 shadow-sm ${t.color}`}>
                  {t.icon}
                </div>
                <div>
                  <p className={`text-sm font-semibold mb-1 ${t.color}`}>{t.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Question Bank */}
        <section>
          <div className="mb-7">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Practice</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Interview Question Bank</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Select your role from the sidebar, expand a question, read the expert tip, and reveal the sample answer.
            </p>
          </div>
          <QuestionBank />
        </section>

        {/* STAR Builder */}
        <section>
          <div className="mb-7">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Answer Framework</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">STAR Answer Builder</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              The STAR method (Situation, Task, Action, Result) is the gold standard for behavioural questions. Fill in each section and get a polished, copy-ready answer.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <StarBuilder />
          </div>
        </section>

        {/* Salary Negotiation */}
        <section>
          <div className="mb-7">
            <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Salary Negotiation</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Salary Negotiation Script Generator</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Don&apos;t leave money on the table. Enter your offer and expectation and get a professional, proven negotiation script tailored to your situation.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <SalaryScript />
          </div>
        </section>

      </div>

      {/* ── RELATED TOOLS ── */}
      <section className="bg-gray-50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-700 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Job Search Toolkit</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Also Useful for Your Job Search</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Free tools to help you land the job — no account needed.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {relatedTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex items-start gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tool.bg} ${tool.color}`}>
                  {tool.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                    {tool.title}
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
