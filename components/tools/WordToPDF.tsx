"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import { Loader2, Printer } from "lucide-react";

export default function WordToPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [html, setHtml] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function convert() {
    if (files.length === 0) return;
    setProcessing(true);
    setError("");
    setHtml("");

    try {
      const mammoth = await import("mammoth");
      const buffer = await files[0].arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
      setHtml(result.value);
    } catch (e) {
      console.error(e);
      setError("Could not read this file. Make sure it is a valid .docx document.");
    } finally {
      setProcessing(false);
    }
  }

  function printAsPDF() {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Document</title>
  <style>
    body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.6;
           max-width: 720px; margin: 40px auto; color: #111; }
    h1,h2,h3,h4 { margin-top: 1.2em; }
    p { margin: 0.5em 0; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    td, th { border: 1px solid #ccc; padding: 6px 10px; }
    img { max-width: 100%; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>${html}</body>
</html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  }

  return (
    <div className="space-y-6">
      <FileDropZone
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple={false}
        files={files}
        onFiles={(f) => { setFiles(f); setHtml(""); setError(""); }}
        label="Click or drag a .docx file here"
        hint="Microsoft Word documents (.docx) only"
        maxSizeMB={50}
      />

      {files.length > 0 && !html && (
        <button
          onClick={convert}
          disabled={processing}
          className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
        >
          {processing && <Loader2 className="w-5 h-5 animate-spin" />}
          {processing ? "Converting…" : "Convert to PDF"}
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {html && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-green-800">Document converted successfully!</p>
              <p className="text-xs text-green-600 mt-0.5">
                Click &quot;Save as PDF&quot; below — your browser will open a print dialog. Choose &quot;Save as PDF&quot; as the destination.
              </p>
            </div>
            <button
              onClick={printAsPDF}
              className="flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-sky-700 transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              Save as PDF
            </button>
          </div>

          {/* Document Preview */}
          <div>
            <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Preview</p>
            <div
              className="bg-white border border-gray-200 rounded-2xl p-8 prose prose-sm max-w-none overflow-auto max-h-[500px] text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
