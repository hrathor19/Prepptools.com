"use client";

import { useState } from "react";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function TextToSlug() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const slug = toSlug(input);

  function handleCopy() {
    navigator.clipboard.writeText(slug).then(() => {
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
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. My Awesome Blog Post Title!"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {input && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1 font-medium">Live Preview</p>
          <p className="text-sm text-blue-800 font-mono break-all">
            {slug || <span className="text-gray-400 italic">slug will appear here</span>}
          </p>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">
          Generated Slug
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            readOnly
            value={slug}
            placeholder="slug will appear here…"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 font-mono"
          />
          <button
            onClick={handleCopy}
            disabled={!slug}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {slug && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-gray-700">
          <span className="font-medium">URL-safe slug:</span>{" "}
          <span className="font-mono text-green-800 break-all">{slug}</span>
        </div>
      )}
    </div>
  );
}
