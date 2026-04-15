"use client";

import { Download } from "lucide-react";

interface DownloadButtonProps {
  blob: Blob | null;
  filename: string;
  label?: string;
  className?: string;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function DownloadButton({
  blob,
  filename,
  label = "Download",
  className = "",
}: DownloadButtonProps) {
  if (!blob) return null;

  return (
    <button
      onClick={() => downloadBlob(blob, filename)}
      className={`flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors ${className}`}
    >
      <Download className="w-5 h-5" />
      {label}
    </button>
  );
}
