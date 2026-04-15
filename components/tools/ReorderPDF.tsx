"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2, ChevronUp, ChevronDown, RotateCcw } from "lucide-react";

export default function ReorderPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [order, setOrder] = useState<number[]>([]);   // 1-based page numbers
  const [customInput, setCustomInput] = useState("");
  const [customError, setCustomError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(f: File[]) {
    setFiles(f);
    setResult(null);
    setOrder([]);
    setCustomInput("");
    if (!f[0]) return;
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const n = doc.getPageCount();
      setOrder(Array.from({ length: n }, (_, i) => i + 1));
    } catch {
      setError("Cannot read this PDF.");
    }
  }

  function move(idx: number, dir: -1 | 1) {
    const newOrder = [...order];
    const swap = idx + dir;
    if (swap < 0 || swap >= newOrder.length) return;
    [newOrder[idx], newOrder[swap]] = [newOrder[swap], newOrder[idx]];
    setOrder(newOrder);
    setResult(null);
  }

  function applyCustomOrder() {
    setCustomError("");
    const parts = customInput.split(",").map((s) => s.trim()).filter(Boolean);
    const parsed = parts.map(Number);
    if (parsed.some((n) => isNaN(n) || n < 1 || n > order.length)) {
      setCustomError(`Enter valid page numbers between 1 and ${order.length}, comma-separated.`);
      return;
    }
    setOrder(parsed);
    setResult(null);
  }

  function reset() {
    setOrder(Array.from({ length: order.length }, (_, i) => i + 1));
    setResult(null);
  }

  async function reorder() {
    if (!files[0] || order.length === 0) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await files[0].arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const out = await PDFDocument.create();

      // 0-based indices in the new order
      const indices = order.map((n) => n - 1);
      const copied = await out.copyPages(src, indices);
      copied.forEach((p) => out.addPage(p));

      const pdfBytes = await out.save();
      setResult(new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reorder pages.");
    } finally {
      setProcessing(false);
    }
  }

  const baseName = files[0]?.name.replace(/\.pdf$/i, "") ?? "document";

  return (
    <div className="space-y-6">
      <FileDropZone
        accept="application/pdf,.pdf"
        files={files}
        onFiles={handleFile}
        label="Click or drag a PDF here"
      />

      {order.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">{order.length} pages</p>
            <button onClick={reset} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />Reset
            </button>
          </div>

          {/* Page list */}
          <ul className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {order.map((pageNum, idx) => (
              <li key={idx}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center font-bold shrink-0">
                  {idx + 1}
                </span>
                <span className="flex-1 text-sm text-gray-700">Page {pageNum}</span>
                <div className="flex gap-1">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0}
                    className="p-1 rounded text-gray-400 hover:text-orange-600 disabled:opacity-30 transition-colors">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => move(idx, 1)} disabled={idx === order.length - 1}
                    className="p-1 rounded text-gray-400 hover:text-orange-600 disabled:opacity-30 transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Custom order input */}
          <div className="border border-gray-200 rounded-xl p-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700">Or enter custom order</label>
            <p className="text-xs text-gray-400">Comma-separated page numbers, e.g. <span className="font-mono">3,1,2,4</span></p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={`e.g. ${order.slice(0, 4).reverse().join(",")}`}
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button onClick={applyCustomOrder}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                Apply
              </button>
            </div>
            {customError && <p className="text-xs text-red-500">{customError}</p>}
          </div>

          {/* Current order preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <span className="text-xs text-gray-500">Current order: </span>
            <span className="text-xs font-mono text-gray-800">{order.join(" → ")}</span>
          </div>

          <button onClick={reorder} disabled={processing}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors">
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing ? "Reordering…" : "Save Reordered PDF"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
          <p className="flex-1 text-sm font-semibold text-green-800">Pages reordered successfully!</p>
          <DownloadButton blob={result} filename={`${baseName}-reordered.pdf`} label="Download PDF" />
        </div>
      )}
    </div>
  );
}
