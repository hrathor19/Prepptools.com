"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, getAuthClient } from "@/components/AuthProvider";
import { ShoppingCart, Loader2, Eye } from "lucide-react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

type Props = {
  cheatsheetId: string;
  slug: string;
  title: string;
  price: number;
  isFree: boolean;
};

export default function BuyButton({ cheatsheetId, slug, title, price, isFree }: Props) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isPurchased, setIsPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || isFree) { setCheckingPurchase(false); return; }

    const client = getAuthClient();
    client
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("cheatsheet_id", cheatsheetId)
      .eq("status", "completed")
      .maybeSingle()
      .then(({ data }) => {
        setIsPurchased(!!data);
        setCheckingPurchase(false);
      });
  }, [user, authLoading, cheatsheetId, isFree]);

  const handleView = () => {
    if (!user) { router.push("/login"); return; }
    router.push(`/courses/${slug}/view`);
  };

  const handleBuy = async () => {
    if (!user) { router.push("/login"); return; }
    setLoading(true);
    setError(null);

    try {
      const client = getAuthClient();
      const { data: { session } } = await client.auth.getSession();
      if (!session) { router.push("/login"); return; }

      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ cheatsheetId }),
      });
      let order: { error?: string; orderId?: string; amount?: number; currency?: string };
      try {
        order = await orderRes.json();
      } catch {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      if (!orderRes.ok) { setError(order.error ?? "Failed to create order"); setLoading(false); return; }

      // Always load a fresh Razorpay script to avoid stale instance issues
      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector('script[src*="checkout.razorpay"]');
        if (existing) existing.remove();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (window as any).Razorpay;
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
        document.body.appendChild(script);
      });

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "PreppTools",
        description: title,
        order_id: order.orderId,
        prefill: { email: user.email },
        theme: { color: "#38525a" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cheatsheetId,
                userId: user.id,
                amount: order.amount,
              }),
            });
            const verify = await verifyRes.json().catch(() => ({}));
            if (verify.success) {
              router.push(`/courses/${slug}/view`);
              router.refresh();
            } else {
              setError(verify.error ?? "Payment verification failed. Please contact support.");
              setLoading(false);
            }
          } catch {
            setError("Could not verify payment. Please contact support.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
          // Suppress Razorpay's native alert and handle failure in-page
          escape: true,
        },
      });

      // Handle payment failure event to show in-page error instead of alert
      rzp.on("payment.failed", (response: { error: { description?: string; reason?: string } }) => {
        const msg = response?.error?.description ?? response?.error?.reason ?? "Payment failed. Please try again.";
        setError(msg);
        setLoading(false);
        rzp.close();
      });

      rzp.open();
    } catch (err) {
      console.error("BuyButton error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (authLoading || checkingPurchase) {
    return <div className="h-[52px] bg-gray-100 animate-pulse" />;
  }

  if (isFree || isPurchased) {
    return (
      <button
        onClick={handleView}
        className="w-full h-[52px] flex items-center justify-center gap-2 px-6 text-white font-bold transition-colors"
        style={{ backgroundColor: "#38525a" }}>
        <Eye className="w-5 h-5" />
        {isPurchased ? "Go to course" : "View Free PDF"}
      </button>
    );
  }

  return (
    <div>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full h-[52px] flex items-center justify-center gap-2 px-6 text-white font-bold transition-colors disabled:opacity-60"
        style={{ backgroundColor: "#38525a" }}>
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
        {loading ? "Processing…" : `Buy now · ₹${(price / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
      </button>
      {!user && (
        <p className="text-xs text-gray-400 mt-2 text-center">Sign in required to purchase</p>
      )}
    </div>
  );
}
