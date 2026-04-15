"use client";

import { useMemo, useState } from "react";
import { Copy, Check, ArrowDownUp } from "lucide-react";

export default function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      if (mode === "encode") {
        return { output: btoa(unescape(encodeURIComponent(input))), error: "" };
      } else {
        return { output: decodeURIComponent(escape(atob(input))), error: "" };
      }
    } catch {
      return { output: "", error: mode === "encode" ? "Encoding failed." : "Invalid Base64 string." };
    }
  }, [input, mode]);

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function swap() {
    setInput(output);
    setMode((m) => (m === "encode" ? "decode" : "encode"));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex rounded-xl border border-gray-300 overflow-hidden">
          {(["encode", "decode"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors ${
                mode === m ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}>
              {m}
            </button>
          ))}
        </div>
        {output && (
          <button onClick={swap}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors border border-gray-200 rounded-xl px-3 py-2">
            <ArrowDownUp className="w-4 h-4" />
            Swap
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {mode === "encode" ? "Plain Text" : "Base64 String"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "Enter text to encode…" : "Enter Base64 string to decode…"}
          rows={6}
          spellCheck={false}
          className="w-full border border-gray-300 rounded-xl p-4 text-sm font-mono text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {output && !error && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {mode === "encode" ? "Base64 Output" : "Decoded Text"}
          </label>
          <div className="relative">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 pr-12 text-sm font-mono text-gray-800 whitespace-pre-wrap break-all min-h-[80px]">
              {output}
            </div>
            <button onClick={copyOutput}
              className="absolute top-3 right-3 p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-300 transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
