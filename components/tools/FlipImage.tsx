"use client";

import { useState, useRef } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2, FlipHorizontal2, FlipVertical2, RotateCw } from "lucide-react";

type Action = "flipH" | "flipV" | "rotate90" | "rotate180" | "rotate270";

const actions: { id: Action; label: string; icon: React.ReactNode }[] = [
  { id: "flipH", label: "Flip Horizontal", icon: <FlipHorizontal2 className="w-5 h-5" /> },
  { id: "flipV", label: "Flip Vertical", icon: <FlipVertical2 className="w-5 h-5" /> },
  { id: "rotate90", label: "Rotate 90° CW", icon: <RotateCw className="w-5 h-5" /> },
  { id: "rotate180", label: "Rotate 180°", icon: <RotateCw className="w-5 h-5" style={{ transform: "rotate(180deg)" }} /> },
  { id: "rotate270", label: "Rotate 270° CW", icon: <RotateCw className="w-5 h-5" style={{ transform: "rotate(270deg)" }} /> },
];

export default function FlipImage() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedAction, setSelectedAction] = useState<Action>("flipH");
  const [outputFormat, setOutputFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/png");
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const previewUrl = useRef<string>("");

  async function apply() {
    if (!files[0]) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const file = files[0];
      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = url; });
      URL.revokeObjectURL(url);

      const origW = img.naturalWidth;
      const origH = img.naturalHeight;
      const isRotated = selectedAction === "rotate90" || selectedAction === "rotate270";
      const canvasW = isRotated ? origH : origW;
      const canvasH = isRotated ? origW : origH;

      const canvas = document.createElement("canvas");
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext("2d")!;

      ctx.save();
      switch (selectedAction) {
        case "flipH":
          ctx.translate(canvasW, 0);
          ctx.scale(-1, 1);
          break;
        case "flipV":
          ctx.translate(0, canvasH);
          ctx.scale(1, -1);
          break;
        case "rotate90":
          ctx.translate(canvasW, 0);
          ctx.rotate(Math.PI / 2);
          break;
        case "rotate180":
          ctx.translate(canvasW, canvasH);
          ctx.rotate(Math.PI);
          break;
        case "rotate270":
          ctx.translate(0, canvasH);
          ctx.rotate(-Math.PI / 2);
          break;
      }
      ctx.drawImage(img, 0, 0);
      ctx.restore();

      const ext = outputFormat.split("/")[1].replace("jpeg", "jpg");
      const blob = await new Promise<Blob>((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("Failed"))), outputFormat, 0.95)
      );

      const baseName = file.name.replace(/\.[^.]+$/, "");
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      previewUrl.current = URL.createObjectURL(blob);
      setResult({ blob, name: `${baseName}-${selectedAction}.${ext}` });
    } catch {
      setError("Processing failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <FileDropZone
        accept="image/jpeg,image/png,image/webp,image/gif"
        files={files}
        onFiles={setFiles}
        label="Click or drag an image here"
        hint="Supports JPG, PNG, WebP, GIF"
      />

      {files[0] && (
        <div className="space-y-5">
          {/* Action selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Transformation</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {actions.map((a) => (
                <button key={a.id} onClick={() => setSelectedAction(a.id)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    selectedAction === a.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-violet-200"
                  }`}>
                  {a.icon}
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Output format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
            <div className="flex gap-2">
              {(["image/png", "image/jpeg", "image/webp"] as const).map((fmt) => (
                <button key={fmt} onClick={() => setOutputFormat(fmt)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                    outputFormat === fmt ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
                  }`}>
                  {fmt.split("/")[1].toUpperCase().replace("JPEG", "JPG")}
                </button>
              ))}
            </div>
          </div>

          <button onClick={apply} disabled={processing}
            className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors">
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing ? "Processing…" : "Apply Transformation"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-gray-200 max-h-64 flex items-center justify-center bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl.current} alt="Transformed preview" className="max-h-64 max-w-full object-contain" />
          </div>
          <DownloadButton blob={result.blob} filename={result.name} label="Download Transformed Image" />
        </div>
      )}
    </div>
  );
}
