"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, getAuthClient } from "@/components/AuthProvider";
import { FileText, Eye, IndianRupee, Loader2, ShoppingBag } from "lucide-react";

type Purchase = {
  id: string;
  created_at: string;
  amount: number;
  razorpay_payment_id: string;
  cheatsheets: {
    id: string;
    title: string;
    slug: string;
    description: string;
    preview_image_url: string | null;
    category: string;
  } | null;
};

export default function PurchasesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.replace("/login"); return; }
    if (!user) return;

    const client = getAuthClient();
    client
      .from("purchases")
      .select("id, created_at, amount, razorpay_payment_id, cheatsheets(id, title, slug, description, preview_image_url, category)")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setPurchases((data as unknown as Purchase[]) ?? []);
        setLoading(false);
      });
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="text-xl font-bold text-white">My Purchases</h1>
            <p className="text-sm text-gray-400">{purchases.length} course{purchases.length !== 1 ? "s" : ""} purchased</p>
          </div>
        </div>

        {purchases.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">No purchases yet</p>
            <Link href="/courses"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {purchases.map((p) => {
              const sheet = p.cheatsheets;
              if (!sheet) return null;
              return (
                <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
                  {/* Cover */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-800 shrink-0 flex items-center justify-center">
                    {sheet.preview_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={sheet.preview_image_url} alt={sheet.title} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-6 h-6 text-gray-600" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{sheet.title}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{sheet.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded">{sheet.category}</span>
                      <span className="flex items-center gap-0.5 text-xs text-gray-500">
                        <IndianRupee className="w-3 h-3" />{(p.amount / 100).toFixed(0)} paid
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {/* View button */}
                  <Link href={`/courses/${sheet.slug}/view`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700/30 hover:bg-emerald-700/50 text-emerald-400 text-xs font-medium rounded-lg transition-colors shrink-0">
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
