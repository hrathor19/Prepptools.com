"use client";

import { useRef, useState, useEffect } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2, Pen, Type, Trash2, Upload } from "lucide-react";

type Tab = "draw" | "type" | "upload";
type Position = "bottom-right" | "bottom-left" | "bottom-center" | "top-right" | "top-left";

export default function SignPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [tab, setTab] = useState<Tab>("draw");
  const [typedName, setTypedName] = useState("");
  const [uploadedSig, setUploadedSig] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [targetPage, setTargetPage] = useState(1);
  const [position, setPosition] = useState<Position>("bottom-right");
  const [sigScale, setSigScale] = useState(25);
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Load page count when PDF is selected
  useEffect(() => {
    if (!files[0]) return;
    (async () => {
      try {
        const { PDFDocument } = await import("pdf-lib");
        const bytes = await files[0].arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        setPageCount(doc.getPageCount());
        setTargetPage(doc.getPageCount()); // default last page
      } catch { /* ignore */ }
    })();
  }, [files]);

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    setIsDrawing(true);
    lastPos.current = getPos(e);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
    setHasDrawing(true);
  }

  function stopDraw() {
    setIsDrawing(false);
    lastPos.current = null;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  }

  async function getSignatureDataUrl(): Promise<string | null> {
    if (tab === "draw") {
      if (!hasDrawing || !canvasRef.current) return null;
      return canvasRef.current.toDataURL("image/png");
    }
    if (tab === "type") {
      if (!typedName.trim()) return null;
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "transparent";
      ctx.clearRect(0, 0, 400, 100);
      ctx.font = "italic 52px Georgia, serif";
      ctx.fillStyle = "#1e293b";
      ctx.textBaseline = "middle";
      ctx.fillText(typedName, 10, 54);
      return canvas.toDataURL("image/png");
    }
    if (tab === "upload") {
      if (!uploadedSig[0]) return null;
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(uploadedSig[0]);
      });
    }
    return null;
  }

  async function apply() {
    if (!files[0]) return;
    const dataUrl = await getSignatureDataUrl();
    if (!dataUrl) { setError("Please create a signature first."); return; }

    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      const imgBytes = await fetch(dataUrl).then((r) => r.arrayBuffer());
      const img = await doc.embedPng(imgBytes);

      const pages = doc.getPages();
      const page = pages[Math.min(targetPage - 1, pages.length - 1)];
      const { width, height } = page.getSize();

      const sigW = (width * sigScale) / 100;
      const sigH = (sigW / img.width) * img.height;
      const margin = 20;

      const posMap: Record<Position, { x: number; y: number }> = {
        "bottom-right": { x: width - sigW - margin, y: margin },
        "bottom-left":  { x: margin, y: margin },
        "bottom-center":{ x: (width - sigW) / 2, y: margin },
        "top-right":    { x: width - sigW - margin, y: height - sigH - margin },
        "top-left":     { x: margin, y: height - sigH - margin },
      };

      const { x, y } = posMap[position];
      page.drawImage(img, { x, y, width: sigW, height: sigH });

      const out = await doc.save();
      setResult(new Blob([out as Uint8Array<ArrayBuffer>], { type: "application/pdf" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to embed signature.");
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
      />

      {files[0] && (
        <div className="space-y-5">
          {/* Signature creator */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="flex border-b border-gray-100">
              {([["draw","Draw", <Pen key="p" className="w-3.5 h-3.5" />], ["type","Type", <Type key="t" className="w-3.5 h-3.5" />], ["upload","Upload Image", <Upload key="u" className="w-3.5 h-3.5" />]] as [Tab, string, React.ReactNode][]).map(([t, label, icon]) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${tab === t ? "bg-orange-50 text-orange-600 border-b-2 border-orange-500" : "text-gray-500 hover:text-gray-700"}`}>
                  {icon}{label}
                </button>
              ))}
            </div>

            <div className="p-4">
              {tab === "draw" && (
                <div className="space-y-2">
                  <canvas
                    ref={canvasRef}
                    width={560}
                    height={160}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={stopDraw}
                    onMouseLeave={stopDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={stopDraw}
                    className="w-full border border-dashed border-gray-300 rounded-xl bg-white cursor-crosshair touch-none"
                    style={{ height: 160 }}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">Draw your signature above</p>
                    <button onClick={clearCanvas} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />Clear
                    </button>
                  </div>
                </div>
              )}

              {tab === "type" && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  {typedName && (
                    <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 text-center">
                      <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 32, color: "#1e293b" }}>
                        {typedName}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {tab === "upload" && (
                <FileDropZone
                  accept="image/png,image/jpeg,image/webp"
                  files={uploadedSig}
                  onFiles={setUploadedSig}
                  label="Upload signature image"
                  hint="PNG with transparent background works best"
                  maxSizeMB={5}
                />
              )}
            </div>
          </div>

          {/* Placement options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page</label>
              <input
                type="number"
                min={1}
                max={pageCount || 1}
                value={targetPage}
                onChange={(e) => setTargetPage(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {pageCount > 0 && <p className="text-xs text-gray-400 mt-1">{pageCount} pages total</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as Position)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-center">Bottom Center</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size: <span className="text-orange-600 font-bold">{sigScale}%</span> of page width
              </label>
              <input type="range" min={10} max={50} step={5} value={sigScale}
                onChange={(e) => setSigScale(Number(e.target.value))}
                className="w-full accent-orange-600 mt-2" />
            </div>
          </div>

          <button onClick={apply} disabled={processing}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors">
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing ? "Signing…" : "Apply Signature"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
          <p className="flex-1 text-sm font-semibold text-green-800">Signature applied to page {targetPage}!</p>
          <DownloadButton blob={result} filename={`${baseName}-signed.pdf`} label="Download PDF" />
        </div>
      )}
    </div>
  );
}
