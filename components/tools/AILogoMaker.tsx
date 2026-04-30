"use client";

import { useState, useEffect } from "react";
import { Download, Shuffle } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
type Layout      = "horizontal" | "stacked" | "icon-only" | "text-only";
type Shape       = "circle" | "hexagon" | "diamond" | "star" | "shield" | "ring" | "square" | "triangle" | "bolt" | "leaf" | "badge" | "none";
type FontStyle   = "modern" | "serif" | "bold" | "rounded" | "mono";
type GradientDir = "ltr" | "ttb" | "diagonal" | "radial";
type BgStyle     = "solid" | "transparent" | "gradient";

interface Config {
  brand: string;
  tagline: string;
  layout: Layout;
  shape: Shape;
  showInitials: boolean;
  fontStyle: FontStyle;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  bgColor: string;
  bgStyle: BgStyle;
  bgGradFrom: string;
  bgGradTo: string;
  useGradient: boolean;
  gradientDir: GradientDir;
  borderRadius: number;
  shadowEnabled: boolean;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const FONTS: Record<FontStyle, string> = {
  modern:  "Helvetica Neue, Arial, sans-serif",
  serif:   "Georgia, Times New Roman, serif",
  bold:    "Impact, Arial Black, sans-serif",
  rounded: "Trebuchet MS, Arial Rounded MT Bold, sans-serif",
  mono:    "'Courier New', Courier, monospace",
};

const FONT_LABELS: Record<FontStyle, string> = {
  modern: "Modern", serif: "Serif", bold: "Bold", rounded: "Rounded", mono: "Mono",
};

const DEFAULT: Config = {
  brand: "", tagline: "", layout: "horizontal", shape: "hexagon", showInitials: true,
  fontStyle: "modern", primaryColor: "#3b82f6", secondaryColor: "#06b6d4",
  textColor: "#111827", bgColor: "#ffffff", bgStyle: "solid",
  bgGradFrom: "#f8fafc", bgGradTo: "#e0f2fe",
  useGradient: false, gradientDir: "ltr", borderRadius: 12, shadowEnabled: false,
};

const PRESETS: Array<{ name: string; config: Partial<Config> }> = [
  { name: "Tech Dark",     config: { primaryColor: "#3b82f6", secondaryColor: "#06b6d4",  textColor: "#f8fafc",  bgColor: "#0f172a", bgStyle: "solid",    shape: "hexagon",  fontStyle: "modern",  layout: "horizontal", useGradient: true,  gradientDir: "ltr",      showInitials: true  } },
  { name: "Purple Glow",   config: { primaryColor: "#7c3aed", secondaryColor: "#ec4899",  textColor: "#1e1b4b",  bgColor: "#fdf4ff", bgStyle: "solid",    shape: "circle",   fontStyle: "bold",    layout: "horizontal", useGradient: true,  gradientDir: "diagonal", showInitials: true  } },
  { name: "Luxury Gold",   config: { primaryColor: "#b45309", secondaryColor: "#fbbf24",  textColor: "#fbbf24",  bgColor: "#1a1a1a", bgStyle: "solid",    shape: "diamond",  fontStyle: "serif",   layout: "horizontal", useGradient: true,  gradientDir: "ltr",      showInitials: false } },
  { name: "Nature Green",  config: { primaryColor: "#16a34a", secondaryColor: "#86efac",  textColor: "#14532d",  bgColor: "#f0fdf4", bgStyle: "solid",    shape: "leaf",     fontStyle: "serif",   layout: "stacked",    useGradient: false, gradientDir: "ltr",      showInitials: false } },
  { name: "Electric",      config: { primaryColor: "#dc2626", secondaryColor: "#fb923c",  textColor: "#111827",  bgColor: "#fff7ed", bgStyle: "solid",    shape: "bolt",     fontStyle: "bold",    layout: "horizontal", useGradient: true,  gradientDir: "ltr",      showInitials: false } },
  { name: "Ocean",         config: { primaryColor: "#0ea5e9", secondaryColor: "#2563eb",  textColor: "#0c4a6e",  bgColor: "#f0f9ff", bgStyle: "solid",    shape: "ring",     fontStyle: "modern",  layout: "horizontal", useGradient: true,  gradientDir: "ttb",      showInitials: true  } },
  { name: "Minimal",       config: { primaryColor: "#111827", secondaryColor: "#6b7280",  textColor: "#111827",  bgColor: "#ffffff", bgStyle: "solid",    shape: "square",   fontStyle: "modern",  layout: "horizontal", useGradient: false, gradientDir: "ltr",      showInitials: true  } },
  { name: "Playful",       config: { primaryColor: "#ec4899", secondaryColor: "#f43f5e",  textColor: "#500724",  bgColor: "#fff1f2", bgStyle: "solid",    shape: "star",     fontStyle: "rounded", layout: "stacked",    useGradient: true,  gradientDir: "diagonal", showInitials: false } },
  { name: "Sunset",        config: { primaryColor: "#f97316", secondaryColor: "#db2777",  textColor: "#1c1917",  bgGradFrom: "#fef3c7", bgGradTo: "#fce7f3", bgStyle: "gradient", shape: "circle", fontStyle: "bold", layout: "horizontal", useGradient: true, gradientDir: "ltr", showInitials: true } },
  { name: "Midnight",      config: { primaryColor: "#818cf8", secondaryColor: "#c084fc",  textColor: "#e0e7ff",  bgGradFrom: "#0f0c29", bgGradTo: "#302b63", bgStyle: "gradient", shape: "shield", fontStyle: "modern", layout: "horizontal", useGradient: true, gradientDir: "diagonal", showInitials: true } },
  { name: "Forest",        config: { primaryColor: "#059669", secondaryColor: "#34d399",  textColor: "#065f46",  bgColor: "#ecfdf5", bgStyle: "solid",    shape: "badge",    fontStyle: "rounded", layout: "stacked",    useGradient: true,  gradientDir: "ttb",      showInitials: true  } },
  { name: "Monochrome",    config: { primaryColor: "#374151", secondaryColor: "#9ca3af",  textColor: "#111827",  bgColor: "#f9fafb", bgStyle: "solid",    shape: "triangle", fontStyle: "modern",  layout: "horizontal", useGradient: false, gradientDir: "ltr",      showInitials: false } },
];

// ── SVG Helpers ────────────────────────────────────────────────────────────────
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

function linearGrad(id: string, c1: string, c2: string, dir: GradientDir): string {
  if (dir === "radial") {
    return `<radialGradient id="${id}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></radialGradient>`;
  }
  const coords: Record<string, string> = {
    ltr:      'x1="0%" y1="0%" x2="100%" y2="0%"',
    ttb:      'x1="0%" y1="0%" x2="0%"   y2="100%"',
    diagonal: 'x1="0%" y1="0%" x2="100%" y2="100%"',
  };
  return `<linearGradient id="${id}" ${coords[dir] ?? coords.ltr}><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient>`;
}

function shapeEl(shape: Shape, cx: number, cy: number, r: number, fill: string): string {
  switch (shape) {
    case "circle":
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
    case "hexagon": {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
      }).join(" ");
      return `<polygon points="${pts}" fill="${fill}"/>`;
    }
    case "diamond":
      return `<polygon points="${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}" fill="${fill}"/>`;
    case "star": {
      const ir = r * 0.42;
      const pts = Array.from({ length: 10 }, (_, i) => {
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const rr = i % 2 === 0 ? r : ir;
        return `${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`;
      }).join(" ");
      return `<polygon points="${pts}" fill="${fill}"/>`;
    }
    case "shield":
      return `<path d="M${cx},${cy - r} L${cx + r * 0.82},${cy - r * 0.38} L${cx + r * 0.82},${cy + r * 0.2} Q${cx},${cy + r} ${cx - r * 0.82},${cy + r * 0.2} L${cx - r * 0.82},${cy - r * 0.38} Z" fill="${fill}"/>`;
    case "ring":
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${fill}" stroke-width="${r * 0.28}"/>`;
    case "square":
      return `<rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" rx="${r * 0.22}" fill="${fill}"/>`;
    case "triangle":
      return `<polygon points="${cx},${cy - r} ${cx + r},${cy + r * 0.72} ${cx - r},${cy + r * 0.72}" fill="${fill}"/>`;
    case "bolt":
      return `<path d="M${cx + r * 0.2},${cy - r} L${cx - r * 0.28},${cy + r * 0.1} L${cx + r * 0.08},${cy + r * 0.1} L${cx - r * 0.2},${cy + r} L${cx + r * 0.44},${cy - r * 0.1} L${cx},${cy - r * 0.1} Z" fill="${fill}"/>`;
    case "leaf":
      return `<path d="M${cx},${cy - r} C${cx + r * 1.1},${cy - r * 0.8} ${cx + r * 1.1},${cy + r * 0.8} ${cx},${cy + r} C${cx - r * 1.1},${cy + r * 0.8} ${cx - r * 1.1},${cy - r * 0.8} ${cx},${cy - r} Z" fill="${fill}"/>`;
    case "badge": {
      const pts = Array.from({ length: 16 }, (_, i) => {
        const a = (Math.PI / 8) * i;
        const rr = i % 2 === 0 ? r : r * 0.88;
        return `${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`;
      }).join(" ");
      return `<polygon points="${pts}" fill="${fill}"/>`;
    }
    default:
      return "";
  }
}

function renderIcon(shape: Shape, cx: number, cy: number, r: number, fill: string, initials: string, showInitials: boolean, font: string, primaryColor: string): string {
  if (shape === "none") return "";
  const base = shapeEl(shape, cx, cy, r, fill);
  if (!base) return "";
  const shine = shape !== "ring"
    ? `<circle cx="${(cx - r * 0.26).toFixed(1)}" cy="${(cy - r * 0.3).toFixed(1)}" r="${(r * 0.11).toFixed(1)}" fill="rgba(255,255,255,0.18)"/>`
    : "";
  const initFill = isLight(primaryColor) ? "rgba(0,0,0,0.72)" : "rgba(255,255,255,0.95)";
  const initialsEl = showInitials && initials
    ? `<text x="${cx}" y="${cy}" font-family="${font}" font-size="${(r * (initials.length > 1 ? 0.7 : 0.85)).toFixed(1)}" font-weight="800" fill="${initFill}" text-anchor="middle" dominant-baseline="central" letter-spacing="-1">${esc(initials)}</text>`
    : "";
  return base + shine + initialsEl;
}

function makeSVG(cfg: Config): string {
  const brand   = cfg.brand.trim() || "Brand";
  const tagline = cfg.tagline.trim();
  const initials = brand.split(/\s+/).map(w => w[0]?.toUpperCase() ?? "").join("").slice(0, 2);
  const font     = FONTS[cfg.fontStyle];
  const shapeFill = cfg.useGradient ? "url(#sf)" : cfg.primaryColor;

  // Canvas dimensions
  const dims = { horizontal: [500, 180], stacked: [340, 300], "icon-only": [220, 220], "text-only": [500, 170] };
  const [W, H] = dims[cfg.layout] ?? dims.horizontal;

  // Defs
  const defsContent: string[] = [];
  if (cfg.useGradient) defsContent.push(linearGrad("sf", cfg.primaryColor, cfg.secondaryColor, cfg.gradientDir));
  if (cfg.bgStyle === "gradient") defsContent.push(linearGrad("bg", cfg.bgGradFrom, cfg.bgGradTo, "diagonal"));
  if (cfg.shadowEnabled) defsContent.push(`<filter id="drop" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="rgba(0,0,0,0.18)"/></filter>`);
  const defs = defsContent.length ? `<defs>${defsContent.join("")}</defs>` : "";

  // Background
  const rx = cfg.bgStyle !== "transparent" ? cfg.borderRadius : 0;
  let bg = "";
  if (cfg.bgStyle === "solid")    bg = `<rect width="${W}" height="${H}" rx="${rx}" fill="${cfg.bgColor}"/>`;
  if (cfg.bgStyle === "gradient") bg = `<rect width="${W}" height="${H}" rx="${rx}" fill="url(#bg)"/>`;

  const filterAttr = cfg.shadowEnabled && cfg.bgStyle !== "transparent" ? ' filter="url(#drop)"' : "";
  const bgEl = bg ? bg.replace("<rect", `<rect${filterAttr}`) : "";

  // Layout rendering
  let shapeGroup = "";
  let textGroup  = "";

  if (cfg.layout === "horizontal") {
    const ir = H * 0.3;
    const cx = H * 0.5;
    const cy = H / 2;
    shapeGroup = renderIcon(cfg.shape, cx, cy, ir, shapeFill, initials, cfg.showInitials, font, cfg.primaryColor);
    const tx = cfg.shape !== "none" ? cx + ir + 20 : 28;
    const bs = H * 0.26;
    const ts = H * 0.125;
    const totalH = bs + (tagline ? ts + 6 : 0);
    const by = H / 2 - totalH / 2 + bs * 0.82;
    textGroup = `<text x="${tx}" y="${by.toFixed(1)}" font-family="${font}" font-size="${bs.toFixed(1)}" font-weight="700" fill="${cfg.textColor}">${esc(brand)}</text>`
      + (tagline ? `<text x="${tx}" y="${(by + bs * 0.32 + ts + 5).toFixed(1)}" font-family="${font}" font-size="${ts.toFixed(1)}" fill="${cfg.textColor}" opacity="0.52" letter-spacing="1.5">${esc(tagline.toUpperCase())}</text>` : "");
  } else if (cfg.layout === "stacked") {
    const ir = W * 0.22;
    const cx = W / 2;
    const cy = H * 0.37;
    shapeGroup = renderIcon(cfg.shape, cx, cy, ir, shapeFill, initials, cfg.showInitials, font, cfg.primaryColor);
    const bs = W * 0.105;
    const ts = W * 0.052;
    const by = cfg.shape !== "none" ? cy + ir + bs + 8 : H * 0.54;
    textGroup = `<text x="${cx}" y="${by.toFixed(1)}" font-family="${font}" font-size="${bs.toFixed(1)}" font-weight="700" fill="${cfg.textColor}" text-anchor="middle">${esc(brand)}</text>`
      + (tagline ? `<text x="${cx}" y="${(by + bs * 0.32 + ts + 5).toFixed(1)}" font-family="${font}" font-size="${ts.toFixed(1)}" fill="${cfg.textColor}" opacity="0.52" text-anchor="middle" letter-spacing="2">${esc(tagline.toUpperCase())}</text>` : "");
  } else if (cfg.layout === "icon-only") {
    const ir = Math.min(W, H) * 0.38;
    shapeGroup = renderIcon(cfg.shape, W / 2, H / 2, ir, shapeFill, initials, cfg.showInitials, font, cfg.primaryColor);
  } else {
    // text-only
    const gradFill = cfg.useGradient ? "url(#sf)" : cfg.textColor;
    const bs = H * 0.32;
    const ts = H * 0.155;
    const by = tagline ? H * 0.44 : H * 0.58;
    textGroup = `<text x="${W / 2}" y="${by.toFixed(1)}" font-family="${font}" font-size="${bs.toFixed(1)}" font-weight="700" fill="${gradFill}" text-anchor="middle">${esc(brand)}</text>`
      + (tagline ? `<text x="${W / 2}" y="${(by + bs * 0.28 + ts + 6).toFixed(1)}" font-family="${font}" font-size="${ts.toFixed(1)}" fill="${cfg.textColor}" opacity="0.52" text-anchor="middle" letter-spacing="3">${esc(tagline.toUpperCase())}</text>` : "");
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}${bgEl}${shapeGroup}${textGroup}</svg>`;
}

// ── Sub-component ──────────────────────────────────────────────────────────────
function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{label}</span>
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm">
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-0 p-0 bg-transparent"
          />
        </div>
        <input type="text" value={value} maxLength={7}
          onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) onChange(e.target.value); }}
          className="w-[72px] font-mono text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg px-2 py-1.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 uppercase"
        />
      </div>
    </div>
  );
}

// Shape preview icons (24×24 viewBox)
const SHAPE_ICONS: Array<{ key: Shape; label: string; d: string }> = [
  { key: "circle",   label: "Circle",   d: '<circle cx="12" cy="12" r="10" fill="currentColor"/>' },
  { key: "hexagon",  label: "Hexagon",  d: '<polygon points="12,2 20.5,7 20.5,17 12,22 3.5,17 3.5,7" fill="currentColor"/>' },
  { key: "diamond",  label: "Diamond",  d: '<polygon points="12,2 22,12 12,22 2,12" fill="currentColor"/>' },
  { key: "star",     label: "Star",     d: '<polygon points="12,2 14.4,9.3 22,9.3 16,14 18.4,21 12,16.6 5.6,21 8,14 2,9.3 9.6,9.3" fill="currentColor"/>' },
  { key: "shield",   label: "Shield",   d: '<path d="M12,2 L20,6 L20,14 Q12,22 4,14 L4,6 Z" fill="currentColor"/>' },
  { key: "ring",     label: "Ring",     d: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="3"/>' },
  { key: "square",   label: "Rounded",  d: '<rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor"/>' },
  { key: "triangle", label: "Triangle", d: '<polygon points="12,2 22,22 2,22" fill="currentColor"/>' },
  { key: "bolt",     label: "Bolt",     d: '<path d="M13,2 L5,14 L11,14 L11,22 L19,10 L13,10 Z" fill="currentColor"/>' },
  { key: "leaf",     label: "Leaf",     d: '<path d="M12,2 C18,2 18,22 12,22 C6,22 6,2 12,2 Z" fill="currentColor"/>' },
  { key: "badge",    label: "Badge",    d: '<path d="M12,2 L13.8,7.5 L19.6,7.5 L15,11 L16.8,16.5 L12,13 L7.2,16.5 L9,11 L4.4,7.5 L10.2,7.5 Z" fill="currentColor"/>' },
  { key: "none",     label: "None",     d: '<path d="M5,5 L19,19 M19,5 L5,19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AILogoMaker() {
  const [cfg, setCfg] = useState<Config>({ ...DEFAULT });
  const [svg, setSvg] = useState<string>(() => makeSVG({ ...DEFAULT, brand: "Brand" }));

  useEffect(() => {
    setSvg(makeSVG({ ...cfg, brand: cfg.brand.trim() || "Brand" }));
  }, [cfg]);

  function update(partial: Partial<Config>) {
    setCfg(prev => ({ ...prev, ...partial }));
  }

  function applyPreset(p: Partial<Config>) {
    setCfg(prev => ({ ...prev, ...p }));
  }

  function shuffle() {
    const p = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    applyPreset(p.config);
  }

  function downloadSVG() {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `${(cfg.brand || "logo").replace(/\s+/g, "-").toLowerCase()}.svg`;
    a.click(); URL.revokeObjectURL(url);
  }

  function downloadPNG() {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const img  = new Image();
    img.onload = () => {
      const scale = 3;
      const canvas = document.createElement("canvas");
      canvas.width  = img.width  * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d")!;
      if (cfg.bgStyle !== "transparent") { ctx.fillStyle = cfg.bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${(cfg.brand || "logo").replace(/\s+/g, "-").toLowerCase()}.png`;
      a.click();
    };
    img.src = url;
  }

  // pill button helper
  function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
      <button onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${active ? "bg-fuchsia-600 text-white border-fuchsia-600" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-fuchsia-400 hover:text-fuchsia-600"}`}
      >{children}</button>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Live Preview ─────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-5 flex flex-col items-center gap-4 border border-gray-200 dark:border-gray-700"
        style={{ backgroundImage: "repeating-conic-gradient(#e5e7eb 0% 25%, #f9fafb 0% 50%)", backgroundSize: "18px 18px" }}
      >
        <div className="rounded-xl overflow-hidden shadow-lg max-w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <div className="flex flex-wrap gap-2 justify-center">
          <button onClick={downloadSVG}
            className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl hover:border-fuchsia-400 hover:text-fuchsia-600 transition-colors shadow-sm"
          ><Download className="w-3.5 h-3.5" /> Download SVG</button>
          <button onClick={downloadPNG}
            className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl hover:border-fuchsia-400 hover:text-fuchsia-600 transition-colors shadow-sm"
          ><Download className="w-3.5 h-3.5" /> Download PNG</button>
          <button onClick={shuffle}
            className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl hover:border-fuchsia-400 hover:text-fuchsia-600 transition-colors shadow-sm"
          ><Shuffle className="w-3.5 h-3.5" /> Shuffle Style</button>
        </div>
      </div>

      {/* ── Brand Text ───────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <p className="text-sm font-semibold text-gray-800 dark:text-white">Brand Text</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Brand Name</label>
            <input type="text" placeholder="e.g. NovaSpark" value={cfg.brand}
              onChange={(e) => update({ brand: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Tagline <span className="opacity-60">(optional)</span></label>
            <input type="text" placeholder="e.g. Think Bold. Build Fast." value={cfg.tagline}
              onChange={(e) => update({ tagline: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
            />
          </div>
        </div>
      </section>

      {/* ── Quick Presets ─────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <p className="text-sm font-semibold text-gray-800 dark:text-white">Quick Presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.name} onClick={() => applyPreset(p.config)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-fuchsia-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors"
            >{p.name}</button>
          ))}
        </div>
      </section>

      {/* ── Layout ───────────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <p className="text-sm font-semibold text-gray-800 dark:text-white">Layout</p>
        <div className="grid grid-cols-4 gap-2">
          {(["horizontal", "stacked", "icon-only", "text-only"] as const).map((l) => (
            <button key={l} onClick={() => update({ layout: l })}
              className={`py-2 rounded-xl text-xs font-medium border transition-colors capitalize ${cfg.layout === l ? "bg-fuchsia-600 text-white border-fuchsia-600" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-fuchsia-400"}`}
            >{l.replace("-", " ")}</button>
          ))}
        </div>
      </section>

      {/* ── Icon Shape ───────────────────────────────────────────────────── */}
      {cfg.layout !== "text-only" && (
        <section className="space-y-3">
          <p className="text-sm font-semibold text-gray-800 dark:text-white">Icon Shape</p>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
            {SHAPE_ICONS.map((s) => (
              <button key={s.key} onClick={() => update({ shape: s.key })} title={s.label}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl border text-xs transition-colors ${cfg.shape === s.key ? "bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-400 text-fuchsia-600 dark:text-fuchsia-400" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-fuchsia-300"}`}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" dangerouslySetInnerHTML={{ __html: s.d }} />
                <span className="text-[9px] leading-none hidden sm:block truncate w-full text-center px-0.5">{s.label}</span>
              </button>
            ))}
          </div>
          {cfg.shape !== "none" && (
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              <input type="checkbox" checked={cfg.showInitials} onChange={(e) => update({ showInitials: e.target.checked })} className="accent-fuchsia-600 w-4 h-4 rounded" />
              Show brand initials inside shape
            </label>
          )}
        </section>
      )}

      {/* ── Typography ───────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <p className="text-sm font-semibold text-gray-800 dark:text-white">Typography</p>
        <div className="grid grid-cols-5 gap-2">
          {(["modern", "serif", "bold", "rounded", "mono"] as const).map((f) => (
            <button key={f} onClick={() => update({ fontStyle: f })}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border transition-colors ${cfg.fontStyle === f ? "bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-400 text-fuchsia-600 dark:text-fuchsia-400" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-fuchsia-300"}`}
            >
              <span style={{ fontFamily: FONTS[f], fontSize: 20, fontWeight: 700, lineHeight: 1 }}>Aa</span>
              <span className="text-[10px]">{FONT_LABELS[f]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Colors ───────────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <p className="text-sm font-semibold text-gray-800 dark:text-white">Colors</p>
        <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-4 divide-y divide-gray-200 dark:divide-gray-700">
          <ColorRow label="Icon Primary" value={cfg.primaryColor} onChange={(v) => update({ primaryColor: v })} />
          <ColorRow label="Icon Gradient / Accent" value={cfg.secondaryColor} onChange={(v) => update({ secondaryColor: v })} />
          <ColorRow label="Brand Text" value={cfg.textColor} onChange={(v) => update({ textColor: v })} />
        </div>
      </section>

      {/* ── Icon Gradient ─────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800 dark:text-white">Icon Gradient</p>
          <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer">
            <input type="checkbox" checked={cfg.useGradient} onChange={(e) => update({ useGradient: e.target.checked })} className="accent-fuchsia-600 w-4 h-4 rounded" />
            Enable
          </label>
        </div>
        {cfg.useGradient && (
          <div className="grid grid-cols-4 gap-2">
            {([
              { key: "ltr" as const,      symbol: "→", label: "Left → Right" },
              { key: "ttb" as const,      symbol: "↓", label: "Top → Bottom" },
              { key: "diagonal" as const, symbol: "↘", label: "Diagonal" },
              { key: "radial" as const,   symbol: "◉", label: "Radial" },
            ]).map((d) => (
              <button key={d.key} onClick={() => update({ gradientDir: d.key })}
                className={`py-2.5 rounded-xl text-xs font-medium border transition-colors text-center ${cfg.gradientDir === d.key ? "bg-fuchsia-600 text-white border-fuchsia-600" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-fuchsia-400"}`}
              >
                <div className="text-lg leading-none">{d.symbol}</div>
                <div className="text-[9px] mt-0.5 opacity-80">{d.label}</div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── Background ───────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <p className="text-sm font-semibold text-gray-800 dark:text-white">Background</p>
        <div className="flex flex-wrap gap-2">
          {(["solid", "gradient", "transparent"] as const).map((s) => (
            <Pill key={s} active={cfg.bgStyle === s} onClick={() => update({ bgStyle: s })}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Pill>
          ))}
        </div>
        {cfg.bgStyle === "solid" && (
          <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2">
            <ColorRow label="Background Color" value={cfg.bgColor} onChange={(v) => update({ bgColor: v })} />
          </div>
        )}
        {cfg.bgStyle === "gradient" && (
          <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 divide-y divide-gray-200 dark:divide-gray-700">
            <ColorRow label="Gradient From" value={cfg.bgGradFrom} onChange={(v) => update({ bgGradFrom: v })} />
            <ColorRow label="Gradient To"   value={cfg.bgGradTo}   onChange={(v) => update({ bgGradTo: v })}   />
          </div>
        )}
      </section>

      {/* ── Canvas Options ────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <p className="text-sm font-semibold text-gray-800 dark:text-white">Canvas Options</p>
        <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Corner Radius</label>
              <span className="text-xs font-mono text-gray-500">{cfg.borderRadius}px</span>
            </div>
            <input type="range" min="0" max="48" value={cfg.borderRadius}
              onChange={(e) => update({ borderRadius: Number(e.target.value) })}
              className="w-full accent-fuchsia-600 h-1.5 rounded-full cursor-pointer"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input type="checkbox" checked={cfg.shadowEnabled} onChange={(e) => update({ shadowEnabled: e.target.checked })} className="accent-fuchsia-600 w-4 h-4 rounded" />
            Drop shadow
          </label>
        </div>
      </section>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center pb-2">
        SVG logos are infinitely scalable. PNG downloads at 3× resolution — perfect for social media and print.
      </p>
    </div>
  );
}
