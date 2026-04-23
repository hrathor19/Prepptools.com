"use client";

import { useState } from "react";
import { ChevronDown, Lightbulb, MessageSquare } from "lucide-react";
import { roles } from "@/lib/interview-data";

export default function QuestionBank() {
  const [activeRole, setActiveRole] = useState(roles[0].id);
  const [openIdx, setOpenIdx]       = useState<number | null>(null);
  const [showSample, setShowSample] = useState<number | null>(null);

  const role = roles.find((r) => r.id === activeRole)!;

  return (
    <div>
      {/* Role Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => { setActiveRole(r.id); setOpenIdx(null); setShowSample(null); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              activeRole === r.id
                ? `${r.bg} ${r.color} border-current`
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <span>{r.icon}</span> {r.label}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-2">
        {role.questions.map((q, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button
              onClick={() => { setOpenIdx(openIdx === i ? null : i); setShowSample(null); }}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${role.bg} ${role.color}`}>
                  {q.category}
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{q.q}</span>
              </div>
              <ChevronDown className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200 ${openIdx === i ? "rotate-180" : ""}`} />
            </button>

            {openIdx === i && (
              <div className="px-5 pb-5 space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg px-4 py-3">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-300">{q.tip}</p>
                </div>

                <button
                  onClick={() => setShowSample(showSample === i ? null : i)}
                  className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {showSample === i ? "Hide" : "See"} sample answer
                </button>

                {showSample === i && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Sample Answer</p>
                    <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{q.sample}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
