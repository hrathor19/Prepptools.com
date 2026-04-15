"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import { downloadBlob } from "./shared/DownloadButton";
import { Loader2, Copy, Download, Check } from "lucide-react";

export default function WordToText() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function extract() {
    if (files.length === 0) return;
    setProcessing(true);
    setError("");
    setText("");

    try {
      const mammoth = await import("mammoth");
      const buffer = await files[0].arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      setText(result.value.trim());
    } catch (e) {
      console.error(e);
      setError("Could not read this file. Make sure it is a valid .docx document.");
    } finally {
      setProcessing(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const blob = new Blob([text], { type: "text/plain" });
    const name = (files[0]?.name ?? "document").replace(/\.docx$/i, "") + ".txt";
    downloadBlob(blob, name);
  }

  return (
    <div className="space-y-6">
      <FileDropZone
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple={false}
        files={files}
        onFiles={(f) => { setFiles(f); setText(""); setError(""); }}
        label="Click or drag a .docx file here"
        hint="Microsoft Word documents (.docx) only"
        maxSizeMB={50}
      />

      {files.length > 0 && !text && (
        <button
          onClick={extract}
          disabled={processing}
          className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
        >
          {processing && <Loader2 className="w-5 h-5 animate-spin" />}
          {processing ? "Extracting…" : "Extract Text"}
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {text && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Extracted text — {text.split(/\s+/).filter(Boolean).length.toLocaleString()} words
            </p>
            <div className="flex gap-2">
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:border-sky-400 hover:text-sky-600 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={download}
                className="flex items-center gap-1.5 text-sm bg-sky-600 text-white px-3 py-1.5 rounded-lg hover:bg-sky-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download .txt
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={text}
            rows={16}
            className="w-full border border-gray-200 rounded-2xl p-4 text-sm text-gray-700 font-mono bg-gray-50 resize-y focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
