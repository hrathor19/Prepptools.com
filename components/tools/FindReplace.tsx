"use client";

import { useState } from "react";

export default function FindReplace() {
  const [mainText, setMainText] = useState("");
  const [findTerm, setFindTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [result, setResult] = useState("");
  const [replacementCount, setReplacementCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  function handleReplaceAll() {
    if (!findTerm) return;

    let count = 0;
    const flags = caseSensitive ? "g" : "gi";
    const escaped = findTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, flags);

    const output = mainText.replace(regex, () => {
      count++;
      return replaceTerm;
    });

    setResult(output);
    setReplacementCount(count);
  }

  function handleSwap() {
    setFindTerm(replaceTerm);
    setReplaceTerm(findTerm);
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
          Main Text
        </label>
        <textarea
          value={mainText}
          onChange={(e) => setMainText(e.target.value)}
          placeholder="Paste your text here…"
          rows={8}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Find
          </label>
          <input
            type="text"
            value={findTerm}
            onChange={(e) => setFindTerm(e.target.value)}
            placeholder="Text to find…"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Replace With
          </label>
          <input
            type="text"
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
            placeholder="Replacement text…"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">Case-sensitive</span>
        </label>

        <button
          onClick={handleSwap}
          className="text-sm border border-gray-300 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors font-medium"
        >
          ⇄ Swap Find / Replace
        </button>
      </div>

      <button
        onClick={handleReplaceAll}
        disabled={!findTerm || !mainText}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Replace All
      </button>

      {result !== "" && replacementCount !== null && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Result</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">
                {replacementCount} replacement{replacementCount !== 1 ? "s" : ""} made
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
            rows={8}
            className="w-full bg-transparent text-sm text-gray-800 resize-y focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
