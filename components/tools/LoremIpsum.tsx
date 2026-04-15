"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const LOREM_WORDS = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do",
  "eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim",
  "ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi",
  "aliquip","ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit",
  "voluptate","velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint",
  "occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt",
  "mollit","anim","id","est","laborum","praesent","interdum","dictum","mi","leo",
  "neque","diam","sagittis","iaculis","ornare","mauris","volutpat","convallis",
];

function randomSentence(wordCount: number): string {
  const words = Array.from({ length: wordCount }, () =>
    LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
  );
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraphs(count: number): string {
  return Array.from({ length: count }, () => {
    const sentenceCount = Math.floor(Math.random() * 4) + 3;
    return Array.from({ length: sentenceCount }, () =>
      randomSentence(Math.floor(Math.random() * 10) + 8)
    ).join(" ");
  }).join("\n\n");
}

export default function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(2);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    setOutput(generateParagraphs(paragraphs));
  }

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Paragraphs:</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setParagraphs((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold text-lg leading-none"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold text-gray-800">
              {paragraphs}
            </span>
            <button
              onClick={() => setParagraphs((p) => Math.min(10, p + 1))}
              className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold text-lg leading-none"
            >
              +
            </button>
          </div>
        </div>
        <button
          onClick={generate}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Generate
        </button>
      </div>

      {output && (
        <div className="relative">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {output}
          </div>
          <button
            onClick={copyOutput}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-colors"
            title="Copy"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}

      {!output && (
        <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-sm">Click &quot;Generate&quot; to create Lorem Ipsum text</p>
        </div>
      )}
    </div>
  );
}
