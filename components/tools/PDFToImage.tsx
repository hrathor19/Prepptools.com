"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import { downloadBlob } from "./shared/DownloadButton";
import { Loader2, Download, Image as ImageIcon } from "lucide-react";

export default function PDFToImage() {
  const [files, setFiles] = useState<File[]>([]);
  const [scale, setScale] = useState(2);
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png");
  const [pageRange, setPageRange] = useState("all");
  const [images, setImages] = useState<{ dataUrl: string; name: string; blob: Blob }[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState("");

  async function convert() {
    if (!files[0]) return;
    setProcessing(true);
    setError("");
    setImages([]);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const arrayBuffer = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      const totalPages = pdf.numPages;

      // Parse page range
      let pagesToRender: number[] = [];
      if (pageRange === "all") {
        pagesToRender = Array.from({ length: totalPages }, (_, i) => i + 1);
      } else {
        pageRange.split(",").forEach((part) => {
          const t = part.trim();
          if (t.includes("-")) {
            const [s, e] = t.split("-").map(Number);
            for (let i = s; i <= Math.min(e, totalPages); i++) if (i >= 1) pagesToRender.push(i);
          } else {
            const n = Number(t);
            if (n >= 1 && n <= totalPages) pagesToRender.push(n);
          }
        });
        if (pagesToRender.length === 0) {
          setError(`Invalid range. Max page: ${totalPages}`);
          setProcessing(false);
          return;
        }
      }

      setProgress({ current: 0, total: pagesToRender.length });
      const ext = format === "image/jpeg" ? "jpg" : "png";
      const baseName = files[0].name.replace(/\.pdf$/i, "");
      const results: { dataUrl: string; name: string; blob: Blob }[] = [];

      for (const pageNum of pagesToRender) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;

        if (format === "image/jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        await page.render({ canvasContext: ctx, canvas, viewport }).promise;

        const dataUrl = canvas.toDataURL(format, 0.95);
        const blob = await new Promise<Blob>((res, rej) =>
          canvas.toBlob((b) => (b ? res(b) : rej()), format, 0.95)
        );

        results.push({ dataUrl, name: `${baseName}-page-${pageNum}.${ext}`, blob });
        setProgress((p) => ({ ...p, current: p.current + 1 }));
      }

      setImages(results);
    } catch (e) {
      console.error(e);
      setError("Conversion failed. The PDF may be password-protected or corrupted.");
    } finally {
      setProcessing(false);
    }
  }

  function downloadAll() {
    images.forEach((img) => downloadBlob(img.blob, img.name));
  }

  return (
    <div className="space-y-6">
      <FileDropZone
        accept="application/pdf"
        files={files}
        onFiles={(f) => { setFiles(f); setImages([]); setError(""); }}
        label="Click or drag a PDF here"
        hint="Each page will be converted to an image"
      />

      {files[0] && (
        <div className="space-y-5">
          {/* Options row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
              <div className="flex gap-2">
                {(["image/png", "image/jpeg"] as const).map((f) => (
                  <button key={f} onClick={() => setFormat(f)}
                    className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-colors ${
                      format === f ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                    }`}>
                    {f === "image/png" ? "PNG" : "JPG"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Resolution: <span className="text-orange-600 font-bold">{scale}x</span>
                <span className="text-gray-400 text-xs font-normal ml-1">({scale === 1 ? "72" : scale === 2 ? "144" : "216"} DPI)</span>
              </label>
              <input type="range" min={1} max={3} step={1} value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-orange-600 mt-1" />
              <div className="flex justify-between text-xs text-gray-400">
                <span>1x Fast</span><span>3x High-res</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pages</label>
              <input type="text" value={pageRange} onChange={(e) => setPageRange(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="all  or  1-3, 5" />
            </div>
          </div>

          <button onClick={convert} disabled={processing}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors">
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing
              ? `Converting page ${progress.current + 1} of ${progress.total}…`
              : "Convert PDF to Images"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              {images.length} image{images.length > 1 ? "s" : ""} ready
            </p>
            {images.length > 1 && (
              <button onClick={downloadAll}
                className="flex items-center gap-2 text-sm font-medium text-orange-600 border border-orange-200 rounded-lg px-3 py-1.5 hover:text-orange-700 transition-colors">
                <Download className="w-4 h-4" />
                Download All
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, i) => (
              <div key={i} className="group relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.dataUrl} alt={img.name} className="w-full object-contain max-h-40" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <button onClick={() => downloadBlob(img.blob, img.name)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg">
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
                <div className="px-2 py-1.5 border-t border-gray-100">
                  <p className="text-xs text-gray-500 truncate">{img.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
