"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageCircle, CheckCircle, Trash2, Send, Clock, Mail } from "lucide-react";

type Question = {
  id: number;
  name: string;
  email: string | null;
  question: string;
  answer: string | null;
  is_answered: boolean;
  created_at: string;
  answered_at: string | null;
};

export default function AdminQAPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "unanswered" | "answered">("all");

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/qa/list");
      const data = await res.json();
      setQuestions(data.questions ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  async function handleAnswer(id: number) {
    const answer = answers[id]?.trim();
    if (!answer) return;
    setSaving(id);
    try {
      await fetch(`/api/admin/qa/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      await fetchQuestions();
      setAnswers((prev) => { const next = { ...prev }; delete next[id]; return next; });
    } finally {
      setSaving(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this question?")) return;
    await fetch(`/api/admin/qa/${id}`, { method: "DELETE" });
    await fetchQuestions();
  }

  const filtered = questions.filter((q) => {
    if (filter === "unanswered") return !q.is_answered;
    if (filter === "answered") return q.is_answered;
    return true;
  });

  const unansweredCount = questions.filter((q) => !q.is_answered).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Q&amp;A</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {questions.length} total · {unansweredCount} pending
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "unanswered", "answered"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
              {f === "unanswered" && unansweredCount > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unansweredCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400 py-10 text-center">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl py-16 text-center">
          <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No questions here yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((q) => (
            <div key={q.id} className={`bg-white border rounded-2xl p-5 ${q.is_answered ? "border-green-200" : "border-orange-200"}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{q.name}</span>
                    {q.email && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Mail className="w-3 h-3" /> {q.email}
                      </span>
                    )}
                    {q.is_answered ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Answered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(q.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-gray-800 bg-gray-50 rounded-xl px-4 py-3 mb-3">{q.question}</p>

              {q.is_answered && q.answer && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-3">
                  <p className="text-xs font-semibold text-green-700 mb-1">Your Answer</p>
                  <p className="text-sm text-gray-700">{q.answer}</p>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <textarea
                  rows={2}
                  value={answers[q.id] ?? ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder={q.is_answered ? "Update your answer..." : "Write your answer..."}
                  className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
                <button
                  onClick={() => handleAnswer(q.id)}
                  disabled={saving === q.id || !answers[q.id]?.trim()}
                  className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors self-end"
                >
                  <Send className="w-3.5 h-3.5" />
                  {saving === q.id ? "Saving..." : q.is_answered ? "Update" : "Answer"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
