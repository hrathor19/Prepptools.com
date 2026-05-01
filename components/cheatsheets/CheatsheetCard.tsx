"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { FileText, Check, BadgeCheck } from "lucide-react";
import WishlistButton from "./WishlistButton";

type Props = {
  id: string;
  title: string;
  description: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  isFree: boolean;
  category: string;
  pages: number;
  previewImageUrl?: string | null;
  isPurchased?: boolean;
};

export default function CheatsheetCard({
  id, title, description, slug, price, originalPrice, isFree, category, pages, previewImageUrl, isPurchased,
}: Props) {
  const priceDisplay = (price / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const originalPriceDisplay = originalPrice && originalPrice > price
    ? (originalPrice / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : null;
  const isPaid = !isFree;

  const [showPopup, setShowPopup] = useState(false);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number; side: "left" | "right" }>({
    top: 0, left: 0, side: "right",
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const cancelHide = () => clearTimeout(hideTimer.current);
  const startHide  = () => { hideTimer.current = setTimeout(() => setShowPopup(false), 200); };

  const handleEnter = () => {
    cancelHide();
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const PW = 308;
    const gap = 10;
    const side: "left" | "right" = r.right + PW + gap < window.innerWidth ? "right" : "left";
    const left = side === "right" ? r.right + gap : r.left - PW - gap;
    const top  = Math.max(8, Math.min(r.top, window.innerHeight - 440));
    setPopupPos({ top, left, side });
    setShowPopup(true);
  };

  const handleLeave = () => {
    startHide();
  };

  const highlights = [
    pages > 0 ? `${pages} pages of structured content` : "Comprehensive structured content",
    `Expert-crafted ${category} resource`,
    "Instant PDF access after purchase",
  ];

  return (
    <div
      ref={cardRef}
      className="relative shrink-0 w-[230px]"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        href={`/courses/${slug}`}
        className="group flex flex-col bg-white border border-gray-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:border-gray-300 transition-all duration-200 overflow-hidden w-full"
      >
        {/* Thumbnail */}
        <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
          {previewImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewImageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
          )}
          {isPurchased && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5">
              Owned
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-1">{title}</h3>
          <p className="text-xs text-gray-500 line-clamp-1 mb-1.5">{description || category}</p>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{category}</span>
            {pages > 0 && <span className="text-[10px] text-gray-400">{pages} pages</span>}
          </div>

          <div className="mt-auto flex items-baseline gap-1.5 flex-wrap">
            {isFree ? (
              <span className="text-sm font-bold text-emerald-600">Free</span>
            ) : (
              <>
                <span className="text-sm font-bold text-gray-900">₹{priceDisplay}</span>
                {originalPriceDisplay && (
                  <span className="text-xs text-gray-400 line-through">₹{originalPriceDisplay}</span>
                )}
              </>
            )}
          </div>

          {(isPaid || isPurchased) && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {isPurchased ? (
                <span className="text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-sm">Owned</span>
              ) : (
                <>
                  <span className="text-[10px] font-bold border border-yellow-400 text-yellow-700 bg-yellow-50 px-1.5 py-0.5">
                    Bestseller
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "#03adc5" }}>
                    <BadgeCheck className="w-3 h-3" />
                    Premium
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Hover popup — rendered via portal to escape overflow:hidden on scroll row */}
      {showPopup && typeof document !== "undefined" && createPortal(
        <div
          className="fixed z-[9999] w-[308px] bg-white border border-gray-200 shadow-2xl p-4 pointer-events-auto"
          style={{ top: popupPos.top, left: popupPos.left }}
          onMouseEnter={cancelHide}
          onMouseLeave={startHide}
        >
          {/* Arrow pointing toward card */}
          <div
            className={`absolute top-9 w-3.5 h-3.5 bg-white rotate-45 ${
              popupPos.side === "right"
                ? "-left-[8px] border-l border-b border-gray-200"
                : "-right-[8px] border-r border-t border-gray-200"
            }`}
          />

          {/* Title */}
          <h3 className="text-[13px] font-bold text-gray-900 leading-snug mb-2">{title}</h3>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {isPurchased ? (
              <span className="text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-sm">Owned</span>
            ) : isFree ? (
              <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-sm">Free</span>
            ) : (
              <>
                <span className="text-[10px] font-bold border border-yellow-400 text-yellow-700 bg-yellow-50 px-1.5 py-0.5">
                  Bestseller
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "#03adc5" }}>
                  <BadgeCheck className="w-3 h-3" />
                  Premium
                </span>
              </>
            )}
          </div>

          {/* Meta line */}
          <p className="text-[11px] text-gray-500 mb-3">
            {category}
            {pages > 0 ? ` · ${pages} pages` : ""}
            {" · Instant Download"}
          </p>

          {/* Description */}
          {description && (
            <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-3">{description}</p>
          )}

          {/* What you'll get */}
          <ul className="space-y-1.5 mb-3">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <Check className="w-3.5 h-3.5 text-gray-800 mt-0.5 shrink-0" />
                {h}
              </li>
            ))}
          </ul>

          {/* Price row */}
          {!isFree && !isPurchased && (
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-base font-bold text-gray-900">₹{priceDisplay}</span>
              {originalPriceDisplay && (
                <span className="text-sm text-gray-400 line-through">₹{originalPriceDisplay}</span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/courses/${slug}`}
              className="flex-1 text-center text-xs font-bold py-2.5 px-3 transition-colors text-white"
              style={{ backgroundColor: isFree || isPurchased ? "#1f2937" : "#38525a" }}
            >
              {isPurchased ? "Access Now" : isFree ? "View Free" : `Buy Now · ₹${priceDisplay}`}
            </Link>
            <WishlistButton cheatsheetId={id} className="w-10 py-2.5" />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
