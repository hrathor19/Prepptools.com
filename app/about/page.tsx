"use client";

import { useState } from "react";
import { Wrench, Zap, Clock, Send, CheckCircle, Lightbulb, Users, Layers, BookOpen, Download, IndianRupee, ShieldCheck, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", tool: "", description: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/suggest-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", phone: "", tool: "", description: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl mb-5">
          <Wrench className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          About PreppTools
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          We are on a mission to make everyday digital tasks effortless — by bringing all the tools you need to a single, fast, and completely free platform.
        </p>
      </div>

      {/* Mission cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {[
          {
            icon: <Zap className="w-6 h-6 text-yellow-500" />,
            bg: "bg-yellow-50 dark:bg-yellow-900/20",
            title: "One Platform",
            desc: "Stop jumping between 10 different websites. Every tool you use daily — PDF tools, calculators, converters, developer utilities — lives here in one place.",
          },
          {
            icon: <Clock className="w-6 h-6 text-blue-500" />,
            bg: "bg-blue-50 dark:bg-blue-900/20",
            title: "Save Your Time",
            desc: "We build tools that work instantly, with no sign-up, no paywalls, and no distractions. Open, use, done — in seconds.",
          },
          {
            icon: <Layers className="w-6 h-6 text-purple-500" />,
            bg: "bg-purple-50 dark:bg-purple-900/20",
            title: "Always Growing",
            desc: "We are actively building and shipping new tools every week. If a tool saves you time in daily life, it belongs on PreppTools.",
          },
        ].map(({ icon, bg, title, desc }) => (
          <div key={title} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${bg} mb-4`}>
              {icon}
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 mb-16">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Our Story</h2>
        </div>
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>
            PreppTools was born out of a simple frustration — every time we needed to merge a PDF, check a BMI, convert a currency, or format some JSON, we had to visit a different website. Each one had ads, forced sign-ups, and slow load times.
          </p>
          <p>
            So we built PreppTools: a single platform where anyone can access 100+ free tools instantly. No account required. No ads interrupting your work. No feature hidden behind a paywall. Just fast, reliable tools that do exactly what they say.
          </p>
          <p>
            We are a small team of developers passionate about productivity and simplicity. We ship new tools regularly and take every user suggestion seriously. If a tool makes daily life easier, it will find a home on PreppTools.
          </p>
        </div>
      </div>

      {/* PDF Courses Section */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
            <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">PDF Courses &amp; Study Material</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-3xl">
          Beyond free tools, PreppTools now offers affordable, high-quality PDF courses designed for students, professionals, and self-learners across India and globally.
        </p>

        {/* Main description */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 mb-6">
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              Our <strong className="text-gray-800 dark:text-gray-200">PDF course library</strong> is built for people who want to learn practical, job-ready skills at their own pace — without paying thousands of rupees for lengthy video courses that waste your time. Every course is a carefully crafted, structured <strong className="text-gray-800 dark:text-gray-200">PDF study guide</strong> covering everything from beginner fundamentals to advanced concepts.
            </p>
            <p>
              Whether you are a <strong className="text-gray-800 dark:text-gray-200">college student</strong> preparing for placements, a <strong className="text-gray-800 dark:text-gray-200">working professional</strong> upskilling for a promotion, or a self-taught developer trying to fill knowledge gaps — our courses are designed to give you a dense, structured learning resource you can read, revisit, and reference anytime. Once you purchase, you get <strong className="text-gray-800 dark:text-gray-200">lifetime access</strong> with an instant PDF download — no subscriptions, no expiry.
            </p>
            <p>
              Topics covered include <strong className="text-gray-800 dark:text-gray-200">SQL &amp; NoSQL databases</strong>, programming fundamentals, system design, data structures, digital marketing, finance, and more — with new courses added regularly. All courses are priced affordably, starting as low as ₹21, making quality education accessible to everyone regardless of budget.
            </p>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            {
              icon: <Download className="w-5 h-5 text-emerald-600" />,
              bg: "bg-emerald-50 dark:bg-emerald-900/20",
              title: "Instant PDF Download",
              desc: "Get immediate access to your course the moment you purchase. Download once, keep forever — read on any device, offline, anytime.",
            },
            {
              icon: <IndianRupee className="w-5 h-5 text-amber-600" />,
              bg: "bg-amber-50 dark:bg-amber-900/20",
              title: "Affordable Pricing",
              desc: "Premium study material starting from ₹21. One-time payment with no hidden fees, no subscriptions, and no recurring charges — ever.",
            },
            {
              icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
              bg: "bg-blue-50 dark:bg-blue-900/20",
              title: "Structured & Expert-Crafted",
              desc: "Every course is organized from beginner to advanced — covering theory, real-world examples, and practical use cases in a single, dense PDF.",
            },
            {
              icon: <BookOpen className="w-5 h-5 text-purple-600" />,
              bg: "bg-purple-50 dark:bg-purple-900/20",
              title: "Learn at Your Own Pace",
              desc: "No deadlines, no live sessions, no FOMO. Study when you want, skip what you know, and deep-dive into what matters most to you.",
            },
          ].map(({ icon, bg, title, desc }) => (
            <div key={title} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex items-start gap-4">
              <div className={`shrink-0 w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                {icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Who is it for */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-700 rounded-2xl p-7 mb-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Who are these courses for?</h3>
          <ul className="space-y-2.5">
            {[
              "College students preparing for campus placements and technical interviews",
              "Fresh graduates looking to build job-ready skills in programming, databases, and more",
              "Working professionals who want to upskill quickly without long video courses",
              "Developers and engineers filling knowledge gaps with structured reference material",
              "Competitive exam aspirants looking for concise, high-density study notes",
              "Anyone who prefers reading and self-paced learning over watching hours of videos",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "#38525a" }}
          >
            <BookOpen className="w-4 h-4" />
            Browse All Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-gray-400 dark:text-gray-500">Free courses available · No account needed to browse</p>
        </div>
      </div>

      {/* Suggest a Tool */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Suggest a Tool</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Can&apos;t find a tool you need? Tell us about it. We review every suggestion and build the most requested ones as fast as we can.
        </p>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <p className="text-base font-semibold text-gray-900 dark:text-white">Thank you for your suggestion!</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">We&apos;ll review it and get to work. Stay tuned!</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 underline"
            >
              Suggest another tool
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tool Name / Idea</label>
              <input
                type="text"
                required
                value={form.tool}
                onChange={(e) => setForm({ ...form, tool: e.target.value })}
                placeholder="e.g. Grammar Checker, Invoice Scanner, EMI Calculator..."
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">What should it do? <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Briefly describe what the tool should do and how it would help you..."
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            {status === "error" && (
              <p className="text-sm text-red-600 dark:text-red-400">Something went wrong. Please try again.</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              {status === "loading" ? "Sending..." : "Submit Suggestion"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
