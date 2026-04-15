"use client";

import { useState, useMemo } from "react";

type Option = "extraSpaces" | "blankLines" | "trimLines";

export default function RemoveExtraSpaces() {
  const [input, setInput] = useState("");
  const [active, setActive] = useState<Set<Option>>(new Set(["extraSpaces"]));
  const [copied, setCopied] = useState(false);

  function toggleOption(opt: Option) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(opt)) {
        next.delete(opt);
      } else {
        next.add(opt);
      }
      return next;
    });
  }

  const result = useMemo(() => {
    let lines = input.split("\n");

    if (active.has("trimLines")) {
      lines = lines.map((l) => l.trim());
    }

    if (active.has("extraSpaces")) {
      lines = lines.map((l) => l.replace(/ {2,}/g, " "));
    }

    if (active.has("blankLines")) {
      lines = lines.filter((l) => l.trim() !== "");
    }

    return lines.join("\n");
  }, [input, active]);

  function handleCopy() {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const options: { key: Option; label: string; desc: string }[] = [
    { key: "extraSpaces", label: "Extra Spaces", desc: "Collapse multiple spaces" },
    { key: "blankLines", label: "Blank Lines", desc: "Remove empty lines" },
    { key: "trimLines", label: "Trim Lines", desc: "Strip leading/trailing whitespace" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">
          Input Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your text here…"
          rows={8}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Cleanup Options</p>
        <div className="flex flex-wrap gap-3">
          {options.map(({ key, label, desc }) => (
            <button
              key={key}
              onClick={() => toggleOption(key)}
              title={desc}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                active.has(key)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 text-sm text-gray-500">
        <span>
          Before: <strong className="text-gray-700">{input.length}</strong> chars
        </span>
        <span>
          After: <strong className="text-gray-700">{result.length}</strong> chars
        </span>
        {input.length > result.length && (
          <span className="text-green-600 font-medium">
            -{input.length - result.length} saved
          </span>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Result (live)</span>
          <button
            onClick={handleCopy}
            disabled={!result}
            className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-40"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <textarea
          readOnly
          value={result}
          rows={8}
          className="w-full bg-transparent text-sm text-gray-800 resize-y focus:outline-none"
        />
      </div>
    </div>
  );
}
