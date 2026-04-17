"use client";

import { useState, useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const DEFAULT_MARKDOWN = `# Welcome to Markdown Preview

## What is Markdown?

Markdown is a lightweight markup language for creating formatted text using a plain-text editor.

### Features

- **Bold text** and *italic text*
- Inline \`code\` and code blocks
- Ordered and unordered lists
- Blockquotes

### Example List

1. First item
2. Second item
3. Third item

### Code Example

\`\`\`
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

### Blockquote

> The best way to predict the future is to invent it.
> — Alan Kay

---

Start editing on the left to see your preview update in real time.
`;

export default function MarkdownPreview() {
  const [markdownText, setMarkdownText] = useState(DEFAULT_MARKDOWN);
  const [copyLabel, setCopyLabel] = useState("Copy HTML");

  const sanitizedHtml = useMemo(() => {
    const html = marked(markdownText) as string;
    // DOMPurify requires a browser DOM — skip sanitization during SSR
    if (typeof window === "undefined") return html;
    return DOMPurify.sanitize(html);
  }, [markdownText]);

  const wordCount = markdownText.trim()
    ? markdownText.trim().split(/\s+/).length
    : 0;

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(sanitizedHtml);
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy HTML"), 2000);
    } catch {
      setCopyLabel("Failed");
      setTimeout(() => setCopyLabel("Copy HTML"), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdownText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Editor panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Markdown Input
            </label>
            <span className="text-xs text-gray-400">
              Supports headings, lists, bold, italic, code, blockquotes
            </span>
          </div>
          <textarea
            value={markdownText}
            onChange={(e) => setMarkdownText(e.target.value)}
            placeholder="Type your markdown here..."
            rows={20}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y leading-relaxed font-mono"
          />
        </div>

        {/* Preview panel */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Preview
          </label>
          <div
            className="w-full min-h-[20rem] border border-gray-200 rounded-xl px-5 py-4 bg-white text-sm text-gray-800 overflow-auto
              [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-3 [&_h1]:mt-4
              [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-800 [&_h2]:mb-2 [&_h2]:mt-4
              [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mb-2 [&_h3]:mt-3
              [&_p]:mb-3 [&_p]:leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1
              [&_li]:leading-relaxed
              [&_code]:font-mono [&_code]:bg-gray-100 [&_code]:text-gray-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs
              [&_pre]:bg-gray-100 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:mb-3
              [&_pre_code]:bg-transparent [&_pre_code]:p-0
              [&_blockquote]:border-l-4 [&_blockquote]:border-blue-300 [&_blockquote]:pl-4 [&_blockquote]:text-gray-600 [&_blockquote]:italic [&_blockquote]:mb-3
              [&_hr]:border-gray-200 [&_hr]:my-4
              [&_strong]:font-semibold [&_strong]:text-gray-900
              [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        </div>
      </div>

      {/* Footer bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        <span className="text-sm text-gray-500">
          {wordCount} word{wordCount !== 1 ? "s" : ""}
        </span>

        <div className="flex gap-3">
          <button
            onClick={handleCopyHtml}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            {copyLabel}
          </button>
          <button
            onClick={handleDownload}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Download .md
          </button>
        </div>
      </div>
    </div>
  );
}
