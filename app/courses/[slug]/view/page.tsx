"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuthClient } from "@/components/AuthProvider";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheatsheetViewPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    const load = async () => {
      const client = getAuthClient();
      const { data: { session } } = await client.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const res = await fetch(`/api/courses/${slug}/view`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 401 || res.status === 403) {
          setErrorMsg(res.status === 403 ? "You need to purchase this course first." : "Please sign in to view.");
        } else {
          setErrorMsg(err.error ?? "Could not load PDF.");
        }
        setStatus("error");
        return;
      }

      const blob = await res.blob();
      objectUrl = URL.createObjectURL(blob);
      setPdfUrl(objectUrl);
      setStatus("ready");
    };

    load();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [slug, router]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-4 shrink-0">
        <Link href={`/courses/${slug}`}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <span className="text-sm text-gray-300 font-medium truncate flex-1">Viewing Course</span>
        <span className="text-xs text-gray-600">© PreppTools — personal use only</span>
      </div>

      {/* Body */}
      <div className="flex-1 relative">
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-400">Loading PDF…</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-white font-medium mb-1">Access Denied</p>
              <p className="text-sm text-gray-400 mb-5">{errorMsg}</p>
              <Link href={`/courses/${slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
                View Course Page
              </Link>
            </div>
          </div>
        )}

        {status === "ready" && pdfUrl && (
          <iframe
            ref={iframeRef}
            src={pdfUrl}
            className="w-full h-full border-0"
            style={{ height: "calc(100vh - 52px)" }}
            title="Course PDF"
          />
        )}
      </div>
    </div>
  );
}
