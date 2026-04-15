"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import { downloadBlob } from "./shared/DownloadButton";
import { Loader2, Download } from "lucide-react";

type Mode = "all" | "range" | "individual";

export default function SplitPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<Mode>("all");
  const [range, setRange] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [results, setResults] = useState<{ blob: Blob; name: string }[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(f: File[]) {
    setFiles(f);
    setResults([]);
    setPageCount(0);
    setError("");
    if (!f[0]) return;

    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setPageCount(doc.getPageCount());
    } catch {
      setError("Could not read this PDF. It may be corrupted or password-protected.");
    }
  }

  function parseRange(input: string, total: number): number[] {
    const pages: Set<number> = new Set();
    const parts = input.split(",");
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes("-")) {
        const [start, end] = trimmed.split("-").map((s) => parseInt(s.trim()));
        for (let i = start; i <= Math.min(end, total); i++) if (i >= 1) pages.add(i);
      } else {
        const n = parseInt(trimmed);
        if (!isNaN(n) && n >= 1 && n <= total) pages.add(n);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  }

  async function split() {
    if (!files[0]) return;
    setProcessing(true);
    setError("");
    setResults([]);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await files[0].arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes);
      const total = srcDoc.getPageCount();
      const baseName = files[0].name.replace(/\.pdf$/i, "");

      const output: { blob: Blob; name: string }[] = [];

      if (mode === "all") {
        for (let i = 0; i < total; i++) {
          const newDoc = await PDFDocument.create();
          const [page] = await newDoc.copyPages(srcDoc, [i]);
          newDoc.addPage(page);
          const pdfBytes = await newDoc.save();
          output.push({
            blob: new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" }),
            name: `${baseName}-page-${i + 1}.pdf`,
          });
        }
      } else if (mode === "individual") {
        // Split every 2 pages as an example of grouping — actually just extract specific page
        for (let i = 0; i < total; i++) {
          const newDoc = await PDFDocument.create();
          const [page] = await newDoc.copyPages(srcDoc, [i]);
          newDoc.addPage(page);
          const pdfBytes = await newDoc.save();
          output.push({
            blob: new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" }),
            name: `${baseName}-page-${i + 1}.pdf`,
          });
        }
      } else {
        // Range mode: extract only selected pages into one PDF
        const selected = parseRange(range, total);
        if (selected.length === 0) {
          setError(`No valid pages found. Enter a range like "1-3, 5, 7-9" (max page: ${total}).`);
          setProcessing(false);
          return;
        }
        const newDoc = await PDFDocument.create();
        const indices = selected.map((p) => p - 1);
        const pages = await newDoc.copyPages(srcDoc, indices);
        pages.forEach((p) => newDoc.addPage(p));
        const pdfBytes = await newDoc.save();
        output.push({
          blob: new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" }),
          name: `${baseName}-pages-${selected[0]}-${selected[selected.length - 1]}.pdf`,
        });
      }

      setResults(output);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Split failed.");
    } finally {
      setProcessing(false);
    }
  }

  function downloadAll() {
    results.forEach((r) => downloadBlob(r.blob, r.name));
  }

  return (
    <div className="space-y-6">
      <FileDropZone
        accept="application/pdf"
        files={files}
        onFiles={handleFile}
        label="Click or drag a PDF here"
        hint="Select one PDF file to split"
      />

      {files[0] && pageCount > 0 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500">
            Document: <span className="font-semibold text-gray-700">{pageCount} pages</span>
          </p>

          {/* Mode selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Split Mode</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                { id: "all", label: "Every page separately", desc: `Saves ${pageCount} individual PDF files` },
                { id: "range", label: "Extract page range", desc: "e.g. pages 1-3, 5, 8-10 into one PDF" },
              ] as const).map((m) => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    mode === m.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-200"
                  }`}>
                  <p className={`text-sm font-semibold ${mode === m.id ? "text-orange-700" : "text-gray-700"}`}>{m.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {mode === "range" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Page Range</label>
              <input
                type="text"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder={`e.g. 1-3, 5, 7-${Math.min(9, pageCount)}`}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-xs text-gray-400 mt-1">Use commas and dashes. Max page: {pageCount}</p>
            </div>
          )}

          <button onClick={split} disabled={processing}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors">
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing ? "Splitting…" : "Split PDF"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">{results.length} file{results.length > 1 ? "s" : ""} ready</p>
            {results.length > 1 && (
              <button onClick={downloadAll}
                className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors border border-orange-200 rounded-lg px-3 py-1.5">
                <Download className="w-4 h-4" />
                Download All
              </button>
            )}
          </div>
          <ul className="space-y-1.5 max-h-64 overflow-y-auto">
            {results.map((r, i) => (
              <li key={i}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 hover:border-green-300 transition-colors">
                <span className="text-sm text-gray-700 flex-1 truncate">{r.name}</span>
                <button onClick={() => downloadBlob(r.blob, r.name)}
                  className="flex items-center gap-1.5 text-xs text-green-600 font-medium hover:text-green-700 shrink-0">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
