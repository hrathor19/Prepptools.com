"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import { downloadBlob } from "./shared/DownloadButton";
import { Loader2, Copy, Download, Check } from "lucide-react";

export default function PDFToText() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function extract() {
    if (!files[0]) return;
    setProcessing(true);
    setError("");
    setText("");
    setPageCount(0);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const buffer = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
      const total = pdf.numPages;
      setPageCount(total);
      setProgress({ current: 0, total });

      const parts: string[] = [];
      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => item.str)
          .join(" ")
          .replace(/ {2,}/g, " ")
          .trim();
        if (pageText) parts.push(`--- Page ${i} ---\n${pageText}`);
        setProgress({ current: i, total });
      }

      setText(parts.join("\n\n"));
    } catch (e) {
      console.error(e);
      setError("Could not extract text from this PDF. The file may be scanned or image-based.");
    } finally {
      setProcessing(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const blob = new Blob([text], { type: "text/plain" });
    const name = (files[0]?.name ?? "document").replace(/\.pdf$/i, "") + ".txt";
    downloadBlob(blob, name);
  }

  return (
    <div className="space-y-6">
      <FileDropZone
        accept="application/pdf,.pdf"
        multiple={false}
        files={files}
        onFiles={(f) => { setFiles(f); setText(""); setError(""); }}
        label="Click or drag a PDF here"
        hint="Text will be extracted from all pages"
        maxSizeMB={50}
      />

      {files.length > 0 && !text && (
        <button
          onClick={extract}
          disabled={processing}
          className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
        >
          {processing && <Loader2 className="w-5 h-5 animate-spin" />}
          {processing
            ? progress.total > 0
              ? `Extracting page ${progress.current} of ${progress.total}…`
              : "Loading PDF…"
            : "Extract Text"}
        </button>
      )}

      {processing && progress.total > 0 && (
        <div className="space-y-1">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">{progress.current} / {progress.total} pages</p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {text && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {pageCount} page{pageCount !== 1 ? "s" : ""} — {text.split(/\s+/).filter(Boolean).length.toLocaleString()} words
            </p>
            <div className="flex gap-2">
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:border-sky-400 hover:text-sky-600 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={download}
                className="flex items-center gap-1.5 text-sm bg-sky-600 text-white px-3 py-1.5 rounded-lg hover:bg-sky-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download .txt
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={text}
            rows={16}
            className="w-full border border-gray-200 rounded-2xl p-4 text-sm text-gray-700 font-mono bg-gray-50 resize-y focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
