"use client";

import { useRef, useState } from "react";
import { Upload, X, File } from "lucide-react";

interface FileDropZoneProps {
  accept: string;
  multiple?: boolean;
  files: File[];
  onFiles: (files: File[]) => void;
  label?: string;
  hint?: string;
  maxSizeMB?: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function FileDropZone({
  accept,
  multiple = false,
  files,
  onFiles,
  label = "Click or drag file here",
  hint,
  maxSizeMB = 100,
}: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  function processFiles(incoming: File[]) {
    const oversized = incoming.filter((f) => f.size > maxSizeMB * 1024 * 1024);
    if (oversized.length > 0) {
      setError(`File "${oversized[0].name}" exceeds ${maxSizeMB} MB limit.`);
      return;
    }
    setError("");
    onFiles(multiple ? [...files, ...incoming] : incoming.slice(0, 1));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    processFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  }

  function removeFile(index: number) {
    onFiles(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl px-6 py-10 cursor-pointer transition-colors ${
          dragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40"
        }`}
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dragging ? "bg-blue-100" : "bg-white border border-gray-200"}`}>
          <Upload className={`w-6 h-6 ${dragging ? "text-blue-600" : "text-gray-400"}`} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">{label}</p>
          {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
          <p className="text-xs text-gray-400 mt-1">Max {maxSizeMB} MB per file</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInput}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      {/* File List */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5"
            >
              <File className="w-4 h-4 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
