"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

type Mode = "chars" | "words" | "lines";

function reverse(text: string, mode: Mode): string {
  switch (mode) {
    case "chars":
      return text.split("").reverse().join("");
    case "words":
      return text.split(/(\s+)/).reverse().join("");
    case "lines":
      return text.split("\n").reverse().join("\n");
  }
}

const modes: { id: Mode; label: string; desc: string }[] = [
  { id: "chars", label: "Reverse Characters", desc: "Hello → olleH" },
  { id: "words", label: "Reverse Words", desc: "Hello World → World Hello" },
  { id: "lines", label: "Reverse Lines", desc: "Reverses the order of lines" },
];

export default function TextReverser() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("chars");
  const [copied, setCopied] = useState(false);

  const output = text ? reverse(text, mode) : "";

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`p-3 rounded-xl border text-left transition-colors ${
              mode === m.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200"
            }`}
          >
            <p className={`text-sm font-semibold ${mode === m.id ? "text-blue-700" : "text-gray-700"}`}>
              {m.label}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste text here…"
        rows={6}
        className="w-full border border-gray-300 rounded-xl p-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />

      {output && (
        <div className="relative">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 pr-14 text-sm text-gray-800 whitespace-pre-wrap min-h-[80px]">
            {output}
          </div>
          <button
            onClick={copyOutput}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
