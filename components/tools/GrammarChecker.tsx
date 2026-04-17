"use client";

import { useState } from "react";

interface Replacement {
  value: string;
}

interface Match {
  message: string;
  shortMessage: string;
  replacements: Replacement[];
  offset: number;
  length: number;
  context: { text: string; offset: number; length: number };
  rule: {
    id: string;
    description: string;
    issueType: string;
    category: { id: string; name: string };
  };
}

const categoryColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  TYPOS:       { bg: "bg-red-50 dark:bg-red-900/20",    text: "text-red-700 dark:text-red-400",    border: "border-red-200 dark:border-red-700",    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" },
  GRAMMAR:     { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-700", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400" },
  PUNCTUATION: { bg: "bg-amber-50 dark:bg-amber-900/20",  text: "text-amber-700 dark:text-amber-400",  border: "border-amber-200 dark:border-amber-700",  badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" },
  STYLE:       { bg: "bg-blue-50 dark:bg-blue-900/20",   text: "text-blue-700 dark:text-blue-400",   border: "border-blue-200 dark:border-blue-700",   badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" },
  CASING:      { bg: "bg-violet-50 dark:bg-violet-900/20", text: "text-violet-700 dark:text-violet-400", border: "border-violet-200 dark:border-violet-700", badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400" },
};
const defaultColor = { bg: "bg-gray-50 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300", border: "border-gray-200 dark:border-gray-700", badge: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" };

function getColor(categoryId: string) {
  return categoryColors[categoryId] ?? defaultColor;
}

function ContextSnippet({ ctx, issueOffset, issueLength }: { ctx: { text: string; offset: number; length: number }; issueOffset: number; issueLength: number }) {
  const before = ctx.text.slice(0, ctx.offset);
  const highlighted = ctx.text.slice(ctx.offset, ctx.offset + ctx.length);
  const after = ctx.text.slice(ctx.offset + ctx.length);
  return (
    <p className="text-xs font-mono bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 mt-1 text-gray-500 dark:text-gray-400 truncate">
      …{before}<span className="bg-yellow-200 dark:bg-yellow-700/60 text-gray-900 dark:text-gray-100 rounded px-0.5">{highlighted}</span>{after}…
    </p>
  );
  void issueOffset; void issueLength;
}

export default function GrammarChecker() {
  const [text, setText] = useState("");
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState("en-US");

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  async function checkGrammar() {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setMatches(null);
    try {
      const body = new URLSearchParams({ text, language: lang, enabledOnly: "false" });
      const res = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setMatches(data.matches ?? []);
    } catch {
      setError("Could not reach the grammar server. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const score = matches === null ? null : Math.max(0, Math.min(100, Math.round(100 - matches.length * (100 / Math.max(wordCount, 10)))));

  const languages = [
    { code: "en-US", label: "English (US)" },
    { code: "en-GB", label: "English (UK)" },
    { code: "en-AU", label: "English (AU)" },
    { code: "auto", label: "Auto-detect" },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl px-4 py-3 text-sm text-green-800 dark:text-green-300">
        Powered by <strong>LanguageTool</strong> — the same open-source engine used by millions. Checks grammar, spelling, punctuation, and style.
      </div>

      {/* Language + Textarea */}
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0">Language:</label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg px-3 py-1.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {languages.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </div>

      <textarea
        rows={10}
        value={text}
        onChange={(e) => { setText(e.target.value); setMatches(null); }}
        placeholder="Paste or type your text here to check grammar, spelling, and style…"
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none placeholder-gray-400"
      />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-gray-400 dark:text-gray-500">{wordCount} words · {text.length} characters</p>
        <button
          onClick={checkGrammar}
          disabled={!text.trim() || loading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
        >
          {loading ? (
            <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Checking…</>
          ) : "Check Grammar"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400">{error}</div>
      )}

      {matches !== null && (
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-xl px-5 py-4 border border-gray-200 dark:border-gray-700">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold border-4 shrink-0 ${
              matches.length === 0 ? "border-green-500 text-green-600 bg-green-50 dark:bg-green-900/30" :
              score! >= 70 ? "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-900/30" :
              "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/30"
            }`}>
              {matches.length === 0 ? "✓" : matches.length}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {matches.length === 0
                  ? "No issues found — great writing!"
                  : `${matches.length} issue${matches.length !== 1 ? "s" : ""} found`}
              </p>
              {matches.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {Object.entries(
                    matches.reduce<Record<string, number>>((acc, m) => {
                      const cat = m.rule.category.name;
                      acc[cat] = (acc[cat] ?? 0) + 1;
                      return acc;
                    }, {})
                  ).map(([cat, count]) => `${count} ${cat.toLowerCase()}`).join(" · ")}
                </p>
              )}
            </div>
          </div>

          {matches.length === 0 ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl px-4 py-8 text-center">
              <p className="text-2xl mb-2">🎉</p>
              <p className="text-green-700 dark:text-green-400 font-semibold text-sm">Your text has no grammar or spelling issues!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((m, i) => {
                const col = getColor(m.rule.category.id);
                return (
                  <div key={i} className={`border rounded-xl p-4 ${col.bg} ${col.border}`}>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.badge}`}>
                            {m.rule.category.name}
                          </span>
                        </div>
                        <p className={`text-sm font-semibold ${col.text}`}>{m.message}</p>
                        <ContextSnippet ctx={m.context} issueOffset={m.offset} issueLength={m.length} />
                      </div>
                      {m.replacements.length > 0 && (
                        <div className="shrink-0 text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Suggestions</p>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {m.replacements.slice(0, 3).map((r, j) => (
                              <span key={j} className="text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-lg font-mono">
                                {r.value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
