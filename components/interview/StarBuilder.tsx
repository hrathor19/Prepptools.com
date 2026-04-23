"use client";

import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";

export default function StarBuilder() {
  const [situation, setSituation] = useState("");
  const [task, setTask]           = useState("");
  const [action, setAction]       = useState("");
  const [result, setResult]       = useState("");
  const [copied, setCopied]       = useState(false);

  const isReady = situation.trim() && task.trim() && action.trim() && result.trim();

  const answer = isReady
    ? `**Situation:** ${situation.trim()}\n\n**Task:** ${task.trim()}\n\n**Action:** ${action.trim()}\n\n**Result:** ${result.trim()}`
    : "";

  const plainAnswer = isReady
    ? `Situation: ${situation.trim()}\n\nTask: ${task.trim()}\n\nAction: ${action.trim()}\n\nResult: ${result.trim()}`
    : "";

  function copy() {
    navigator.clipboard.writeText(plainAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const fields = [
    { key: "S", label: "Situation", placeholder: "Set the context. What was the background? What was the challenge or problem you faced?", value: situation, set: setSituation, color: "border-blue-400 dark:border-blue-500", badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" },
    { key: "T", label: "Task", placeholder: "What was your responsibility? What were you trying to achieve or solve?", value: task, set: setTask, color: "border-purple-400 dark:border-purple-500", badge: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" },
    { key: "A", label: "Action", placeholder: "What specific steps did YOU take? Be precise — avoid 'we'. This is the most important part.", value: action, set: setAction, color: "border-amber-400 dark:border-amber-500", badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" },
    { key: "R", label: "Result", placeholder: "What was the outcome? Quantify it if possible — numbers, percentages, time saved, revenue generated.", value: result, set: setResult, color: "border-green-400 dark:border-green-500", badge: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
  ] as const;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">Use the STAR method to structure any behavioural interview answer. Fill in each section and get a ready-to-use answer.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${f.badge}`}>{f.key}</span>
              {f.label}
            </label>
            <textarea
              rows={4}
              placeholder={f.placeholder}
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className={`w-full border-2 ${f.color} bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none resize-none`}
            />
          </div>
        ))}
      </div>

      {isReady && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Your STAR Answer</p>
            </div>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {[
              { label: "Situation", value: situation, color: "text-blue-600 dark:text-blue-400" },
              { label: "Task",      value: task,      color: "text-purple-600 dark:text-purple-400" },
              { label: "Action",    value: action,    color: "text-amber-600 dark:text-amber-400" },
              { label: "Result",    value: result,    color: "text-green-600 dark:text-green-400" },
            ].map((s) => (
              <p key={s.label}>
                <span className={`font-semibold ${s.color}`}>{s.label}: </span>
                {s.value}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
