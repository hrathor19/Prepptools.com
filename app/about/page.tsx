"use client";

import { useState } from "react";
import { Wrench, Zap, Clock, Send, CheckCircle, Lightbulb, Users, Layers } from "lucide-react";

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
