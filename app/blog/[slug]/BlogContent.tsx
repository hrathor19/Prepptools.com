"use client";

// Lightweight markdown renderer — no external deps
function renderMarkdown(md: string): string {
  let html = md
    // Escape HTML first
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks (``` ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, _lang, code) => {
    return `<pre><code>${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Tables
  html = html.replace(/^\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/gm, (_, header, rows) => {
    const th = header.split("|").filter(Boolean).map((c: string) => `<th>${c.trim()}</th>`).join("");
    const trs = rows.trim().split("\n").map((row: string) => {
      const tds = row.split("|").filter(Boolean).map((c: string) => `<td>${c.trim()}</td>`).join("");
      return `<tr>${tds}</tr>`;
    }).join("");
    return `<table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`;
  });

  // Headings
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold & italic
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Blockquote
  html = html.replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>");

  // Unordered list items
  html = html.replace(/^[-*] (.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");

  // Ordered list items
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Horizontal rule
  html = html.replace(/^---$/gm, "<hr />");

  // Paragraphs — wrap lines not already in a tag
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (/^<(h[1-6]|ul|ol|li|pre|blockquote|table|hr)/.test(trimmed)) return trimmed;
      return `<p>${trimmed.replace(/\n/g, " ")}</p>`;
    })
    .join("\n");

  return html;
}

export default function BlogContent({ content }: { content: string }) {
  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}
