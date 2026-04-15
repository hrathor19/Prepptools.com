"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

async function hash(algo: string, text: string): Promise<string> {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const ALGOS = [
  { label: "SHA-1", algo: "SHA-1" },
  { label: "SHA-256", algo: "SHA-256" },
  { label: "SHA-512", algo: "SHA-512" },
];

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!input) {
      setHashes({});
      return;
    }
    let cancelled = false;
    async function compute() {
      const results: Record<string, string> = {};
      for (const { label, algo } of ALGOS) {
        try {
          results[label] = await hash(algo, input);
        } catch {
          results[label] = "Error computing hash";
        }
      }
      if (!cancelled) setHashes(results);
    }
    compute();
    return () => {
      cancelled = true;
    };
  }, [input]);

  function copyHash(label: string) {
    const h = hashes[label];
    if (!h) return;
    navigator.clipboard.writeText(h);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Input Text
        </label>
        <textarea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to hash…"
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full font-mono"
        />
      </div>

      {/* Hash results */}
      {input && (
        <div className="space-y-3">
          {ALGOS.map(({ label }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-700">{label}</span>
                <button
                  onClick={() => copyHash(label)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  {copied === label ? <Check size={13} /> : <Copy size={13} />}
                  {copied === label ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-sm break-all">
                {hashes[label] || (
                  <span className="text-gray-500 animate-pulse">Computing…</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!input && (
        <div className="text-center text-gray-400 text-sm py-10 border-2 border-dashed border-gray-200 rounded-xl">
          Start typing to see SHA hashes
        </div>
      )}
    </div>
  );
}
