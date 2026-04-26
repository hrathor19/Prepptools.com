"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MousePointer2, Type, Image as LucideImage, Square, Circle, Minus, ArrowRight,
  Highlighter, Eraser, Pen, PenLine, Search, Undo2, Redo2, Download,
  FolderOpen, X, Bold, Italic, Underline as UnderlineIcon, Loader2,
} from "lucide-react";

type ToolType =
  | "select" | "text" | "image" | "rectangle" | "ellipse"
  | "line" | "arrow" | "highlight" | "whiteout" | "draw" | "signature";

type BaseAnn = { id: string; page: number; opacity: number };
type TextAnn  = BaseAnn & { type: "text"; x: number; y: number; text: string; fontFamily: string; fontSize: number; bold: boolean; italic: boolean; underline: boolean; color: string };
type DrawAnn  = BaseAnn & { type: "draw"; points: { x: number; y: number }[]; color: string; lineWidth: number };
type ShapeAnn = BaseAnn & { type: "rectangle" | "ellipse" | "highlight" | "whiteout"; x: number; y: number; w: number; h: number; color: string };
type LineAnn  = BaseAnn & { type: "line" | "arrow"; x1: number; y1: number; x2: number; y2: number; color: string; lineWidth: number };
type ImgAnn   = BaseAnn & { type: "signature" | "img"; x: number; y: number; w: number; h: number; dataUrl: string };
type Annotation = TextAnn | DrawAnn | ShapeAnn | LineAnn | ImgAnn;

// Native PDF text item extracted via pdfjs getTextContent()
type PdfTextItem = { str: string; x: number; y: number; w: number; h: number; fontSize: number; fontName: string };

function uid() { return Math.random().toString(36).slice(2, 10); }

const TOOLS: { id: ToolType; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: "select",    label: "Select",    Icon: MousePointer2 },
  { id: "text",      label: "Text",      Icon: Type },
  { id: "image",     label: "Image",     Icon: LucideImage },
  { id: "rectangle", label: "Rectangle", Icon: Square },
  { id: "ellipse",   label: "Ellipse",   Icon: Circle },
  { id: "line",      label: "Line",      Icon: Minus },
  { id: "arrow",     label: "Arrow",     Icon: ArrowRight },
  { id: "highlight", label: "Highlight", Icon: Highlighter },
  { id: "whiteout",  label: "Whiteout",  Icon: Eraser },
  { id: "draw",      label: "Draw",      Icon: Pen },
  { id: "signature", label: "Signature", Icon: PenLine },
];

const FONT_FAMILIES = ["Helvetica", "Arial", "Times New Roman", "Courier New", "Georgia"];

export default function EditPDF() {
  const [file, setFile]             = useState<File | null>(null);
  const [draggingOver, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef  = useRef<HTMLInputElement>(null);

  const [totalPages, setTotalPages]   = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [thumbUrls, setThumbUrls]     = useState<string[]>([]);
  const [renderCount, setRenderCount] = useState(0);
  const pdfDocRef  = useRef<any>(null);
  const pageSizes  = useRef<Map<number, { w: number; h: number }>>(new Map());

  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [fontFamily, setFontFamily] = useState("Helvetica");
  const [fontSize,   setFontSize]   = useState(16);
  const [bold,       setBold]       = useState(false);
  const [italic,     setItalic]     = useState(false);
  const [underline,  setUnderline]  = useState(false);
  const [color,      setColor]      = useState("#000000");
  const [opacity,    setOpacity]    = useState(1);
  const [showFind,   setShowFind]   = useState(false);
  const [zoom,       setZoom]       = useState(1.0);
  const [pdfReady,   setPdfReady]   = useState(0);

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const histStack = useRef<Annotation[][]>([[]]);
  const histIdx   = useRef(0);

  const [selectedId,    setSelectedId]    = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const selectedIdRef = useRef<string | null>(null); // always-fresh ref so renderAnnotations never sees stale state
  const hoveredIdRef  = useRef<string | null>(null); // same pattern for hover

  const isDrawing  = useRef(false);
  const dragStart  = useRef({ x: 0, y: 0 });
  const curPath    = useRef<{ x: number; y: number }[]>([]);
  const pendingImg = useRef<string | null>(null);

  // Native PDF text — populated after each page render
  const nativeTextRef         = useRef<Map<number, PdfTextItem[]>>(new Map());
  const selectedNativeRef     = useRef<PdfTextItem | null>(null);
  const hoveredNativeRef      = useRef<PdfTextItem | null>(null);
  // Locked baseline y for native-text editing (avoids fontSize-state timing race)
  const nativeEditBaselineRef = useRef<number | null>(null);

  const [textPos, setTextPos] = useState<{ cx: number; cy: number } | null>(null);
  const [textVal, setTextVal] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [sigClickPos, setSigClickPos] = useState<{ cx: number; cy: number } | null>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const sigDrawing   = useRef(false);
  const sigLastPos   = useRef<{ x: number; y: number } | null>(null);
  const sigHasData   = useRef(false);

  const pdfCanvasRef     = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const [processing, setProcessing] = useState(false);
  const [error, setError]           = useState("");

  // ── HISTORY ────────────────────────────────────────────────────────────
  const pushHistory = useCallback((next: Annotation[]) => {
    const h = histStack.current.slice(0, histIdx.current + 1);
    h.push(next);
    histStack.current = h;
    histIdx.current   = h.length - 1;
    setAnnotations(next);
  }, []);

  function undo() {
    if (histIdx.current <= 0) return;
    histIdx.current--;
    setAnnotations(histStack.current[histIdx.current]);
  }
  function redo() {
    if (histIdx.current >= histStack.current.length - 1) return;
    histIdx.current++;
    setAnnotations(histStack.current[histIdx.current]);
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); return; }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); redo(); return; }
      const tag = (e.target as HTMLElement)?.tagName;
      if ((e.key === "Delete" || e.key === "Backspace") && tag !== "INPUT" && tag !== "TEXTAREA") {
        const selId = selectedIdRef.current;
        if (selId && !editingTextId) {
          e.preventDefault();
          pushHistory(annotations.filter(a => a.id !== selId));
          selectedIdRef.current = null;
          setSelectedId(null);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editingTextId, annotations, pushHistory]);

  // Lock page scroll while editor is open
  useEffect(() => {
    if (file) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [file]);

  // ── LOAD PDF ───────────────────────────────────────────────────────────
  async function loadFile(f: File) {
    if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setAnnotations([]);
    histStack.current = [[]];
    histIdx.current   = 0;
    setCurrentPage(1);
    setError("");
    setTotalPages(0);
    setThumbUrls([]);
    pageSizes.current.clear();
    nativeTextRef.current.clear();

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const buf = await f.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
      pdfDocRef.current = pdfDoc;
      setTotalPages(pdfDoc.numPages);
      setPdfReady(n => n + 1); // triggers page rendering effect

      const urls: string[] = [];
      for (let p = 1; p <= pdfDoc.numPages; p++) {
        const page = await pdfDoc.getPage(p);
        const vp   = page.getViewport({ scale: 0.18 });
        const c    = document.createElement("canvas");
        c.width    = Math.ceil(vp.width);
        c.height   = Math.ceil(vp.height);
        await page.render({ canvasContext: c.getContext("2d")!, viewport: vp, canvas: c }).promise;
        urls.push(c.toDataURL());
      }
      setThumbUrls(urls);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load PDF.");
    }
  }

  // ── PAGE RENDERING ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!pdfDocRef.current || currentPage < 1) return;
    let cancelled = false;
    (async () => {
      try {
        const pdfPage = await pdfDocRef.current.getPage(currentPage);
        if (cancelled) return;

        const sidebarW  = 72;
        const padding   = 48;
        const availableW = window.innerWidth - sidebarW - padding;
        const vp1  = pdfPage.getViewport({ scale: 1 });
        const fitScale = availableW / vp1.width;
        const scale = fitScale * zoom;
        const vp   = pdfPage.getViewport({ scale });
        const dpr  = window.devicePixelRatio || 1;
        const cssW = Math.ceil(vp.width);
        const cssH = Math.ceil(vp.height);

        const pc = pdfCanvasRef.current!;
        pc.width  = cssW * dpr;
        pc.height = cssH * dpr;
        pc.style.width  = `${cssW}px`;
        pc.style.height = `${cssH}px`;

        const oc = overlayCanvasRef.current!;
        oc.width  = cssW * dpr;
        oc.height = cssH * dpr;
        oc.style.width  = `${cssW}px`;
        oc.style.height = `${cssH}px`;

        pageSizes.current.set(currentPage, { w: cssW, h: cssH });

        const ctx = pc.getContext("2d")!;
        ctx.scale(dpr, dpr);
        await pdfPage.render({ canvasContext: ctx, viewport: vp, canvas: pc }).promise;

        // Extract native text item positions for hit-testing
        try {
          const tc = await pdfPage.getTextContent();
          const items: PdfTextItem[] = [];
          for (const raw of tc.items) {
            if (!("str" in raw)) continue;
            const it = raw as { str: string; transform: number[]; width: number; fontName?: string };
            if (!it.str.trim()) continue;
            const t = it.transform; // [a, b, c, d, tx, ty] in PDF user space
            // Convert PDF baseline point → canvas CSS pixels
            // For standard (unrotated) pages: canvasX = tx*scale, canvasY = (pageH - ty)*scale
            const canvasX = t[4] * scale;
            const canvasY = (vp1.height - t[5]) * scale;
            const fontH   = Math.abs(t[3]) * scale;        // font height in canvas px
            const textW   = Math.max((it.width ?? 0) * scale, fontH * 0.3);
            items.push({
              str:      it.str,
              x:        canvasX,
              y:        canvasY - fontH,    // top of glyph box
              w:        textW,
              h:        fontH * 1.35,
              fontSize: Math.max(4, fontH),
              fontName: it.fontName ?? "",
            });
          }
          if (!cancelled) nativeTextRef.current.set(currentPage, items);
        } catch { /* ignore text extraction errors */ }

        if (!cancelled) setRenderCount(n => n + 1);
      } catch { /* ignored */ }
    })();
    return () => { cancelled = true; };
  }, [currentPage, file, pdfReady, zoom]);

  // ── SELECT TOOL HELPERS ───────────────────────────────────────────────
  // Measure actual rendered text width via an offscreen canvas
  const measureCtx = useRef<CanvasRenderingContext2D | null>(null);
  function measureTextW(ann: TextAnn): number {
    if (!measureCtx.current) {
      measureCtx.current = document.createElement("canvas").getContext("2d")!;
    }
    const ctx = measureCtx.current;
    ctx.font = `${ann.italic ? "italic " : ""}${ann.bold ? "bold " : ""}${ann.fontSize}px "${ann.fontFamily}"`;
    return ctx.measureText(ann.text).width;
  }

  // Detect bold/italic/family from the internal pdfjs font name
  function parseFontName(fontName: string): { bold: boolean; italic: boolean; family: string } {
    const lower = fontName.toLowerCase();
    return {
      bold:   /bold/i.test(lower),
      italic: /italic|oblique/i.test(lower),
      family: lower.includes("times") || lower.includes("roman") ? "Times New Roman"
            : lower.includes("courier")                          ? "Courier New"
            : lower.includes("georgia")                          ? "Georgia"
            : lower.includes("arial")                            ? "Arial"
            : "Helvetica",
    };
  }

  // Sample the text color from the pdfCanvas pixel at the text position
  function sampleTextColor(item: PdfTextItem): string {
    const pc = pdfCanvasRef.current;
    if (!pc) return "#000000";
    const ctx2 = pc.getContext("2d");
    if (!ctx2) return "#000000";
    const dpr = window.devicePixelRatio || 1;
    // Sample several points across the text and pick the darkest non-background one
    const offsets = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
    let best = { r: 0, g: 0, b: 0, brightness: 256 };
    for (const fx of offsets) {
      const px = Math.round((item.x + item.w * fx) * dpr);
      const py = Math.round((item.y + item.h * 0.6) * dpr); // near baseline
      if (px < 0 || py < 0 || px >= pc.width || py >= pc.height) continue;
      try {
        const d = ctx2.getImageData(px, py, 1, 1).data;
        const brightness = (d[0] + d[1] + d[2]) / 3;
        if (brightness < best.brightness) best = { r: d[0], g: d[1], b: d[2], brightness };
      } catch { /* ignore */ }
    }
    if (best.brightness > 210) return "#000000"; // all samples were background
    return "#" + [best.r, best.g, best.b].map(v => v.toString(16).padStart(2, "0")).join("");
  }

  function distToSeg(p: {x:number;y:number}, a: {x:number;y:number}, b: {x:number;y:number}) {
    const dx = b.x-a.x, dy = b.y-a.y;
    const lenSq = dx*dx + dy*dy;
    if (lenSq === 0) return Math.hypot(p.x-a.x, p.y-a.y);
    const t = Math.max(0, Math.min(1, ((p.x-a.x)*dx + (p.y-a.y)*dy) / lenSq));
    return Math.hypot(p.x-a.x-t*dx, p.y-a.y-t*dy);
  }

  function hitTest(ann: Annotation, x: number, y: number): boolean {
    const pad = 12;
    if (ann.type === "text") {
      const w = measureTextW(ann);
      // ann.y is the text baseline; visual top = ann.y - ann.fontSize
      return x >= ann.x - pad && x <= ann.x + w + pad
          && y >= ann.y - ann.fontSize - pad && y <= ann.y + pad;
    }
    if (ann.type === "draw") {
      for (let i = 0; i < ann.points.length - 1; i++) {
        if (distToSeg({x,y}, ann.points[i], ann.points[i+1]) < pad + ann.lineWidth) return true;
      }
      return false;
    }
    if (["rectangle","ellipse","highlight","whiteout"].includes(ann.type)) {
      const a = ann as ShapeAnn;
      return x >= a.x-pad && x <= a.x+a.w+pad && y >= a.y-pad && y <= a.y+a.h+pad;
    }
    if (["line","arrow"].includes(ann.type)) {
      const a = ann as LineAnn;
      return distToSeg({x,y}, {x:a.x1,y:a.y1}, {x:a.x2,y:a.y2}) < pad + a.lineWidth;
    }
    if (["signature","img"].includes(ann.type)) {
      const a = ann as ImgAnn;
      return x >= a.x-pad && x <= a.x+a.w+pad && y >= a.y-pad && y <= a.y+a.h+pad;
    }
    return false;
  }

  function hitTestNative(item: PdfTextItem, x: number, y: number): boolean {
    const pad = 4;
    return x >= item.x - pad && x <= item.x + item.w + pad
        && y >= item.y - pad && y <= item.y + item.h + pad;
  }

  function getAnnBounds(ann: Annotation): {x:number;y:number;w:number;h:number} {
    if (ann.type === "text") {
      const w = measureTextW(ann);
      return { x: ann.x, y: ann.y - ann.fontSize, w, h: ann.fontSize * 1.4 };
    }
    if (ann.type === "draw") {
      const xs = ann.points.map(p=>p.x), ys = ann.points.map(p=>p.y);
      const p = ann.lineWidth / 2;
      return { x: Math.min(...xs)-p, y: Math.min(...ys)-p, w: (Math.max(...xs)-Math.min(...xs))+p*2, h: (Math.max(...ys)-Math.min(...ys))+p*2 };
    }
    if (["rectangle","ellipse","highlight","whiteout"].includes(ann.type)) {
      const a = ann as ShapeAnn; return { x: a.x, y: a.y, w: a.w, h: a.h };
    }
    if (["line","arrow"].includes(ann.type)) {
      const a = ann as LineAnn;
      return { x: Math.min(a.x1,a.x2)-4, y: Math.min(a.y1,a.y2)-4, w: Math.abs(a.x2-a.x1)+8, h: Math.abs(a.y2-a.y1)+8 };
    }
    if (["signature","img"].includes(ann.type)) {
      const a = ann as ImgAnn; return { x: a.x, y: a.y, w: a.w, h: a.h };
    }
    return { x: 0, y: 0, w: 0, h: 0 };
  }

  function moveAnnotation(ann: Annotation, dx: number, dy: number): Annotation {
    if (ann.type === "text") return { ...ann, x: ann.x+dx, y: ann.y+dy };
    if (ann.type === "draw") return { ...ann, points: ann.points.map(p=>({x:p.x+dx,y:p.y+dy})) };
    if (["rectangle","ellipse","highlight","whiteout"].includes(ann.type)) { const a = ann as ShapeAnn; return { ...a, x: a.x+dx, y: a.y+dy }; }
    if (["line","arrow"].includes(ann.type)) { const a = ann as LineAnn; return { ...a, x1: a.x1+dx, y1: a.y1+dy, x2: a.x2+dx, y2: a.y2+dy }; }
    if (["signature","img"].includes(ann.type)) { const a = ann as ImgAnn; return { ...a, x: a.x+dx, y: a.y+dy }; }
    return ann;
  }

  function drawSelectionBox(ctx: CanvasRenderingContext2D, ann: Annotation) {
    const b = getAnnBounds(ann);
    const pad = 6;
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 3]);
    ctx.strokeRect(b.x - pad, b.y - pad, b.w + pad*2, b.h + pad*2);
    ctx.setLineDash([]);
    ctx.fillStyle = "#3b82f6";
    for (const [cx, cy] of [[b.x-pad, b.y-pad],[b.x+b.w+pad, b.y-pad],[b.x-pad, b.y+b.h+pad],[b.x+b.w+pad, b.y+b.h+pad]]) {
      ctx.fillRect(cx-4, cy-4, 8, 8);
    }
    ctx.restore();
  }

  // ── ANNOTATION RENDERING ──────────────────────────────────────────────
  function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const h = 14;
    ctx.beginPath();
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - h * Math.cos(a - Math.PI / 6), y2 - h * Math.sin(a - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - h * Math.cos(a + Math.PI / 6), y2 - h * Math.sin(a + Math.PI / 6));
    ctx.stroke();
  }

  function drawOneAnn(ctx: CanvasRenderingContext2D, ann: Annotation, triggerRerender: () => void) {
    ctx.save();
    ctx.globalAlpha = ann.opacity ?? 1;
    if (ann.type === "text") {
      const wt = ann.bold ? "bold" : "normal";
      const st = ann.italic ? "italic" : "normal";
      ctx.font      = `${st} ${wt} ${ann.fontSize}px "${ann.fontFamily}"`;
      ctx.fillStyle = ann.color;
      ctx.fillText(ann.text, ann.x, ann.y);
      if (ann.underline) {
        const m = ctx.measureText(ann.text);
        ctx.strokeStyle = ann.color; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ann.x, ann.y + 3); ctx.lineTo(ann.x + m.width, ann.y + 3);
        ctx.stroke();
      }
    } else if (ann.type === "draw") {
      if (ann.points.length < 2) { ctx.restore(); return; }
      ctx.strokeStyle = ann.color; ctx.lineWidth = ann.lineWidth;
      ctx.lineCap = ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(ann.points[0].x, ann.points[0].y);
      for (let i = 1; i < ann.points.length; i++) ctx.lineTo(ann.points[i].x, ann.points[i].y);
      ctx.stroke();
    } else if (ann.type === "rectangle") {
      ctx.strokeStyle = ann.color; ctx.lineWidth = 2;
      ctx.strokeRect(ann.x, ann.y, ann.w, ann.h);
    } else if (ann.type === "ellipse") {
      ctx.strokeStyle = ann.color; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(ann.x + ann.w / 2, ann.y + ann.h / 2, Math.abs(ann.w / 2), Math.abs(ann.h / 2), 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (ann.type === "highlight") {
      ctx.globalAlpha = 0.4; ctx.fillStyle = "#FFE000";
      ctx.fillRect(ann.x, ann.y, ann.w, ann.h);
    } else if (ann.type === "whiteout") {
      ctx.globalAlpha = 1; ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(ann.x, ann.y, ann.w, ann.h);
    } else if (ann.type === "line") {
      ctx.strokeStyle = ann.color; ctx.lineWidth = ann.lineWidth;
      ctx.beginPath(); ctx.moveTo(ann.x1, ann.y1); ctx.lineTo(ann.x2, ann.y2); ctx.stroke();
    } else if (ann.type === "arrow") {
      ctx.strokeStyle = ann.color; ctx.lineWidth = ann.lineWidth;
      drawArrow(ctx, ann.x1, ann.y1, ann.x2, ann.y2);
    } else if (ann.type === "signature" || ann.type === "img") {
      const img = new window.Image();
      img.src = ann.dataUrl;
      if (img.complete) {
        ctx.drawImage(img, ann.x, ann.y, ann.w, ann.h);
      } else {
        img.onload = () => triggerRerender();
      }
    }
    ctx.restore();
  }

  const renderAnnotations = useCallback((
    preview?: { type: ToolType; x?: number; y?: number; x2?: number; y2?: number; points?: { x: number; y: number }[] },
    selDelta?: { dx: number; dy: number }
  ) => {
    const oc = overlayCanvasRef.current;
    if (!oc || !oc.width) return;
    const dpr  = window.devicePixelRatio || 1;
    const cssW = oc.clientWidth;
    const ctx  = oc.getContext("2d")!;
    ctx.clearRect(0, 0, oc.width, oc.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const trigger = () => renderAnnotations();
    const selId = selectedIdRef.current; // always fresh — never stale
    const pageAnnotations = annotations.filter(a => a.page === currentPage);
    let selectedAnn: Annotation | undefined;

    for (const ann of pageAnnotations) {
      if (ann.id === selId) selectedAnn = ann;
      const toRender = (selId && ann.id === selId && selDelta)
        ? moveAnnotation(ann, selDelta.dx, selDelta.dy) : ann;
      drawOneAnn(ctx, toRender, trigger);
    }

    if (preview) {
      ctx.save();
      ctx.globalAlpha = opacity;
      const { type, x = 0, y = 0, x2 = 0, y2 = 0, points } = preview;
      const w = x2 - x, h = y2 - y;
      if (type === "rectangle") {
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
      } else if (type === "ellipse") {
        ctx.strokeStyle = color; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2); ctx.stroke();
      } else if (type === "highlight") {
        ctx.globalAlpha = 0.4; ctx.fillStyle = "#FFE000"; ctx.fillRect(x, y, w, h);
      } else if (type === "whiteout") {
        ctx.globalAlpha = 1; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h);
      } else if (type === "line") {
        ctx.strokeStyle = color; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
      } else if (type === "arrow") {
        ctx.strokeStyle = color; ctx.lineWidth = 2;
        drawArrow(ctx, x, y, x2, y2);
      } else if (type === "draw" && points && points.length >= 2) {
        ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.lineCap = ctx.lineJoin = "round";
        ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();
      }
      ctx.restore();
    }
    // Draw hover highlight (only when not selected)
    const hovId = hoveredIdRef.current;
    if (hovId && hovId !== selId) {
      const hovAnn = pageAnnotations.find(a => a.id === hovId);
      if (hovAnn) {
        const b = getAnnBounds(hovAnn);
        const p = 5;
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = "#60a5fa";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(b.x - p, b.y - p, b.w + p * 2, b.h + p * 2);
        ctx.setLineDash([]);
        ctx.restore();
      }
    }

    // Draw selection box over everything
    if (selId && selectedAnn) {
      const displayAnn = selDelta ? moveAnnotation(selectedAnn, selDelta.dx, selDelta.dy) : selectedAnn;
      drawSelectionBox(ctx, displayAnn);
    }

    // Draw native text hover highlight
    const hovNat = hoveredNativeRef.current;
    if (hovNat) {
      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = "#60a5fa";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 2]);
      ctx.strokeRect(hovNat.x - 2, hovNat.y - 2, hovNat.w + 4, hovNat.h + 4);
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Draw native text selection
    const selNat = selectedNativeRef.current;
    if (selNat) {
      ctx.save();
      ctx.fillStyle = "rgba(59,130,246,0.10)";
      ctx.fillRect(selNat.x - 3, selNat.y - 3, selNat.w + 6, selNat.h + 6);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 2]);
      ctx.strokeRect(selNat.x - 3, selNat.y - 3, selNat.w + 6, selNat.h + 6);
      ctx.setLineDash([]);
      // "Double-click to edit" label
      ctx.font = "11px sans-serif";
      ctx.fillStyle = "#3b82f6";
      ctx.fillText("Double-click to edit", selNat.x, selNat.y - 6);
      ctx.restore();
    }

    ctx.restore();
    void cssW;
  }, [annotations, currentPage, color, opacity]); // selectedId intentionally omitted — read via ref

  // Sync ref and redraw whenever selection state changes
  useEffect(() => {
    selectedIdRef.current = selectedId;
    renderAnnotations();
  }, [selectedId, renderAnnotations]);

  useEffect(() => { renderAnnotations(); }, [renderAnnotations, renderCount]);

  // ── CANVAS MOUSE EVENTS ────────────────────────────────────────────────
  function getPos(e: React.MouseEvent<HTMLCanvasElement>) {
    const r = overlayCanvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const pos = getPos(e);

    if (activeTool === "select") {
      const pageAnns = annotations.filter(a => a.page === currentPage);
      const hit = [...pageAnns].reverse().find(a => hitTest(a, pos.x, pos.y));
      if (hit) {
        // Annotation hit — select it and enable drag
        selectedNativeRef.current = null;
        selectedIdRef.current = hit.id;
        setSelectedId(hit.id);
        isDrawing.current = true;
        dragStart.current = pos;
        renderAnnotations();
      } else {
        // No annotation hit — check native PDF text
        const nativeItems = nativeTextRef.current.get(currentPage) ?? [];
        const nativeHit = [...nativeItems].reverse().find(item => hitTestNative(item, pos.x, pos.y)) ?? null;
        selectedNativeRef.current = nativeHit;
        selectedIdRef.current = null;
        setSelectedId(null);
        renderAnnotations();
      }
      return;
    }

    if (activeTool === "text") {
      setSelectedId(null);
      setTextPos({ cx: pos.x, cy: pos.y });
      setTextVal("");
      setTimeout(() => textareaRef.current?.focus(), 10);
      return;
    }
    if (activeTool === "signature") {
      setSigClickPos({ cx: pos.x, cy: pos.y });
      if (sigCanvasRef.current) {
        const c = sigCanvasRef.current;
        c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
        sigHasData.current = false;
      }
      return;
    }
    if (activeTool === "image") {
      if (pendingImg.current) {
        pushHistory([...annotations, { id: uid(), page: currentPage, type: "img", x: pos.x - 100, y: pos.y - 75, w: 200, h: 150, dataUrl: pendingImg.current, opacity }]);
        pendingImg.current = null;
      } else {
        imgInputRef.current?.click();
      }
      return;
    }
    isDrawing.current = true;
    dragStart.current = pos;
    curPath.current   = [pos];
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const pos = getPos(e);

    // Hover detection for Select tool — runs even when not actively dragging
    if (activeTool === "select" && !isDrawing.current) {
      const pageAnns = annotations.filter(a => a.page === currentPage);
      const hit = [...pageAnns].reverse().find(a => hitTest(a, pos.x, pos.y));
      const newId = hit?.id ?? null;

      // Also check native PDF text when no annotation is hovered
      let newNative: PdfTextItem | null = null;
      if (!newId) {
        const nativeItems = nativeTextRef.current.get(currentPage) ?? [];
        newNative = [...nativeItems].reverse().find(item => hitTestNative(item, pos.x, pos.y)) ?? null;
      }

      if (newId !== hoveredIdRef.current || newNative !== hoveredNativeRef.current) {
        hoveredIdRef.current = newId;
        hoveredNativeRef.current = newNative;
        renderAnnotations();
      }
      if (overlayCanvasRef.current) {
        overlayCanvasRef.current.style.cursor = (newId || newNative) ? "pointer" : "default";
      }
      return;
    }

    if (!isDrawing.current) return;
    const s = dragStart.current;

    if (activeTool === "select") {
      if (selectedIdRef.current) {
        const dx = pos.x - s.x, dy = pos.y - s.y;
        renderAnnotations(undefined, { dx, dy });
      }
      return;
    }
    if (activeTool === "draw") {
      curPath.current.push(pos);
      renderAnnotations({ type: "draw", x: s.x, y: s.y, x2: pos.x, y2: pos.y, points: [...curPath.current] });
    } else {
      renderAnnotations({ type: activeTool, x: s.x, y: s.y, x2: pos.x, y2: pos.y });
    }
  }

  function onMouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const pos = getPos(e);
    const s   = dragStart.current;

    if (activeTool === "select") {
      const selId = selectedIdRef.current;
      if (selId) {
        const dx = pos.x - s.x, dy = pos.y - s.y;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          pushHistory(annotations.map(a => a.id === selId ? moveAnnotation(a, dx, dy) : a));
        }
      }
      renderAnnotations();
      return;
    }

    if (activeTool === "draw") {
      if (curPath.current.length < 2) { renderAnnotations(); return; }
      pushHistory([...annotations, { id: uid(), page: currentPage, type: "draw", points: [...curPath.current], color, opacity, lineWidth: 3 }]);
    } else if (["rectangle", "ellipse", "highlight", "whiteout"].includes(activeTool)) {
      const x = Math.min(s.x, pos.x), y = Math.min(s.y, pos.y);
      const w = Math.abs(pos.x - s.x),  h = Math.abs(pos.y - s.y);
      if (w < 4 || h < 4) { renderAnnotations(); return; }
      pushHistory([...annotations, { id: uid(), page: currentPage, type: activeTool as ShapeAnn["type"], x, y, w, h, color, opacity }]);
    } else if (["line", "arrow"].includes(activeTool)) {
      pushHistory([...annotations, { id: uid(), page: currentPage, type: activeTool as LineAnn["type"], x1: s.x, y1: s.y, x2: pos.x, y2: pos.y, color, opacity, lineWidth: 2 }]);
    }
    curPath.current = [];
  }

  // ── TEXT COMMIT ───────────────────────────────────────────────────────
  function commitText() {
    if (editingTextId) {
      // Editing an existing annotation
      if (textVal.trim()) {
        pushHistory(annotations.map(a =>
          a.id === editingTextId
            ? { ...a as TextAnn, text: textVal, fontFamily, fontSize, bold, italic, underline, color, opacity }
            : a
        ));
      } else {
        pushHistory(annotations.filter(a => a.id !== editingTextId));
      }
      nativeEditBaselineRef.current = null;
      setEditingTextId(null);
      setTextPos(null);
      setTextVal("");
      return;
    }
    if (textVal.trim() && textPos) {
      // Use locked baseline if editing native text (avoids fontSize-state timing race)
      const baselineY = nativeEditBaselineRef.current ?? (textPos.cy + fontSize);
      nativeEditBaselineRef.current = null;
      pushHistory([...annotations, {
        id: uid(), page: currentPage, type: "text",
        x: textPos.cx, y: baselineY,
        text: textVal, fontFamily, fontSize, bold, italic, underline, color, opacity,
      }]);
    }
    setTextPos(null);
    setTextVal("");
  }

  // ── DOUBLE-CLICK: edit existing text annotation ───────────────────────
  function onDblClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (activeTool !== "select") return;
    const pos = getPos(e);

    // Check annotation text first
    const pageAnns = annotations.filter(a => a.page === currentPage);
    const hit = [...pageAnns].reverse().find(a => hitTest(a, pos.x, pos.y));
    if (hit?.type === "text") {
      setEditingTextId(hit.id);
      setTextPos({ cx: hit.x, cy: hit.y - hit.fontSize });
      setTextVal(hit.text);
      setFontFamily(hit.fontFamily);
      setFontSize(hit.fontSize);
      setBold(hit.bold);
      setItalic(hit.italic);
      setUnderline(hit.underline);
      setColor(hit.color);
      setOpacity(hit.opacity);
      setTimeout(() => textareaRef.current?.focus(), 10);
      return;
    }

    // Check native PDF text — double-click to edit existing PDF text
    const nativeItems = nativeTextRef.current.get(currentPage) ?? [];
    const nativeHit = [...nativeItems].reverse().find(item => hitTestNative(item, pos.x, pos.y));
    if (nativeHit) {
      // Detect original formatting from the font name and canvas pixels
      const fmt   = parseFontName(nativeHit.fontName);
      const col   = sampleTextColor(nativeHit);
      const fs    = Math.round(nativeHit.fontSize);
      const baseline = nativeHit.y + nativeHit.fontSize; // exact y of text baseline

      // Place a whiteout over the original text (wide enough to fully cover)
      const whiteout: ShapeAnn = {
        id: uid(), page: currentPage, type: "whiteout",
        x: nativeHit.x - 2,     y: nativeHit.y - 2,
        w: nativeHit.w + 4,     h: nativeHit.h + 4,
        color: "#FFFFFF", opacity: 1,
      };
      pushHistory([...annotations, whiteout]);

      // Lock baseline before async state updates change fontSize
      nativeEditBaselineRef.current = baseline;
      selectedNativeRef.current = null;
      setEditingTextId(null);

      // Apply matching formatting so the replacement text looks the same
      setFontFamily(fmt.family);
      setFontSize(fs);
      setBold(fmt.bold);
      setItalic(fmt.italic);
      setUnderline(false);
      setColor(col);
      setOpacity(1);

      // Open textarea at the top of the glyph box, pre-filled with original text
      setTextPos({ cx: nativeHit.x, cy: nativeHit.y });
      setTextVal(nativeHit.str);
      setTimeout(() => textareaRef.current?.focus(), 10);
    }
  }

  // ── SIGNATURE ─────────────────────────────────────────────────────────
  function onSigDown(e: React.MouseEvent<HTMLCanvasElement>) {
    sigDrawing.current = true;
    const c = sigCanvasRef.current!;
    const r = c.getBoundingClientRect();
    const sx = c.width / r.width, sy = c.height / r.height;
    sigLastPos.current = { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
  }
  function onSigMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!sigDrawing.current || !sigLastPos.current || !sigCanvasRef.current) return;
    const c = sigCanvasRef.current;
    const r = c.getBoundingClientRect();
    const sx = c.width / r.width, sy = c.height / r.height;
    const pos = { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
    const ctx = c.getContext("2d")!;
    ctx.strokeStyle = "#1a1e2e"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(sigLastPos.current.x, sigLastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    sigLastPos.current = pos;
    sigHasData.current = true;
  }
  function onSigUp() { sigDrawing.current = false; sigLastPos.current = null; }
  function clearSig() {
    const c = sigCanvasRef.current;
    if (c) { c.getContext("2d")!.clearRect(0, 0, c.width, c.height); sigHasData.current = false; }
  }
  function applySig() {
    if (!sigClickPos || !sigCanvasRef.current || !sigHasData.current) return;
    const dataUrl = sigCanvasRef.current.toDataURL("image/png");
    pushHistory([...annotations, { id: uid(), page: currentPage, type: "signature", x: sigClickPos.cx - 100, y: sigClickPos.cy - 60, w: 200, h: 70, dataUrl, opacity: 1 }]);
    setSigClickPos(null);
    sigHasData.current = false;
  }

  // ── IMAGE UPLOAD ──────────────────────────────────────────────────────
  function onImgFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => { pendingImg.current = ev.target?.result as string; };
    reader.readAsDataURL(f);
    e.target.value = "";
  }

  // ── DOWNLOAD ──────────────────────────────────────────────────────────
  async function download() {
    if (!file) return;
    setProcessing(true); setError("");
    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const doc   = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = doc.getPages();
      const font  = await doc.embedFont(StandardFonts.Helvetica);

      function hexRgb(h: string): [number, number, number] {
        const n = parseInt(h.replace("#", ""), 16);
        return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
      }

      for (const ann of annotations) {
        const pdfPage = pages[ann.page - 1];
        if (!pdfPage) continue;
        const { width: pW, height: pH } = pdfPage.getSize();
        const cs = pageSizes.current.get(ann.page) ?? { w: pW, h: pH };
        const sx = pW / cs.w, sy = pH / cs.h;
        const py = (cy: number) => pH - cy * sy;

        if (ann.type === "text") {
          pdfPage.drawText(ann.text, {
            x: ann.x * sx, y: py(ann.y),
            size: Math.max(4, ann.fontSize * Math.min(sx, sy)),
            font, color: rgb(...hexRgb(ann.color)), opacity: ann.opacity,
          });
        } else if (ann.type === "rectangle") {
          pdfPage.drawRectangle({ x: ann.x * sx, y: pH - (ann.y + ann.h) * sy, width: ann.w * sx, height: ann.h * sy, borderColor: rgb(...hexRgb(ann.color)), borderWidth: 2, opacity: ann.opacity });
        } else if (ann.type === "ellipse") {
          pdfPage.drawEllipse({ x: (ann.x + ann.w / 2) * sx, y: pH - (ann.y + ann.h / 2) * sy, xScale: Math.abs(ann.w / 2) * sx, yScale: Math.abs(ann.h / 2) * sy, borderColor: rgb(...hexRgb(ann.color)), borderWidth: 2, opacity: ann.opacity });
        } else if (ann.type === "highlight") {
          pdfPage.drawRectangle({ x: ann.x * sx, y: pH - (ann.y + ann.h) * sy, width: ann.w * sx, height: ann.h * sy, color: rgb(1, 0.88, 0), opacity: 0.4 });
        } else if (ann.type === "whiteout") {
          pdfPage.drawRectangle({ x: ann.x * sx, y: pH - (ann.y + ann.h) * sy, width: ann.w * sx, height: ann.h * sy, color: rgb(1, 1, 1), opacity: 1 });
        } else if (ann.type === "line" || ann.type === "arrow") {
          pdfPage.drawLine({ start: { x: ann.x1 * sx, y: py(ann.y1) }, end: { x: ann.x2 * sx, y: py(ann.y2) }, color: rgb(...hexRgb(ann.color)), thickness: ann.lineWidth, opacity: ann.opacity });
        } else if (ann.type === "draw") {
          for (let i = 0; i < ann.points.length - 1; i++) {
            pdfPage.drawLine({ start: { x: ann.points[i].x * sx, y: py(ann.points[i].y) }, end: { x: ann.points[i + 1].x * sx, y: py(ann.points[i + 1].y) }, color: rgb(...hexRgb(ann.color)), thickness: ann.lineWidth, opacity: ann.opacity });
          }
        } else if (ann.type === "signature" || ann.type === "img") {
          const b64  = ann.dataUrl.split(",")[1];
          const imgB = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
          const emb  = ann.dataUrl.includes("image/png") ? await doc.embedPng(imgB) : await doc.embedJpg(imgB);
          pdfPage.drawImage(emb, { x: ann.x * sx, y: pH - (ann.y + ann.h) * sy, width: ann.w * sx, height: ann.h * sy, opacity: ann.opacity });
        }
      }

      const out  = await doc.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "-edited.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed.");
    } finally {
      setProcessing(false);
    }
  }

  function getCursor() {
    if (activeTool === "select")    return "default";
    if (activeTool === "text")      return "text";
    if (activeTool === "image")     return pendingImg.current ? "crosshair" : "pointer";
    if (activeTool === "signature") return "crosshair";
    return "crosshair";
  }

  function resetEditor() {
    setFile(null); setAnnotations([]); setTotalPages(0); setThumbUrls([]);
    pdfDocRef.current = null; pageSizes.current.clear();
    nativeTextRef.current.clear();
    histStack.current = [[]]; histIdx.current = 0;
    setZoom(1.0); setPdfReady(0); setSelectedId(null); setEditingTextId(null);
    selectedIdRef.current = null; selectedNativeRef.current = null;
    hoveredIdRef.current = null; hoveredNativeRef.current = null;
  }

  // ── DROP ZONE ─────────────────────────────────────────────────────────
  if (!file) {
    return (
      <div>
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) loadFile(f); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all ${draggingOver ? "border-orange-400 bg-orange-50" : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"}`}
        >
          <div className="text-5xl mb-4">📄</div>
          <p className="font-semibold text-gray-700 mb-1">Click or drag a PDF here</p>
          <p className="text-sm text-gray-400">Visually edit, annotate, draw, and sign your PDF</p>
        </div>
        <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
        {error && <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
      </div>
    );
  }

  // ── EDITOR ────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">

      {/* ── TOOLBAR ── */}
      <div className="bg-[#1a1e2e] text-white flex items-center flex-shrink-0 overflow-x-auto" style={{ minHeight: 54 }}>

        {/* Tool buttons */}
        <div className="flex items-center border-r border-white/10 px-1 py-1 gap-0.5 flex-shrink-0">
          {TOOLS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTool(id); setSelectedId(null); selectedIdRef.current = null; hoveredIdRef.current = null; selectedNativeRef.current = null; hoveredNativeRef.current = null; setEditingTextId(null); if (id === "image" && !pendingImg.current) imgInputRef.current?.click(); }}
              title={label}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded text-[10px] transition-colors whitespace-nowrap ${activeTool === id ? "bg-orange-500 text-white" : "text-gray-300 hover:bg-white/10"}`}
            >
              <Icon size={15} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Divider + font controls */}
        <div className="flex items-center gap-1 px-2 border-r border-white/10 flex-shrink-0">
          <select value={fontFamily} onChange={e => setFontFamily(e.target.value)}
            className="bg-[#2a2e42] text-white text-xs rounded px-1.5 py-1 border border-white/10 outline-none w-28">
            {FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <input type="number" value={fontSize} min={6} max={96}
            onChange={e => setFontSize(Number(e.target.value))}
            className="bg-[#2a2e42] text-white text-xs rounded px-1 py-1 border border-white/10 outline-none w-11 text-center" />
          <input type="number" value={400} readOnly title="Font Weight (display only)"
            className="bg-[#2a2e42] text-white text-xs rounded px-1 py-1 border border-white/10 outline-none w-11 text-center opacity-50 cursor-not-allowed" />
          <button onClick={() => setBold(b => !b)}
            className={`p-1.5 rounded transition-colors ${bold ? "bg-orange-500" : "hover:bg-white/10"}`} title="Bold">
            <Bold size={13} />
          </button>
          <button onClick={() => setItalic(b => !b)}
            className={`p-1.5 rounded transition-colors ${italic ? "bg-orange-500" : "hover:bg-white/10"}`} title="Italic">
            <Italic size={13} />
          </button>
          <button onClick={() => setUnderline(b => !b)}
            className={`p-1.5 rounded transition-colors ${underline ? "bg-orange-500" : "hover:bg-white/10"}`} title="Underline">
            <UnderlineIcon size={13} />
          </button>
          <div className="flex items-center gap-1 ml-1" title="Color">
            <span className="text-xs text-gray-400 font-bold">A</span>
            <input type="color" value={color} onChange={e => setColor(e.target.value)}
              className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent" />
          </div>
          <div className="flex items-center gap-1 ml-1">
            <span className="text-[10px] text-gray-400">Opacity</span>
            <input type="range" min={0} max={1} step={0.05} value={opacity}
              onChange={e => setOpacity(Number(e.target.value))}
              className="w-16 accent-orange-400" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 px-2 ml-auto flex-shrink-0">
          <button onClick={() => setShowFind(f => !f)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs transition-colors ${showFind ? "bg-white/20" : "text-gray-300 hover:bg-white/10"}`}>
            <Search size={13} /><span>Find</span>
          </button>
          <button onClick={undo} title="Undo (Ctrl+Z)"
            className="flex items-center gap-1 px-2 py-1.5 rounded text-xs text-gray-300 hover:bg-white/10 transition-colors">
            <Undo2 size={13} /><span>Undo</span>
          </button>
          <button onClick={redo} title="Redo (Ctrl+Y)"
            className="flex items-center gap-1 px-2 py-1.5 rounded text-xs text-gray-300 hover:bg-white/10 transition-colors">
            <Redo2 size={13} /><span>Redo</span>
          </button>
          <button onClick={download} disabled={processing}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors ml-1">
            {processing ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            <span>Download PDF</span>
          </button>
          <button onClick={resetEditor}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs text-gray-300 border border-white/10 hover:bg-white/10 transition-colors ml-1">
            <FolderOpen size={13} /><span>Open New PDF</span>
          </button>
        </div>
      </div>

      {/* Find bar */}
      {showFind && (
        <div className="bg-[#2a2e42] text-white flex items-center gap-2 px-4 py-1.5 flex-shrink-0">
          <Search size={13} className="text-gray-400" />
          <input autoFocus type="text" placeholder="Find in PDF…"
            className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1" />
          <button onClick={() => setShowFind(false)} className="text-gray-400 hover:text-white transition-colors"><X size={14} /></button>
        </div>
      )}

      {/* ── BODY ── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Left: thumbnails */}
        <div className="w-[72px] bg-[#23273a] flex flex-col items-center py-2 gap-2 overflow-y-auto flex-shrink-0">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest">Pages</p>
          {thumbUrls.length === 0 && totalPages > 0 && (
            <Loader2 size={14} className="animate-spin text-gray-500 mt-2" />
          )}
          {thumbUrls.map((url, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)}
              className={`flex flex-col items-center gap-0.5 p-0.5 rounded border-2 transition-colors w-14 ${currentPage === i + 1 ? "border-orange-400" : "border-transparent hover:border-gray-500"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Page ${i + 1}`} className="w-full rounded" />
              <span className="text-[9px] text-gray-400">{i + 1}</span>
            </button>
          ))}
        </div>

        {/* Main canvas area */}
        <div className="flex-1 bg-[#525659] overflow-auto flex flex-col items-center py-4 px-6 gap-4 relative">

          {/* Page nav — sticky at top */}
          <div className="sticky top-0 z-10 flex items-center gap-3 bg-black/40 backdrop-blur-sm text-white text-xs rounded-full px-5 py-2 flex-shrink-0 shadow">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}
              className="disabled:opacity-30 hover:opacity-70 transition-opacity font-medium">‹ Prev</button>
            <span className="font-medium">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}
              className="disabled:opacity-30 hover:opacity-70 transition-opacity font-medium">Next ›</button>
          </div>

          {/* Canvas */}
          <div className="relative shadow-2xl flex-shrink-0">
            <canvas ref={pdfCanvasRef} className="block bg-white" />
            <canvas
              ref={overlayCanvasRef}
              className="absolute inset-0"
              style={{ cursor: getCursor() }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={e => {
                if (isDrawing.current) onMouseUp(e);
                if (hoveredIdRef.current || hoveredNativeRef.current) {
                  hoveredIdRef.current = null;
                  hoveredNativeRef.current = null;
                  renderAnnotations();
                }
                if (overlayCanvasRef.current) overlayCanvasRef.current.style.cursor = "default";
              }}
              onDoubleClick={onDblClick}
              onContextMenu={e => e.preventDefault()}
            />
            {/* Text input overlay */}
            {textPos && (
              <textarea
                ref={textareaRef}
                value={textVal}
                onChange={e => setTextVal(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commitText(); }
                  if (e.key === "Escape") { nativeEditBaselineRef.current = null; setTextPos(null); setTextVal(""); setEditingTextId(null); }
                }}
                onBlur={commitText}
                style={{
                  position: "absolute",
                  left: textPos.cx,
                  top: textPos.cy,
                  font: `${italic ? "italic " : ""}${bold ? "bold " : ""}${fontSize}px "${fontFamily}"`,
                  color,
                  opacity,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px dashed rgba(0,0,0,0.4)",
                  outline: "none",
                  minWidth: 120,
                  minHeight: 32,
                  resize: "none",
                  padding: "2px 4px",
                  lineHeight: 1.4,
                  zIndex: 10,
                }}
              />
            )}
          </div>

          {/* Bottom spacer */}
          <div className="h-16 flex-shrink-0" />
        </div>

        {/* Zoom controls — fixed bottom-right of the main area */}
        <div className="absolute bottom-5 right-5 flex items-center gap-1 bg-[#1a1e2e]/90 backdrop-blur-sm text-white rounded-full px-3 py-1.5 shadow-xl text-sm select-none z-20">
          <button
            onClick={() => setZoom(z => Math.max(0.25, parseFloat((z - 0.25).toFixed(2))))}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors font-bold text-base leading-none"
            title="Zoom out"
          >−</button>
          <button
            onClick={() => setZoom(1.0)}
            className="w-16 text-center text-xs hover:bg-white/10 rounded-full py-0.5 transition-colors"
            title="Reset zoom"
          >{Math.round(zoom * 100)}%</button>
          <button
            onClick={() => setZoom(z => Math.min(4, parseFloat((z + 0.25).toFixed(2))))}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors font-bold text-base leading-none"
            title="Zoom in"
          >+</button>
        </div>
      </div>

      {/* Error toast */}
      {error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm text-center">
          {error}
        </div>
      )}

      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
      <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={onImgFile} />

      {/* ── SIGNATURE MODAL ── */}
      {sigClickPos && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-[500px] max-w-[92vw]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Draw Your Signature</h3>
              <button onClick={() => setSigClickPos(null)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            <canvas
              ref={sigCanvasRef}
              width={460}
              height={180}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl cursor-crosshair bg-gray-50"
              style={{ touchAction: "none" }}
              onMouseDown={onSigDown}
              onMouseMove={onSigMove}
              onMouseUp={onSigUp}
              onMouseLeave={onSigUp}
            />
            <p className="text-xs text-gray-400 mt-2 text-center">Draw your signature in the box above</p>
            <div className="flex gap-3 mt-4 justify-end">
              <button onClick={clearSig}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Clear
              </button>
              <button onClick={applySig}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors">
                Apply Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
