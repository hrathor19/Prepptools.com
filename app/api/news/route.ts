import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "top";
  const country  = searchParams.get("country")  || "";
  const q        = searchParams.get("q")        || "";
  const page     = searchParams.get("page")     || "";

  const key = process.env.NEWSDATA_API_KEY;
  if (!key) return NextResponse.json({ error: "API key not configured" }, { status: 500 });

  const params = new URLSearchParams({
    apikey:   key,
    language: "en",
    size:     "10",
    category,
  });
  if (country) params.set("country", country);
  if (q)       params.set("q", q);
  if (page)    params.set("page", page);

  try {
    const res = await fetch(`https://newsdata.io/api/1/latest?${params}`, {
      next: { revalidate: 300 }, // cache 5 min to preserve daily quota
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to reach news provider" }, { status: 502 });
  }
}
