"use client";

import { useEffect, useState } from "react";
import { getAuthClient } from "@/components/AuthProvider";
import { Loader2, AlertCircle } from "lucide-react";

export default function AdminAuthCallbackPage() {
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    // sessionStorage survives StrictMode remounts — useRef does not
    if (sessionStorage.getItem("admin_cb_ran")) return;
    sessionStorage.setItem("admin_cb_ran", "1");

    // Read code directly from URL — useSearchParams() can be empty on first render
    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      sessionStorage.removeItem("admin_cb_ran");
      window.location.href = "/admin/login?error=no_code";
      return;
    }

    const client = getAuthClient();

    client.auth.exchangeCodeForSession(code).then(async ({ data, error }) => {
      if (error || !data.session) {
        sessionStorage.removeItem("admin_cb_ran");
        window.location.href = "/admin/login?error=auth_failed";
        return;
      }

      try {
        const res = await fetch("/api/admin/verify-admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: data.session.access_token }),
        });

        sessionStorage.removeItem("admin_cb_ran");

        if (res.ok) {
          // Full page load so the browser sends the Set-Cookie before hitting middleware
          window.location.href = "/admin";
        } else {
          await client.auth.signOut();
          window.location.href = "/admin/login?error=unauthorized";
        }
      } catch {
        sessionStorage.removeItem("admin_cb_ran");
        setErrMsg("Network error. Please try again.");
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (errMsg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-sm text-red-600">{errMsg}</p>
          <a href="/admin/login" className="mt-4 inline-block text-sm text-orange-600 underline">Back to login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Verifying access…</p>
      </div>
    </div>
  );
}
