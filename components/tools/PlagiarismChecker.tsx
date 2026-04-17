"use client";

import { useState } from "react";

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/\b[a-z']+\b/g) ?? [];
}

function jaccardSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 1;
  const setA = new Set(a);
  const setB = new Set(b);
  let intersection = 0;
  setA.forEach((w) => { if (setB.has(w)) intersection++; });
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function getSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+|(?<=\n)/).map((s) => s.trim()).filter((s) => s.length > 10);
}

function sentenceSimilarity(s1: string, s2: string): number {
  return jaccardSimilarity(tokenize(s1), tokenize(s2));
}

interface MatchResult {
  sentence: string;
  bestMatch: string;
  score: number;
}

function analyze(original: string, compared: string) {
  const tokensOrig = tokenize(original);
  const tokensComp = tokenize(compared);
  const overallScore = jaccardSimilarity(tokensOrig, tokensComp);

  const sentencesOrig = getSentences(original);
  const sentencesComp = getSentences(compared);

  const matches: MatchResult[] = [];
  for (const s1 of sentencesComp) {
    let best = 0;
    let bestMatch = "";
    for (const s2 of sentencesOrig) {
      const sim = sentenceSimilarity(s1, s2);
      if (sim > best) { best = sim; bestMatch = s2; }
    }
    if (best >= 0.35) {
      matches.push({ sentence: s1, bestMatch, score: best });
    }
  }

  matches.sort((a, b) => b.score - a.score);

  return {
    overallScore: Math.round(overallScore * 100),
    uniqueWordsOrig: new Set(tokensOrig).size,
    uniqueWordsComp: new Set(tokensComp).size,
    matchingSentences: matches.slice(0, 10),
  };
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "#ef4444" : score >= 40 ? "#f59e0b" : "#22c55e";
  const label = score >= 70 ? "High Similarity" : score >= 40 ? "Moderate Similarity" : "Low Similarity";
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
        <text x="60" y="56" textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="bold" fill={color}>{score}%</text>
        <text x="60" y="74" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#6b7280">similarity</text>
      </svg>
      <p className="text-sm font-semibold" style={{ color }}>{label}</p>
    </div>
  );
}

export default function PlagiarismChecker() {
  const [original, setOriginal] = useState("");
  const [compared, setCompared] = useState("");
  const [result, setResult] = useState<ReturnType<typeof analyze> | null>(null);

  function check() {
    if (!original.trim() || !compared.trim()) return;
    setResult(analyze(original, compared));
  }

  const textareaCls = "w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none placeholder-gray-400";

  return (
    <div className="space-y-5">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-800 dark:text-blue-300">
        Paste an <strong>original text</strong> and a <strong>text to check</strong>. This tool computes word-level and sentence-level similarity between the two — useful for teachers checking student submissions, or checking paraphrasing.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Original / Reference Text</label>
          <textarea
            rows={10}
            value={original}
            onChange={(e) => { setOriginal(e.target.value); setResult(null); }}
            placeholder="Paste the original text here…"
            className={textareaCls}
          />
          <p className="text-xs text-gray-400 mt-1">{original.trim() ? tokenize(original).length + " words" : ""}</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Text to Check</label>
          <textarea
            rows={10}
            value={compared}
            onChange={(e) => { setCompared(e.target.value); setResult(null); }}
            placeholder="Paste the text you want to check for similarity…"
            className={textareaCls}
          />
          <p className="text-xs text-gray-400 mt-1">{compared.trim() ? tokenize(compared).length + " words" : ""}</p>
        </div>
      </div>

      <button
        onClick={check}
        disabled={!original.trim() || !compared.trim()}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
      >
        Check Similarity
      </button>

      {result && (
        <div className="space-y-5">
          {/* Overview */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing score={result.overallScore} />
            <div className="flex-1 grid grid-cols-2 gap-3 w-full">
              {[
                { label: "Overall Similarity", value: result.overallScore + "%" },
                { label: "Matching Sentences", value: result.matchingSentences.length.toString() },
                { label: "Unique Words (Original)", value: result.uniqueWordsOrig.toString() },
                { label: "Unique Words (Checked)", value: result.uniqueWordsComp.toString() },
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-0.5">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Matching sentences */}
          {result.matchingSentences.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Similar Sentence Pairs</h3>
              <div className="space-y-3">
                {result.matchingSentences.map((m, i) => (
                  <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-4 py-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Match #{i + 1}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        m.score >= 0.7 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        m.score >= 0.5 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>{Math.round(m.score * 100)}% similar</span>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Original</p>
                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{m.bestMatch}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">Checked</p>
                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{m.sentence}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.matchingSentences.length === 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl px-4 py-6 text-center">
              <p className="text-green-700 dark:text-green-400 font-semibold text-sm">No matching sentences found. The texts appear largely original.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
