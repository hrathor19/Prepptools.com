"use client";
import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";

function minify(css: string) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>~+])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

function beautify(css: string) {
  let depth = 0;
  const indent = () => "  ".repeat(depth);
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*{\s*/g, " {\n")
    .replace(/;\s*/g, ";\n")
    .replace(/\s*}\s*/g, "\n}\n")
    .split("\n")
    .map(line => {
      line = line.trim();
      if (!line) return "";
      if (line.endsWith("}")) depth = Math.max(0, depth - 1);
      const out = indent() + line;
      if (line.endsWith("{")) depth++;
      return out;
    })
    .filter(Boolean)
    .join("\n")
    .trim();
}

export default function CSSMinifier() {
  const [tab, setTab] = useState<"minify" | "beautify">("minify");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => tab === "minify" ? minify(input) : beautify(input), [input, tab]);
  const saved = input.length > 0 ? Math.round((1 - output.length / input.length) * 100) : 0;

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(["minify", "beautify"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl border text-sm font-semibold capitalize transition-colors ${tab === t ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Input CSS</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={14}
            placeholder="Paste your CSS here…"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
          <p className="text-xs text-gray-400 mt-1">{input.length} chars</p>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-700">Output</label>
            <button onClick={copy} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
              {copied ? <><Check className="w-3.5 h-3.5" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
            </button>
          </div>
          <textarea value={output} readOnly rows={14}
            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none resize-none" />
          <p className="text-xs text-gray-400 mt-1">
            {output.length} chars
            {tab === "minify" && input.length > 0 && saved > 0 && (
              <span className="ml-2 text-green-600 font-medium">↓ {saved}% smaller</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
