"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2, X, Check } from "lucide-react";

export default function RemovePDFPages() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(f: File[]) {
    setFiles(f);
    setResult(null);
    setSelected(new Set());
    setPageCount(0);
    if (!f[0]) return;
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setPageCount(doc.getPageCount());
    } catch {
      setError("Cannot read this PDF. It may be password-protected.");
    }
  }

  function togglePage(page: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
    setResult(null);
  }

  async function remove() {
    if (!files[0] || selected.size === 0) {
      setError("Please select at least one page to remove.");
      return;
    }
    if (selected.size >= pageCount) {
      setError("You cannot remove all pages — at least one must remain.");
      return;
    }
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      // Remove in reverse order to preserve indices
      const toRemove = Array.from(selected).sort((a, b) => b - a);
      toRemove.forEach((pageIndex) => doc.removePage(pageIndex));

      const pdfBytes = await doc.save();
      setResult(new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to remove pages.");
    } finally {
      setProcessing(false);
    }
  }

  const baseName = files[0]?.name.replace(/\.pdf$/i, "") ?? "document";

  return (
    <div className="space-y-6">
      <FileDropZone
        accept="application/pdf"
        files={files}
        onFiles={handleFile}
        label="Click or drag a PDF here"
      />

      {files[0] && pageCount > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Select pages to <span className="text-red-600 font-semibold">remove</span>
              {selected.size > 0 && <span className="ml-2 text-red-500">({selected.size} selected)</span>}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setSelected(new Set(Array.from({ length: pageCount }, (_, i) => i)))}
                className="text-xs text-gray-500 hover:text-red-600 transition-colors border border-gray-200 rounded-lg px-2.5 py-1">
                Select all
              </button>
              <button onClick={() => setSelected(new Set())}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors border border-gray-200 rounded-lg px-2.5 py-1">
                Clear
              </button>
            </div>
          </div>

          {/* Page grid */}
          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                onClick={() => togglePage(i)}
                className={`aspect-square flex items-center justify-center rounded-lg border-2 text-xs font-semibold transition-all ${
                  selected.has(i)
                    ? "bg-red-500 border-red-600 text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500"
                }`}
              >
                {selected.has(i) ? <X className="w-3 h-3" /> : i + 1}
              </button>
            ))}
          </div>

          {selected.size > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-sm text-red-700">
                Will remove pages: <span className="font-semibold">
                  {Array.from(selected).sort((a, b) => a - b).map((p) => p + 1).join(", ")}
                </span>
                <br />
                <span className="text-xs text-red-500">
                  {pageCount - selected.size} pages will remain.
                </span>
              </p>
            </div>
          )}

          <button onClick={remove} disabled={processing || selected.size === 0}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-60 transition-colors">
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing ? "Processing…" : `Remove ${selected.size} Page${selected.size !== 1 ? "s" : ""}`}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800">
              <Check className="inline w-4 h-4 mr-1" />
              Pages removed successfully!
            </p>
            <p className="text-xs text-green-600 mt-0.5">
              {pageCount - selected.size} pages remaining
            </p>
          </div>
          <DownloadButton blob={result} filename={`${baseName}-cleaned.pdf`} label="Download PDF" />
        </div>
      )}
    </div>
  );
}
