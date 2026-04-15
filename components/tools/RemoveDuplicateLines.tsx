"use client";

import { useState } from "react";

export default function RemoveDuplicateLines() {
  const [input, setInput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [result, setResult] = useState("");
  const [removedCount, setRemovedCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  function handleRemove() {
    const lines = input.split("\n");
    const seen = new Set<string>();
    const unique: string[] = [];

    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(line);
      }
    }

    const removed = lines.length - unique.length;
    setResult(unique.join("\n"));
    setRemovedCount(removed);
  }

  function handleCopy() {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">
          Input Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste lines here — duplicates will be removed…"
          rows={10}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">Case-sensitive</span>
        </label>
      </div>

      <button
        onClick={handleRemove}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
      >
        Remove Duplicates
      </button>

      {result !== "" && removedCount !== null && (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Result</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  {removedCount} duplicate{removedCount !== 1 ? "s" : ""} removed
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={result}
              rows={10}
              className="w-full bg-transparent text-sm text-gray-800 resize-y focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
