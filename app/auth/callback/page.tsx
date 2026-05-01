"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAuthClient } from "@/components/AuthProvider";

export default function AuthCallback() {
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) { router.replace("/"); return; }

    getAuthClient().auth.exchangeCodeForSession(code).then(() => {
      const isAdminRedirect = sessionStorage.getItem("admin_redirect") === "1";
      if (isAdminRedirect) {
        sessionStorage.removeItem("admin_redirect");
        router.replace("/admin/login");
      } else {
        router.replace("/");
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Signing you in…</p>
      </div>
    </div>
  );
}
