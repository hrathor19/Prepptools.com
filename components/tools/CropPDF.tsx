"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2 } from "lucide-react";

export default function CropPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [top, setTop] = useState(0);
  const [bottom, setBottom] = useState(0);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [unit, setUnit] = useState<"mm" | "pt">("mm");
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const toPoints = (v: number) => unit === "mm" ? v * 2.8346 : v;

  async function crop() {
    if (!files[0]) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      doc.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        const l = toPoints(left);
        const r = toPoints(right);
        const t = toPoints(top);
        const b = toPoints(bottom);

        const x = l;
        const y = b;
        const w = Math.max(10, width - l - r);
        const h = Math.max(10, height - t - b);

        page.setCropBox(x, y, w, h);
      });

      const out = await doc.save();
      setResult(new Blob([out as Uint8Array<ArrayBuffer>], { type: "application/pdf" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to crop the PDF.");
    } finally {
      setProcessing(false);
    }
  }

  const baseName = files[0]?.name.replace(/\.pdf$/i, "") ?? "document";
  const numInput = (label: string, val: number, set: (v: number) => void) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label} ({unit})</label>
      <input
        type="number"
        min={0}
        max={200}
        step={unit === "mm" ? 1 : 5}
        value={val}
        onChange={(e) => { set(Number(e.target.value)); setResult(null); }}
        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <FileDropZone
        accept="application/pdf,.pdf"
        files={files}
        onFiles={(f) => { setFiles(f); setResult(null); setError(""); }}
        label="Click or drag a PDF here"
        hint="Crop margins are applied to all pages"
      />

      {files[0] && (
        <div className="space-y-5">
          {/* Unit toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Unit:</span>
            {(["mm", "pt"] as const).map((u) => (
              <button key={u} onClick={() => setUnit(u)}
                className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                  unit === u ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                }`}>{u === "mm" ? "Millimeters" : "Points"}</button>
            ))}
          </div>

          {/* Visual crop preview */}
          <div className="relative bg-gray-50 border border-gray-200 rounded-2xl p-6 flex items-center justify-center">
            <div className="relative w-32 h-44 bg-white border-2 border-gray-300 rounded">
              <div
                className="absolute inset-0 border-2 border-dashed border-orange-400 rounded"
                style={{
                  top: `${Math.min((top / 100) * 100, 40)}%`,
                  bottom: `${Math.min((bottom / 100) * 100, 40)}%`,
                  left: `${Math.min((left / 100) * 100, 40)}%`,
                  right: `${Math.min((right / 100) * 100, 40)}%`,
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-300">PDF</span>
            </div>
            <p className="absolute bottom-2 text-xs text-gray-400">Crop preview (approximate)</p>
          </div>

          {/* Margin inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {numInput("Top", top, setTop)}
            {numInput("Bottom", bottom, setBottom)}
            {numInput("Left", left, setLeft)}
            {numInput("Right", right, setRight)}
          </div>

          <button onClick={crop} disabled={processing}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors">
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing ? "Cropping…" : "Crop PDF"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
          <p className="flex-1 text-sm font-semibold text-green-800">PDF cropped — all pages updated.</p>
          <DownloadButton blob={result} filename={`${baseName}-cropped.pdf`} label="Download PDF" />
        </div>
      )}
    </div>
  );
}
