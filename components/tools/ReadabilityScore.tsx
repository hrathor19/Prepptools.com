"use client";
import { useState, useMemo } from "react";

function countSyllables(word: string) {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  const m = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "").match(/[aeiouy]{1,2}/g);
  return Math.max(1, m ? m.length : 1);
}

function getGrade(score: number) {
  if (score >= 90) return { label: "Very Easy", color: "emerald", desc: "5th grade — Easy to read" };
  if (score >= 80) return { label: "Easy", color: "green", desc: "6th grade — Conversational" };
  if (score >= 70) return { label: "Fairly Easy", color: "lime", desc: "7th grade — Fairly easy" };
  if (score >= 60) return { label: "Standard", color: "yellow", desc: "8-9th grade — Plain English" };
  if (score >= 50) return { label: "Fairly Hard", color: "amber", desc: "High school — Some effort" };
  if (score >= 30) return { label: "Difficult", color: "orange", desc: "College level — Hard to read" };
  return { label: "Very Confusing", color: "red", desc: "College grad — Very complex" };
}

export default function ReadabilityScore() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    if (!text.trim()) return null;
    const words = text.trim().split(/\s+/).filter(Boolean);
    const sentences = Math.max(1, text.split(/[.!?]+/).filter(s => s.trim()).length);
    const syllables = words.reduce((s, w) => s + countSyllables(w), 0);
    const score = Math.max(0, Math.min(100,
      206.835 - 1.015 * (words.length / sentences) - 84.6 * (syllables / Math.max(1, words.length))
    ));
    return { score: Math.round(score), words: words.length, sentences, syllables,
      avgWords: (words.length / sentences).toFixed(1), avgSyllables: (syllables / words.length).toFixed(2) };
  }, [text]);

  const grade = stats ? getGrade(stats.score) : null;

  return (
    <div className="space-y-6">
      <textarea value={text} onChange={e => setText(e.target.value)} rows={7}
        placeholder="Paste your text here to measure readability…"
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none" />

      {stats && grade && (
        <div className="space-y-4">
          <div className={`bg-${grade.color}-50 border border-${grade.color}-200 rounded-2xl p-5 flex items-center gap-5`}>
            <div className="text-center">
              <p className="text-5xl font-bold text-gray-900">{stats.score}</p>
              <p className="text-xs text-gray-500 mt-1">out of 100</p>
            </div>
            <div>
              <p className={`text-xl font-bold text-${grade.color}-700`}>{grade.label}</p>
              <p className="text-sm text-gray-600">{grade.desc}</p>
            </div>
          </div>

          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full bg-${grade.color}-500 rounded-full transition-all`} style={{ width: `${stats.score}%` }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Words", value: stats.words },
              { label: "Sentences", value: stats.sentences },
              { label: "Syllables", value: stats.syllables },
              { label: "Avg words/sentence", value: stats.avgWords },
              { label: "Avg syllables/word", value: stats.avgSyllables },
              { label: "Flesch Score", value: stats.score },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-base font-bold text-gray-800">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
