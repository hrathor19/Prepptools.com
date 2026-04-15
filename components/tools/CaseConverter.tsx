"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

type Mode =
  | "uppercase"
  | "lowercase"
  | "titlecase"
  | "sentencecase"
  | "camelcase"
  | "snakecase"
  | "kebabcase";

function convert(text: string, mode: Mode): string {
  switch (mode) {
    case "uppercase":
      return text.toUpperCase();
    case "lowercase":
      return text.toLowerCase();
    case "titlecase":
      return text
        .toLowerCase()
        .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
    case "sentencecase":
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
    case "camelcase":
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
    case "snakecase":
      return text
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");
    case "kebabcase":
      return text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
  }
}

const modes: { id: Mode; label: string }[] = [
  { id: "uppercase", label: "UPPERCASE" },
  { id: "lowercase", label: "lowercase" },
  { id: "titlecase", label: "Title Case" },
  { id: "sentencecase", label: "Sentence case" },
  { id: "camelcase", label: "camelCase" },
  { id: "snakecase", label: "snake_case" },
  { id: "kebabcase", label: "kebab-case" },
];

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("uppercase");
  const [copied, setCopied] = useState(false);

  const output = convert(text, mode);

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              mode === m.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here…"
        rows={6}
        className="w-full border border-gray-300 rounded-xl p-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />

      {text && (
        <div className="relative">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 pr-14 text-sm text-gray-800 whitespace-pre-wrap min-h-[80px]">
            {output}
          </div>
          <button
            onClick={copyOutput}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
