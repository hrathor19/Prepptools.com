"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2, Printer } from "lucide-react";

type SheetData = { name: string; rows: string[][] };

export default function ExcelToPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function parse() {
    if (files.length === 0) return;
    setProcessing(true);
    setError("");
    setResult(null);
    setSheets([]);

    try {
      const XLSX = await import("xlsx");
      const buffer = await files[0].arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });

      const parsed: SheetData[] = wb.SheetNames.map((name) => {
        const ws = wb.Sheets[name];
        const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 }) as string[][];
        return { name, rows: rows.filter((r) => r.some((c) => c !== undefined && c !== "")) };
      });

      setSheets(parsed);
      setActiveSheet(0);
    } catch (e) {
      console.error(e);
      setError("Could not read this file. Make sure it is a valid .xlsx or .xls file.");
    } finally {
      setProcessing(false);
    }
  }

  function printSheetAsPDF() {
    const sheet = sheets[activeSheet];
    if (!sheet) return;

    const headerRow = sheet.rows[0] ?? [];
    const dataRows = sheet.rows.slice(1);

    const tableHtml = `
      <table>
        <thead>
          <tr>${headerRow.map((h) => `<th>${h ?? ""}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${dataRows.map((row) =>
            `<tr>${headerRow.map((_, i) => `<td>${row[i] ?? ""}</td>`).join("")}</tr>`
          ).join("")}
        </tbody>
      </table>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${sheet.name}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 10pt; margin: 20px; color: #111; }
    h2 { font-size: 12pt; margin-bottom: 12px; }
    table { border-collapse: collapse; width: 100%; }
    th { background: #f3f4f6; font-weight: 600; text-align: left; }
    th, td { border: 1px solid #d1d5db; padding: 5px 8px; font-size: 9pt; }
    tr:nth-child(even) td { background: #f9fafb; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h2>${sheet.name}</h2>
  ${tableHtml}
</body>
</html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  }

  const currentSheet = sheets[activeSheet];

  return (
    <div className="space-y-6">
      <FileDropZone
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        multiple={false}
        files={files}
        onFiles={(f) => { setFiles(f); setSheets([]); setResult(null); setError(""); }}
        label="Click or drag an Excel file here"
        hint=".xlsx or .xls"
        maxSizeMB={50}
      />

      {files.length > 0 && sheets.length === 0 && (
        <button
          onClick={parse}
          disabled={processing}
          className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
        >
          {processing && <Loader2 className="w-5 h-5 animate-spin" />}
          {processing ? "Reading…" : "Load Spreadsheet"}
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {sheets.length > 0 && (
        <div className="space-y-4">
          {/* Sheet tabs */}
          {sheets.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {sheets.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => { setActiveSheet(i); setResult(null); }}
                  className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors ${
                    activeSheet === i
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-sky-400"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}

          {currentSheet && (
            <>
              {/* Table preview */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-auto max-h-72">
                  <table className="text-xs text-gray-700 w-full">
                    <tbody>
                      {currentSheet.rows.slice(0, 20).map((row, ri) => (
                        <tr key={ri} className={ri === 0 ? "bg-gray-50 font-semibold sticky top-0" : "border-t border-gray-100"}>
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-3 py-2 border-r border-gray-100 last:border-r-0 whitespace-nowrap">
                              {cell ?? ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {currentSheet.rows.length > 20 && (
                  <p className="text-xs text-gray-400 px-4 py-2 border-t border-gray-100 bg-gray-50">
                    Showing 20 of {currentSheet.rows.length} rows
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={printSheetAsPDF}
                  className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Save as PDF
                </button>
                <p className="text-xs text-gray-400">
                  Browser print dialog will open — choose &quot;Save as PDF&quot;
                </p>
              </div>

              {result && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
                  <DownloadButton blob={result} filename="spreadsheet.pdf" label="Download PDF" />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
