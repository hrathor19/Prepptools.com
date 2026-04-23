import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PreppTools — Free Online Tools",
    short_name: "PreppTools",
    description: "100+ free tools for PDF, text, math, health, finance, and more. No sign-up required.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "portrait-primary",
    icons: [
      { src: "/favicon.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon.png", sizes: "512x512", type: "image/png" },
    ],
    categories: ["utilities", "productivity", "education"],
    shortcuts: [
      { name: "All Tools",        url: "/tools",           description: "Browse all free tools" },
      { name: "Merge PDF",        url: "/tools/merge-pdf", description: "Merge PDF files" },
      { name: "Grammar Checker",  url: "/tools/grammar-checker", description: "Check grammar" },
      { name: "ATS Resume Score", url: "/tools/ats-score", description: "Check ATS score" },
    ],
  };
}
