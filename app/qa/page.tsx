"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Send, CheckCircle, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

type Question = {
  id: number;
  name: string;
  question: string;
  answer: string;
  answered_at: string;
};

const PER_PAGE = 5;

function FAQItem({ q }: { q: Question }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const words = q.answer.split(" ");
  const isLong = words.length > 60;
  const preview = isLong && !expanded ? words.slice(0, 60).join(" ") + "…" : q.answer;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{q.question}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Asked by {q.name}</p>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{preview}</p>
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Answered on{" "}
            {new Date(q.answered_at).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            })}
          </p>
        </div>
      )}
    </div>
  );
}

export default function QAPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", question: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    fetch("/api/qa/list")
      .then((r) => r.json())
      .then((data) => setQuestions(data.questions ?? []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/qa/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", question: "" });
    } catch {
      setStatus("error");
    }
  }

  const totalPages = Math.max(1, Math.ceil(questions.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = questions.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-2xl mb-4">
          <MessageCircle className="w-7 h-7 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Questions & Answers</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
          Have a question? Ask us anything — about our tools, features, or suggestions. We personally read and answer every question.
        </p>
      </div>

      {/* Answered Q&As */}
      {questions.length > 0 && (
        <section className="mb-12">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
            Answered Questions ({questions.length})
          </h2>
          <div className="space-y-3">
            {paginated.map((q) => (
              <FAQItem key={q.id} q={q} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                {safePage > 1 ? (
                  <button
                    onClick={() => setPage(safePage - 1)}
                    className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                ) : (
                  <span className="flex items-center gap-1 px-4 py-2 text-sm text-gray-300 dark:text-gray-600 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </span>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 flex items-center justify-center text-sm rounded-lg border font-medium transition-all ${
                      p === safePage
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:text-blue-600"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                {safePage < totalPages ? (
                  <button
                    onClick={() => setPage(safePage + 1)}
                    className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="flex items-center gap-1 px-4 py-2 text-sm text-gray-300 dark:text-gray-600 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg cursor-not-allowed">
                    Next <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Page {safePage} of {totalPages}</p>
            </div>
          )}
        </section>
      )}

      {/* Ask a Question */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Ask a Question</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          We&apos;ll review your question and reply as soon as possible. Answered questions appear publicly above.
        </p>

        {status === "success" ? (
          <div className="flex flex-col items-center py-8 gap-3 text-center">
            <CheckCircle className="w-11 h-11 text-green-500" />
            <p className="font-semibold text-gray-900 dark:text-white">Question submitted!</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">We&apos;ll answer it soon and publish the reply here.</p>
            <button onClick={() => setStatus("idle")} className="text-sm text-blue-600 dark:text-blue-400 underline mt-1">
              Ask another question
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
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Question</label>
              <textarea
                required
                rows={4}
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="What would you like to know?"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
              {status === "loading" ? "Submitting..." : "Submit Question"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
