"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2, RotateCw } from "lucide-react";

type Angle = 90 | 180 | 270;
type Target = "all" | "even" | "odd" | "custom";

export default function RotatePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [angle, setAngle] = useState<Angle>(90);
  const [target, setTarget] = useState<Target>("all");
  const [customPages, setCustomPages] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(f: File[]) {
    setFiles(f);
    setResult(null);
    setPageCount(0);
    if (!f[0]) return;
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setPageCount(doc.getPageCount());
    } catch {
      setError("Cannot read this PDF.");
    }
  }

  function parsePages(input: string, total: number): number[] {
    const pages: Set<number> = new Set();
    input.split(",").forEach((part) => {
      const t = part.trim();
      if (t.includes("-")) {
        const [s, e] = t.split("-").map(Number);
        for (let i = s; i <= Math.min(e, total); i++) if (i >= 1) pages.add(i - 1); // 0-indexed
      } else {
        const n = Number(t);
        if (n >= 1 && n <= total) pages.add(n - 1);
      }
    });
    return Array.from(pages);
  }

  async function rotate() {
    if (!files[0]) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = doc.getPages();
      const total = pages.length;

      let indices: number[] = [];
      if (target === "all") indices = pages.map((_, i) => i);
      else if (target === "even") indices = pages.map((_, i) => i).filter((i) => (i + 1) % 2 === 0);
      else if (target === "odd") indices = pages.map((_, i) => i).filter((i) => (i + 1) % 2 !== 0);
      else indices = parsePages(customPages, total);

      indices.forEach((i) => {
        const page = pages[i];
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + angle) % 360));
      });

      const pdfBytes = await doc.save();
      setResult(new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Rotation failed.");
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
          <p className="text-sm text-gray-500">
            Document: <span className="font-semibold text-gray-700">{pageCount} pages</span>
          </p>

          {/* Rotation angle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rotation Angle</label>
            <div className="flex gap-2">
              {([90, 180, 270] as Angle[]).map((a) => (
                <button key={a} onClick={() => setAngle(a)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                    angle === a ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                  }`}>
                  <RotateCw className="w-4 h-4" style={{ transform: `rotate(${a - 90}deg)` }} />
                  {a}° CW
                </button>
              ))}
            </div>
          </div>

          {/* Which pages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Apply to</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { id: "all", label: "All pages" },
                { id: "odd", label: "Odd pages" },
                { id: "even", label: "Even pages" },
                { id: "custom", label: "Custom range" },
              ] as const).map((t) => (
                <button key={t.id} onClick={() => setTarget(t.id)}
                  className={`px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
                    target === t.id ? "bg-orange-50 border-orange-400 text-orange-700" : "bg-white border-gray-200 text-gray-600 hover:border-orange-200"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {target === "custom" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Page numbers</label>
              <input type="text" value={customPages} onChange={(e) => setCustomPages(e.target.value)}
                placeholder={`e.g. 1, 3-5, ${pageCount}`}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          )}

          <button onClick={rotate} disabled={processing}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors">
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing ? "Rotating…" : `Rotate ${angle}°`}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
          <p className="flex-1 text-sm font-semibold text-green-800">Rotation applied successfully!</p>
          <DownloadButton blob={result} filename={`${baseName}-rotated.pdf`} label="Download PDF" />
        </div>
      )}
    </div>
  );
}
