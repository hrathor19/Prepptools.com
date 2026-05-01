"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { useAuth, getAuthClient } from "@/components/AuthProvider";

async function getToken(): Promise<string | null> {
  const { data: { session } } = await getAuthClient().auth.getSession();
  return session?.access_token ?? null;
}

export default function WishlistButton({
  cheatsheetId,
  className = "w-12 py-3.5",
}: {
  cheatsheetId: string;
  className?: string;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [checking, setChecking] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setChecking(false); return; }

    getToken().then((token) => {
      if (!token) { setChecking(false); return; }
      fetch(`/api/wishlist?cheatsheetId=${cheatsheetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then(({ wishlisted }) => {
          setIsWishlisted(!!wishlisted);
          setChecking(false);
        })
        .catch(() => setChecking(false));
    });
  }, [user, authLoading, cheatsheetId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { router.push("/login"); return; }
    if (toggling) return;

    const token = await getToken();
    if (!token) { router.push("/login"); return; }

    setToggling(true);
    const newState = !isWishlisted;
    setIsWishlisted(newState); // optimistic update

    const res = await fetch("/api/wishlist", {
      method: newState ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ cheatsheetId }),
    });

    if (!res.ok) setIsWishlisted(!newState); // revert on failure
    setToggling(false);
  };

  return (
    <button
      onClick={handleToggle}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      disabled={toggling || (checking && !!user)}
      className={`${className} flex items-center justify-center border transition-colors shrink-0 disabled:opacity-50 ${
        isWishlisted
          ? "border-red-300 bg-red-50 hover:bg-red-100"
          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
      }`}
    >
      {toggling ? (
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      ) : (
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
      )}
    </button>
  );
}
