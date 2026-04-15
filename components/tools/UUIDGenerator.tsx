"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

export default function UUIDGenerator() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  function generate() {
    const generated = Array.from({ length: count }, () => {
      const id = crypto.randomUUID();
      return uppercase ? id.toUpperCase() : id.toLowerCase();
    });
    setUuids(generated);
    setCopiedIdx(null);
  }

  function copyOne(idx: number) {
    navigator.clipboard.writeText(uuids[idx]);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  function copyAll() {
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Count (1–20)
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) =>
              setCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))
            }
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-28 font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Version
          </label>
          <div className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-mono text-gray-500 bg-gray-50 w-28">
            v4
          </div>
        </div>

        <div className="flex items-center gap-2 pb-1">
          <button
            onClick={() => setUppercase((p) => !p)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              uppercase ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                uppercase ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-gray-600 font-medium">UPPERCASE</span>
        </div>
      </div>

      {/* Generate button */}
      <div className="flex gap-3">
        <button
          onClick={generate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw size={16} />
          Generate
        </button>
        {uuids.length > 0 && (
          <button
            onClick={copyAll}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
          >
            {copiedAll ? <Check size={15} /> : <Copy size={15} />}
            {copiedAll ? "Copied All!" : "Copy All"}
          </button>
        )}
      </div>

      {/* UUID list */}
      {uuids.length > 0 && (
        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div
              key={i}
              className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-sm flex items-center justify-between gap-4"
            >
              <span className="break-all">{uuid}</span>
              <button
                onClick={() => copyOne(i)}
                className="flex items-center gap-1.5 text-gray-400 hover:text-green-300 transition-colors shrink-0 text-xs"
              >
                {copiedIdx === i ? <Check size={13} /> : <Copy size={13} />}
                {copiedIdx === i ? "Copied" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}

      {uuids.length === 0 && (
        <div className="text-center text-gray-400 text-sm py-10 border-2 border-dashed border-gray-200 rounded-xl">
          Click &quot;Generate&quot; to create UUIDs
        </div>
      )}
    </div>
  );
}
