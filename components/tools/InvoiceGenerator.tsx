"use client";
import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Plus, Trash2, Download } from "lucide-react";

type LineItem = { description: string; qty: string; rate: string };

const today = new Date().toISOString().split("T")[0];

export default function InvoiceGenerator() {
  const [from, setFrom] = useState({ name: "", address: "", email: "" });
  const [to, setTo] = useState({ name: "", address: "" });
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [date, setDate] = useState(today);
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<LineItem[]>([{ description: "", qty: "1", rate: "" }]);
  const [taxPct, setTaxPct] = useState("");
  const [notes, setNotes] = useState("");
  const [generating, setGenerating] = useState(false);

  function addItem() { setItems(i => [...i, { description: "", qty: "1", rate: "" }]); }
  function removeItem(i: number) { setItems(p => p.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, key: keyof LineItem, val: string) {
    setItems(p => p.map((it, idx) => idx === i ? { ...it, [key]: val } : it));
  }

  const subtotal = items.reduce((s, it) => s + (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0), 0);
  const taxAmt = subtotal * ((parseFloat(taxPct) || 0) / 100);
  const total = subtotal + taxAmt;

  const fmt = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

  async function generate() {
    setGenerating(true);
    try {
      const doc = await PDFDocument.create();
      const page = doc.addPage([595, 842]);
      const { width, height } = page.getSize();
      const bold = await doc.embedFont(StandardFonts.HelveticaBold);
      const reg = await doc.embedFont(StandardFonts.Helvetica);
      const gray = rgb(0.4, 0.4, 0.4);
      const dark = rgb(0.1, 0.1, 0.1);
      const accent = rgb(0.2, 0.4, 0.8);

      // Header bar
      page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: accent });
      page.drawText("INVOICE", { x: 40, y: height - 50, size: 28, font: bold, color: rgb(1, 1, 1) });
      page.drawText(invoiceNo, { x: 40, y: height - 68, size: 11, font: reg, color: rgb(0.8, 0.85, 1) });

      // Date
      page.drawText(`Date: ${date}`, { x: width - 160, y: height - 48, size: 10, font: reg, color: rgb(1, 1, 1) });
      if (dueDate) page.drawText(`Due: ${dueDate}`, { x: width - 160, y: height - 63, size: 10, font: reg, color: rgb(0.9, 0.9, 1) });

      // From / To
      let y = height - 110;
      page.drawText("FROM", { x: 40, y, size: 9, font: bold, color: gray });
      page.drawText("BILL TO", { x: 300, y, size: 9, font: bold, color: gray });
      y -= 16;
      page.drawText(from.name || "—", { x: 40, y, size: 11, font: bold, color: dark });
      page.drawText(to.name || "—", { x: 300, y, size: 11, font: bold, color: dark });
      y -= 14;
      (from.address || "").split("\n").forEach(ln => { page.drawText(ln, { x: 40, y, size: 9, font: reg, color: gray }); y -= 12; });
      y = height - 140;
      (to.address || "").split("\n").forEach(ln => { page.drawText(ln, { x: 300, y, size: 9, font: reg, color: gray }); y -= 12; });
      if (from.email) { page.drawText(from.email, { x: 40, y: height - 140 - (from.address.split("\n").length) * 12, size: 9, font: reg, color: gray }); }

      // Items table header
      y = height - 220;
      page.drawRectangle({ x: 30, y: y - 4, width: width - 60, height: 22, color: rgb(0.93, 0.95, 1) });
      page.drawText("Description", { x: 40, y, size: 10, font: bold, color: dark });
      page.drawText("Qty", { x: 360, y, size: 10, font: bold, color: dark });
      page.drawText("Rate", { x: 420, y, size: 10, font: bold, color: dark });
      page.drawText("Amount", { x: 490, y, size: 10, font: bold, color: dark });
      y -= 20;

      items.forEach(it => {
        const amt = (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0);
        page.drawText(it.description || "—", { x: 40, y, size: 10, font: reg, color: dark });
        page.drawText(it.qty || "0", { x: 360, y, size: 10, font: reg, color: dark });
        page.drawText(it.rate || "0", { x: 420, y, size: 10, font: reg, color: dark });
        page.drawText(fmt(amt), { x: 490, y, size: 10, font: reg, color: dark });
        y -= 18;
        page.drawLine({ start: { x: 30, y }, end: { x: width - 30, y }, thickness: 0.5, color: rgb(0.9, 0.9, 0.9) });
        y -= 4;
      });

      // Totals
      y -= 10;
      page.drawText("Subtotal:", { x: 420, y, size: 10, font: reg, color: gray });
      page.drawText(fmt(subtotal), { x: 500, y, size: 10, font: reg, color: dark }); y -= 16;
      if (taxPct) {
        page.drawText(`Tax (${taxPct}%):`, { x: 420, y, size: 10, font: reg, color: gray });
        page.drawText(fmt(taxAmt), { x: 500, y, size: 10, font: reg, color: dark }); y -= 16;
      }
      page.drawRectangle({ x: 400, y: y - 6, width: 165, height: 24, color: accent });
      page.drawText("TOTAL:", { x: 420, y, size: 11, font: bold, color: rgb(1, 1, 1) });
      page.drawText(fmt(total), { x: 500, y, size: 11, font: bold, color: rgb(1, 1, 1) });

      if (notes) {
        y -= 40;
        page.drawText("Notes:", { x: 40, y, size: 9, font: bold, color: gray }); y -= 14;
        page.drawText(notes, { x: 40, y, size: 9, font: reg, color: gray });
      }

      const bytes = await doc.save() as Uint8Array<ArrayBuffer>;
      const blob = new Blob([bytes], { type: "application/pdf" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = `${invoiceNo}.pdf`; a.click();
    } finally { setGenerating(false); }
  }

  const inputCls = "w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">From (Your Info)</p>
          <input placeholder="Your name / company" value={from.name} onChange={e => setFrom(f => ({ ...f, name: e.target.value }))} className={inputCls} />
          <textarea placeholder="Address" rows={2} value={from.address} onChange={e => setFrom(f => ({ ...f, address: e.target.value }))} className={inputCls + " resize-none"} />
          <input placeholder="Email" value={from.email} onChange={e => setFrom(f => ({ ...f, email: e.target.value }))} className={inputCls} />
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">Bill To (Client)</p>
          <input placeholder="Client name / company" value={to.name} onChange={e => setTo(t => ({ ...t, name: e.target.value }))} className={inputCls} />
          <textarea placeholder="Client address" rows={2} value={to.address} onChange={e => setTo(t => ({ ...t, address: e.target.value }))} className={inputCls + " resize-none"} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div><label className="block text-xs font-medium text-gray-600 mb-1">Invoice #</label><input value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className={inputCls} /></div>
        <div><label className="block text-xs font-medium text-gray-600 mb-1">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} /></div>
        <div><label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inputCls} /></div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700">Line Items</p>
        <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-1">
          <span className="col-span-6">Description</span><span className="col-span-2">Qty</span><span className="col-span-2">Rate</span><span className="col-span-1">Amount</span>
        </div>
        {items.map((it, i) => {
          const amt = (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0);
          return (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input placeholder="Description" value={it.description} onChange={e => updateItem(i, "description", e.target.value)} className={inputCls + " col-span-6"} />
              <input placeholder="1" value={it.qty} onChange={e => updateItem(i, "qty", e.target.value)} className={inputCls + " col-span-2"} type="number" min="0" />
              <input placeholder="0.00" value={it.rate} onChange={e => updateItem(i, "rate", e.target.value)} className={inputCls + " col-span-2"} type="number" min="0" />
              <span className="col-span-1 text-sm font-medium text-gray-700">{fmt(amt)}</span>
              <button onClick={() => removeItem(i)} className="col-span-1 text-gray-300 hover:text-red-500 transition-colors justify-self-center"><Trash2 className="w-4 h-4" /></button>
            </div>
          );
        })}
        <button onClick={addItem} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium mt-1">
          <Plus className="w-4 h-4" /> Add item
        </button>
      </div>

      <div className="flex justify-end">
        <div className="space-y-2 w-64">
          <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span>{fmt(subtotal)}</span></div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 flex-1">Tax %</span>
            <input type="number" min="0" max="100" placeholder="0" value={taxPct} onChange={e => setTaxPct(e.target.value)} className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <span className="text-sm text-gray-700">{fmt(taxAmt)}</span>
          </div>
          <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2"><span>Total</span><span>{fmt(total)}</span></div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
        <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Payment terms, thank you note…" className={inputCls + " resize-none"} />
      </div>

      <button onClick={generate} disabled={generating}
        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors">
        <Download className="w-5 h-5" />{generating ? "Generating…" : "Download PDF Invoice"}
      </button>
    </div>
  );
}
