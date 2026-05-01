"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, FileText, BadgeCheck } from "lucide-react";
import { useAuth, getAuthClient } from "@/components/AuthProvider";

type WishlistItem = {
  wishlistId: string;
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  isFree: boolean;
  category: string;
  pages: number;
  previewImageUrl: string | null;
};

export default function WishlistPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) { router.replace("/login"); return; }
    if (!user) return;

    getAuthClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        if (!session) return;
        return fetch("/api/wishlist", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }).then((r) => r.json());
      })
      .then((data) => {
        if (data?.items) setItems(data.items);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [user, loading, router]);

  const remove = async (wishlistId: string, cheatsheetId: string) => {
    const { data: { session } } = await getAuthClient().auth.getSession();
    if (!session) return;
    await fetch("/api/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ cheatsheetId }),
    });
    setItems((prev) => prev.filter((i) => i.wishlistId !== wishlistId));
  };

  if (loading || fetching) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
        <span className="text-sm text-gray-400">({items.length})</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Your wishlist is empty</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">
            Click the heart icon on any course to save it here
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: "#38525a" }}
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const priceDisplay = (item.price / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 });
            return (
              <div key={item.wishlistId} className="relative group bg-white border border-gray-200 hover:shadow-md transition-all overflow-hidden">
                <Link href={`/courses/${item.slug}`} className="block">
                  <div className="relative w-full aspect-video bg-gray-100">
                    {item.previewImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.previewImageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                        <FileText className="w-10 h-10 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mb-2">{item.description || item.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">
                        {item.isFree ? "Free" : `₹${priceDisplay}`}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.isFree ? (
                          <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-sm">Free</span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "#03adc5" }}>
                            <BadgeCheck className="w-3 h-3" />Premium
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => remove(item.wishlistId, item.id)}
                  title="Remove from wishlist"
                  className="absolute top-2 right-2 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 shadow-sm transition-all opacity-0 group-hover:opacity-100"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
