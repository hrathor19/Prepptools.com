"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import { downloadBlob } from "./shared/DownloadButton";
import { Loader2, Download, Info } from "lucide-react";

function textToRtf(text: string): string {
  // Escape RTF special chars
  const escaped = text
    .replace(/\\/g, "\\\\")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\r?\n/g, "\\par\n");

  return (
    "{\\rtf1\\ansi\\deff0\n" +
    "{\\fonttbl{\\f0\\froman\\fcharset0 Times New Roman;}}\n" +
    "\\f0\\fs24\\sl360\\slmult1\n" +
    escaped +
    "\n}"
  );
}

export default function PDFToWord() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<Blob | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState("");

  async function convert() {
    if (!files[0]) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const buffer = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
      const total = pdf.numPages;
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
        if (pageText) parts.push(pageText);
        setProgress({ current: i, total });
      }

      const fullText = parts.join("\n\n");
      setWordCount(fullText.split(/\s+/).filter(Boolean).length);

      const rtf = textToRtf(fullText);
      const blob = new Blob([rtf], { type: "application/rtf" });
      setResult(blob);
    } catch (e) {
      console.error(e);
      setError("Could not extract content from this PDF. It may be scanned or image-based.");
    } finally {
      setProcessing(false);
    }
  }

  const outName = (files[0]?.name ?? "document").replace(/\.pdf$/i, "") + ".rtf";

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="flex gap-3 bg-sky-50 border border-sky-200 rounded-xl px-4 py-3">
        <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
        <p className="text-xs text-sky-700 leading-relaxed">
          This tool extracts text from selectable PDFs and exports an <strong>.rtf</strong> file that
          opens in Microsoft Word, LibreOffice, and Google Docs. Scanned / image-based PDFs
          are not supported (text layer required).
        </p>
      </div>

      <FileDropZone
        accept="application/pdf,.pdf"
        multiple={false}
        files={files}
        onFiles={(f) => { setFiles(f); setResult(null); setError(""); }}
        label="Click or drag a PDF here"
        hint="PDF must have a selectable text layer"
        maxSizeMB={50}
      />

      {files.length > 0 && !result && (
        <button
          onClick={convert}
          disabled={processing}
          className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
        >
          {processing && <Loader2 className="w-5 h-5 animate-spin" />}
          {processing
            ? progress.total > 0
              ? `Converting page ${progress.current} of ${progress.total}…`
              : "Loading…"
            : "Convert to Word"}
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

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-green-800">Word file ready!</p>
            <p className="text-xs text-green-600 mt-0.5">
              {wordCount.toLocaleString()} words extracted — opens in Word, LibreOffice &amp; Google Docs
            </p>
          </div>
          <button
            onClick={() => downloadBlob(result, outName)}
            className="flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-sky-700 transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Download .rtf
          </button>
        </div>
      )}
    </div>
  );
}
