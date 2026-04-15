"use client";

import { useState } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  function format() {
    if (!input.trim()) return { output: "", error: "" };
    try {
      const parsed = JSON.parse(input);
      return { output: JSON.stringify(parsed, null, indent), error: "" };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }

  function minify() {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function handleFormat() {
    const { output, error: err } = format();
    if (err) { setError(err); return; }
    setInput(output);
    setError("");
  }

  const { output, error: previewError } = format();

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isValid = input.trim() && !previewError;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">Indent:</label>
          {[2, 4].map((n) => (
            <button key={n} onClick={() => setIndent(n)}
              className={`px-3 py-1 rounded-lg text-sm border transition-colors ${
                indent === n ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200"
              }`}>
              {n} spaces
            </button>
          ))}
        </div>
        <button onClick={handleFormat}
          className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          Format
        </button>
        <button onClick={minify}
          className="bg-white border border-gray-300 text-gray-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Minify
        </button>
        <button onClick={() => { setInput(""); setError(""); }}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors">
          Clear
        </button>
      </div>

      {/* Status */}
      {input.trim() && (
        <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
          previewError ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
        }`}>
          {previewError ? (
            <><AlertCircle className="w-4 h-4" /><span>Invalid JSON: {previewError}</span></>
          ) : (
            <><Check className="w-4 h-4" /><span>Valid JSON</span></>
          )}
        </div>
      )}

      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          placeholder={`Paste your JSON here…\n\nExample:\n{"name":"Himanshu","age":28,"active":true}`}
          rows={16}
          spellCheck={false}
          className="w-full border border-gray-300 rounded-xl p-4 pr-12 text-sm font-mono text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y bg-gray-50"
        />
        {isValid && (
          <button onClick={copyOutput}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
            title="Copy formatted JSON">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
