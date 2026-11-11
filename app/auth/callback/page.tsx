"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthClient } from "@/components/AuthProvider";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // sessionStorage survives StrictMode's dev-only remount — useRef does not,
    // which previously let the same one-time-use code get exchanged twice.
    if (sessionStorage.getItem("auth_cb_ran")) return;
    sessionStorage.setItem("auth_cb_ran", "1");

    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      sessionStorage.removeItem("auth_cb_ran");
      router.replace("/");
      return;
    }

    getAuthClient().auth.exchangeCodeForSession(code).then(({ error }) => {
      sessionStorage.removeItem("auth_cb_ran");
      const isAdminRedirect = sessionStorage.getItem("admin_redirect") === "1";

      if (error) {
        if (isAdminRedirect) {
          sessionStorage.removeItem("admin_redirect");
          router.replace("/admin/login?error=auth_failed");
        } else {
          router.replace("/login?error=auth_failed");
        }
        return;
      }

      if (isAdminRedirect) {
        sessionStorage.removeItem("admin_redirect");
        router.replace("/admin/login");
      } else {
        router.replace("/");
      }
    }).catch(() => {
      sessionStorage.removeItem("auth_cb_ran");
      const isAdminRedirect = sessionStorage.getItem("admin_redirect") === "1";
      if (isAdminRedirect) sessionStorage.removeItem("admin_redirect");
      router.replace(isAdminRedirect ? "/admin/login?error=auth_failed" : "/login?error=auth_failed");
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
