"use client";

import { useState, useRef, useEffect } from "react";
import { Copy, Check, Code, Image as ImageIcon, Upload } from "lucide-react";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageToBase64() {
  const [file, setFile] = useState<File | null>(null);
  const [dataUrl, setDataUrl] = useState<string>("");
  const [snippet, setSnippet] = useState<string>("");
  const [snippetType, setSnippetType] = useState<"html" | "css" | null>(null);
  const [copied, setCopied] = useState<string>("");
  const [dragging, setDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) { setDataUrl(""); setSnippet(""); setSnippetType(null); return; }
    const reader = new FileReader();
    reader.onload = () => setDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }, [file]);

  function handleFiles(incoming: FileList | null) {
    if (!incoming || !incoming[0]) return;
    setFile(incoming[0]);
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 1800);
    });
  }

  function showSnippet(type: "html" | "css") {
    if (!dataUrl) return;
    if (type === "html") {
      setSnippet(`<img src="${dataUrl}" alt="image" />`);
    } else {
      setSnippet(`background-image: url("${dataUrl}");`);
    }
    setSnippetType(type);
  }

  const encodedSize = dataUrl ? new Blob([dataUrl]).size : 0;

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl px-6 py-10 cursor-pointer transition-colors ${
          dragging
            ? "border-violet-500 bg-violet-50"
            : "border-gray-300 bg-gray-50 hover:border-violet-400 hover:bg-violet-50/30"
        }`}
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dragging ? "bg-violet-100" : "bg-white border border-gray-200"}`}>
          <Upload className={`w-6 h-6 ${dragging ? "text-violet-600" : "text-gray-400"}`} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">Click or drag an image here</p>
          <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WebP, SVG, GIF, BMP</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* File Info */}
      {file && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">File Name</p>
            <p className="text-sm font-semibold text-gray-700 truncate" title={file.name}>{file.name}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Original Size</p>
            <p className="text-sm font-semibold text-gray-700">{formatBytes(file.size)}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">MIME Type</p>
            <p className="text-sm font-semibold text-gray-700">{file.type || "unknown"}</p>
          </div>
        </div>
      )}

      {/* Base64 Output */}
      {dataUrl && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Base64 Data URL</label>
            <span className="text-xs text-gray-400">Encoded size: {formatBytes(encodedSize)}</span>
          </div>
          <textarea
            readOnly
            value={dataUrl}
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-mono text-gray-600 bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <button
            onClick={() => copyText(dataUrl, "base64")}
            className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-colors"
          >
            {copied === "base64" ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied === "base64" ? "Copied!" : "Copy Base64"}
          </button>

          {/* Snippet Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => showSnippet("html")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                snippetType === "html"
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Use in HTML
            </button>
            <button
              onClick={() => showSnippet("css")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                snippetType === "css"
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
              }`}
            >
              <Code className="w-4 h-4" />
              Use in CSS
            </button>
          </div>

          {/* Snippet Preview */}
          {snippet && snippetType && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {snippetType === "html" ? "HTML Snippet" : "CSS Snippet"}
              </p>
              <div className="relative">
                <textarea
                  readOnly
                  value={snippet}
                  rows={3}
                  className="w-full border border-violet-200 rounded-xl px-3 py-2.5 text-xs font-mono text-gray-700 bg-violet-50 resize-none focus:outline-none"
                />
                <button
                  onClick={() => copyText(snippet, "snippet")}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-violet-600 hover:border-violet-300 transition-colors"
                >
                  {copied === "snippet" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
