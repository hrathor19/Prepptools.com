"use client";

import { useState } from "react";
import { Copy, Check, Trash2 } from "lucide-react";

export default function URLEncoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = (() => {
    if (!input) return { output: "", error: "" };
    try {
      if (mode === "encode") {
        return { output: encodeURIComponent(input), error: "" };
      } else {
        return { output: decodeURIComponent(input), error: "" };
      }
    } catch {
      return {
        output: "",
        error:
          mode === "decode"
            ? "Invalid URL-encoded string. Could not decode."
            : "Encoding failed.",
      };
    }
  })();

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function clear() {
    setInput("");
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(["encode", "decode"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setMode(tab);
              setInput("");
            }}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors capitalize ${
              mode === tab
                ? "bg-indigo-600 text-white"
                : "text-gray-500 hover:text-indigo-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {mode === "encode" ? "Text to Encode" : "URL-Encoded String to Decode"}
        </label>
        <textarea
          rows={5}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "encode"
              ? "Enter text to URL-encode…"
              : "Enter URL-encoded string to decode…"
          }
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full font-mono"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={clear}
          className="flex items-center gap-2 border border-gray-300 text-gray-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
        >
          <Trash2 size={15} />
          Clear
        </button>
        <button
          onClick={copyOutput}
          disabled={!output}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied!" : "Copy Result"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      {/* Output */}
      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Result
          </label>
          <textarea
            rows={5}
            readOnly
            value={output}
            className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-sm w-full focus:outline-none resize-y"
          />
        </div>
      )}
    </div>
  );
}
