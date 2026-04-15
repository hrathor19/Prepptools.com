"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2 } from "lucide-react";

export default function GrayscalePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [scale, setScale] = useState(1.5);
  const [result, setResult] = useState<Blob | null>(null);
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

      const { PDFDocument } = await import("pdf-lib");

      const buffer = await files[0].arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
      const total = pdfDoc.numPages;
      setProgress({ current: 0, total });

      const outDoc = await PDFDocument.create();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      for (let i = 1; i <= total; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render page to canvas (color)
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;

        // Convert to grayscale using imageData pixel manipulation
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let p = 0; p < data.length; p += 4) {
          // Luminance formula (human perception weighted)
          const gray = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
          data[p] = data[p + 1] = data[p + 2] = gray;
        }
        ctx.putImageData(imageData, 0, 0);

        // Export as JPEG and embed into output PDF
        const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.92);
        const jpegBytes = await fetch(jpegDataUrl).then((r) => r.arrayBuffer());
        const img = await outDoc.embedJpg(jpegBytes);

        const pdfPage = outDoc.addPage([viewport.width, viewport.height]);
        pdfPage.drawImage(img, { x: 0, y: 0, width: viewport.width, height: viewport.height });

        setProgress({ current: i, total });
      }

      const out = await outDoc.save();
      setResult(new Blob([out as Uint8Array<ArrayBuffer>], { type: "application/pdf" }));
    } catch (e) {
      console.error(e);
      setError("Conversion failed. The PDF may be corrupted or too large.");
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
        onFiles={(f) => { setFiles(f); setResult(null); setError(""); }}
        label="Click or drag a PDF here"
        hint="Each page is rendered and converted to black & white"
        maxSizeMB={50}
      />

      {files[0] && !result && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Quality / Resolution: <span className="text-orange-600 font-bold">
                {scale === 1 ? "Draft" : scale === 1.5 ? "Standard" : scale === 2 ? "High" : "Very High"}
              </span>
            </label>
            <input type="range" min={1} max={3} step={0.5} value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full accent-orange-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Draft (fast)</span>
              <span>Very High (slow)</span>
            </div>
          </div>

          <button
            onClick={convert}
            disabled={processing}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors"
          >
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing
              ? progress.total > 0
                ? `Converting page ${progress.current} of ${progress.total}…`
                : "Loading…"
              : "Convert to Grayscale"}
          </button>
        </div>
      )}

      {processing && progress.total > 0 && (
        <div className="space-y-1">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">{progress.current} / {progress.total} pages rendered</p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800">Grayscale PDF ready!</p>
            <p className="text-xs text-green-600 mt-0.5">{progress.total} page{progress.total !== 1 ? "s" : ""} converted</p>
          </div>
          <DownloadButton blob={result} filename={`${baseName}-grayscale.pdf`} label="Download PDF" />
        </div>
      )}
    </div>
  );
}
