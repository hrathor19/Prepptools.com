"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

function encodeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function decodeHTML(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export default function HTMLEntities() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = input
    ? mode === "encode"
      ? encodeHTML(input)
      : decodeHTML(input)
    : "";

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          {mode === "encode" ? "Raw HTML / Text" : "HTML Entities String"}
        </label>
        <textarea
          rows={5}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "encode"
              ? 'Enter text with <tags> & "quotes"…'
              : "Enter string with &lt;entities&gt; to decode…"
          }
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full font-mono"
        />
      </div>

      {/* Copy button */}
      <div className="flex gap-3">
        <button
          onClick={() => setInput("")}
          className="border border-gray-300 text-gray-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
        >
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

      {/* Live Preview */}
      {mode === "decode" && output && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Live Preview
          </label>
          <div
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white min-h-[60px]"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </div>
      )}
    </div>
  );
}
