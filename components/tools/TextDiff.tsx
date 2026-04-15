"use client";

import { useState } from "react";
import { diffWords } from "diff";

export default function TextDiff() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [result, setResult] = useState<ReturnType<typeof diffWords> | null>(null);

  const handleCompare = () => {
    const diff = diffWords(original, modified);
    setResult(diff);
  };

  const stats = result
    ? result.reduce(
        (acc, part) => {
          const wordCount = part.value.trim()
            ? part.value.trim().split(/\s+/).length
            : 0;
          if (part.added) acc.added += wordCount;
          else if (part.removed) acc.removed += wordCount;
          return acc;
        },
        { added: 0, removed: 0 }
      )
    : null;

  const identical =
    result !== null && result.every((part) => !part.added && !part.removed);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Original Text
          </label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text here..."
            rows={10}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Modified Text
          </label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified text here..."
            rows={10}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y leading-relaxed"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Compare
        </button>
      </div>

      {result !== null && (
        <div className="space-y-4">
          {identical ? (
            <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">
                Texts are identical
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-4 text-sm">
                <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  {stats?.added ?? 0} word{stats?.added !== 1 ? "s" : ""} added
                </span>
                <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  {stats?.removed ?? 0} word{stats?.removed !== 1 ? "s" : ""}{" "}
                  removed
                </span>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 text-sm leading-relaxed font-mono whitespace-pre-wrap bg-white">
                {result.map((part, i) => {
                  if (part.added) {
                    return (
                      <span
                        key={i}
                        className="bg-green-100 text-green-800 rounded px-0.5"
                      >
                        {part.value}
                      </span>
                    );
                  }
                  if (part.removed) {
                    return (
                      <span
                        key={i}
                        className="bg-red-100 text-red-800 line-through rounded px-0.5"
                      >
                        {part.value}
                      </span>
                    );
                  }
                  return <span key={i}>{part.value}</span>;
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
