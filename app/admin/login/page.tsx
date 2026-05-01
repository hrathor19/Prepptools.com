"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, LogIn } from "lucide-react";
import { getAuthClient } from "@/components/AuthProvider";

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: "This Google account is not authorized as admin.",
  auth_failed: "Sign-in failed. Please try again.",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"checking" | "signed-out" | "signed-in" | "claiming">("checking");
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [claimError, setClaimError] = useState("");
  const error = searchParams.get("error");

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      // Back from Google OAuth — exchange the code (use sessionStorage to prevent StrictMode double-run)
      const guardKey = `exchange_${code.slice(0, 12)}`;
      if (sessionStorage.getItem(guardKey)) return;
      sessionStorage.setItem(guardKey, "1");

      getAuthClient().auth.exchangeCodeForSession(code).then(({ data }) => {
        // Remove code from URL so refreshing doesn't re-attempt exchange
        window.history.replaceState({}, "", "/admin/login");
        const email = data.session?.user?.email ?? null;
        setSignedInEmail(email);
        setStep(email ? "signed-in" : "signed-out");
      }).catch(() => {
        window.history.replaceState({}, "", "/admin/login");
        setStep("signed-out");
      });
      return;
    }

    // No code — check existing session
    getAuthClient().auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email ?? null;
      setSignedInEmail(email);
      setStep(email ? "signed-in" : "signed-out");
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogleSignIn = async () => {
    setStep("checking");
    // /auth/callback is already registered in Supabase — safe to use
    // Flag tells the callback to redirect back here instead of home
    sessionStorage.setItem("admin_redirect", "1");
    await getAuthClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: "select_account" },
      },
    });
  };

  const handleClaimAdmin = async () => {
    setStep("claiming");
    setClaimError("");
    const { data } = await getAuthClient().auth.getSession();
    const token = data.session?.access_token;
    if (!token) { setStep("signed-out"); return; }

    const res = await fetch("/api/admin/verify-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: token }),
    });

    if (res.ok) {
      window.location.href = "/admin";
    } else {
      setClaimError("This account is not authorized as admin.");
      setStep("signed-in");
    }
  };

  const handleSwitchAccount = async () => {
    await getAuthClient().auth.signOut();
    handleGoogleSignIn();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 rounded-2xl mb-4">
            <ShieldCheck className="w-7 h-7 text-orange-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Access</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in with your authorized Google account</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {(error || claimError) && (
            <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {claimError || ERROR_MESSAGES[error!] || "An error occurred. Please try again."}
            </div>
          )}

          {step === "checking" && (
            <div className="flex justify-center py-2">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          )}

          {step === "signed-out" && (
            <button onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          )}

          {(step === "signed-in" || step === "claiming") && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-center">
                <p className="text-gray-500 text-xs mb-0.5">Signed in as</p>
                <p className="font-semibold text-gray-900">{signedInEmail}</p>
              </div>
              <button onClick={handleClaimAdmin} disabled={step === "claiming"}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-60">
                {step === "claiming" ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                {step === "claiming" ? "Verifying…" : "Enter Admin Panel"}
              </button>
              <button onClick={handleSwitchAccount}
                className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors pt-1">
                Use a different account
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Only authorized accounts can access this panel.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
