"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2, Plus, Trash2 } from "lucide-react";

type TextEntry = {
  id: number;
  page: number;
  x: number;
  y: number;
  text: string;
  size: number;
  color: "black" | "red" | "blue" | "green";
};

const colorMap = {
  black: { r: 0, g: 0, b: 0 },
  red:   { r: 0.8, g: 0.1, b: 0.1 },
  blue:  { r: 0.1, g: 0.2, b: 0.8 },
  green: { r: 0.1, g: 0.5, b: 0.1 },
};

let nextId = 1;

export default function EditPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [entries, setEntries] = useState<TextEntry[]>([]);
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(f: File[]) {
    setFiles(f);
    setResult(null);
    setEntries([]);
    setPageCount(0);
    if (!f[0]) return;
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
      addEntry(1);
    } catch { /* ignore */ }
  }

  function addEntry(page = 1) {
    setEntries((prev) => [
      ...prev,
      { id: nextId++, page, x: 50, y: 50, text: "", size: 12, color: "black" },
    ]);
  }

  function updateEntry(id: number, patch: Partial<TextEntry>) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    setResult(null);
  }

  function removeEntry(id: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setResult(null);
  }

  async function apply() {
    if (!files[0] || entries.length === 0) return;
    const valid = entries.filter((e) => e.text.trim());
    if (valid.length === 0) { setError("Please enter text in at least one text box."); return; }

    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();

      valid.forEach((entry) => {
        const page = pages[Math.min(entry.page - 1, pages.length - 1)];
        const { width, height } = page.getSize();
        // x,y as percentage of page dimensions → convert to points
        const x = (entry.x / 100) * width;
        const y = (entry.y / 100) * height;
        const { r, g, b } = colorMap[entry.color];
        page.drawText(entry.text, { x, y, size: entry.size, font, color: rgb(r, g, b) });
      });

      const out = await doc.save();
      setResult(new Blob([out as Uint8Array<ArrayBuffer>], { type: "application/pdf" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to edit the PDF.");
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
        hint="Add text on top of any page"
      />

      {files[0] && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Text Entries</p>
            <button
              onClick={() => addEntry(1)}
              className="flex items-center gap-1.5 text-sm bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Text
            </button>
          </div>

          {/* Coordinate hint */}
          <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2">
            X / Y positions are percentages of the page (0% = left/bottom, 100% = right/top in PDF coordinates).
            For most text, Y between 10–90% works well.
          </p>

          <div className="space-y-3">
            {entries.map((entry, idx) => (
              <div key={entry.id} className="border border-gray-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Text #{idx + 1}</span>
                  <button onClick={() => removeEntry(entry.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Text input */}
                <input
                  type="text"
                  value={entry.text}
                  onChange={(e) => updateEntry(entry.id, { text: e.target.value })}
                  placeholder="Enter text to add…"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {/* Page */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Page</label>
                    <input type="number" min={1} max={pageCount || 1} value={entry.page}
                      onChange={(e) => updateEntry(entry.id, { page: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400" />
                  </div>
                  {/* X */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">X %</label>
                    <input type="number" min={0} max={100} value={entry.x}
                      onChange={(e) => updateEntry(entry.id, { x: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400" />
                  </div>
                  {/* Y */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Y %</label>
                    <input type="number" min={0} max={100} value={entry.y}
                      onChange={(e) => updateEntry(entry.id, { y: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400" />
                  </div>
                  {/* Font size */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Size (pt)</label>
                    <input type="number" min={6} max={72} value={entry.size}
                      onChange={(e) => updateEntry(entry.id, { size: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400" />
                  </div>
                  {/* Color */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Color</label>
                    <select value={entry.color} onChange={(e) => updateEntry(entry.id, { color: e.target.value as TextEntry["color"] })}
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400">
                      <option value="black">Black</option>
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {entries.length > 0 && (
            <button onClick={apply} disabled={processing}
              className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors">
              {processing && <Loader2 className="w-5 h-5 animate-spin" />}
              {processing ? "Applying…" : "Apply & Download"}
            </button>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
          <p className="flex-1 text-sm font-semibold text-green-800">Text added successfully!</p>
          <DownloadButton blob={result} filename={`${baseName}-edited.pdf`} label="Download PDF" />
        </div>
      )}
    </div>
  );
}
