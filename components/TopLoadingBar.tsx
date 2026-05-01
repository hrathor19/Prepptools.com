"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function Bar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"idle" | "loading" | "completing">("idle");

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (hideRef.current) clearTimeout(hideRef.current);
  };

  const start = () => {
    clearTimers();
    setProgress(0);
    setPhase("loading");

    // Ease toward 85% with diminishing increments — never reaches 100 on its own
    let current = 0;
    tickRef.current = setInterval(() => {
      const remaining = 85 - current;
      const step = remaining * 0.12 + 1;
      current = Math.min(current + step, 85);
      setProgress(current);
    }, 180);
  };

  const complete = () => {
    clearTimers();
    setPhase("completing");
    setProgress(100);
    hideRef.current = setTimeout(() => {
      setPhase("idle");
      setProgress(0);
    }, 500);
  };

  // Route change completed → finish the bar
  useEffect(() => {
    complete();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Intercept navigations to start the bar
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (anchor.target === "_blank") return;
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search) return;
        start();
      } catch {
        // malformed href — ignore
      }
    };

    const onPopState = () => start();

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      clearTimers();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "idle") return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999,
        height: "3px",
        width: `${progress}%`,
        background: "#5287ff",
        // Smooth during loading, fast snap to 100% on complete
        transition:
          phase === "completing"
            ? "width 0.22s ease, opacity 0.4s ease"
            : "width 0.18s ease-out",
        opacity: phase === "completing" && progress === 100 ? 0 : 1,
        borderRadius: "0 2px 2px 0",
        pointerEvents: "none",
      }}
    >
      {/* Glowing right-edge tip */}
      <span
        style={{
          position: "absolute",
          right: -1,
          top: "50%",
          transform: "translateY(-50%)",
          width: 70,
          height: 3,
          background: "linear-gradient(to right, transparent, #8fb3ff)",
          borderRadius: "0 4px 4px 0",
        }}
      />
      <span
        style={{
          position: "absolute",
          right: -2,
          top: "50%",
          transform: "translateY(-50%)",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#b0ccff",
          boxShadow: "0 0 8px 3px rgba(143, 179, 255, 0.7)",
          filter: "blur(1px)",
        }}
      />
    </div>
  );
}

export default function TopLoadingBar() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}
