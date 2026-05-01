import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Add more emails here or set ADMIN_ALLOWED_EMAILS="a@gmail.com,b@gmail.com" in .env
const ALLOWED_ADMINS = (process.env.ADMIN_ALLOWED_EMAILS ?? "hrathor19@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export async function POST(request: NextRequest) {
  const { access_token } = await request.json();
  if (!access_token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user }, error } = await client.auth.getUser(access_token);
  if (error || !user?.email) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  if (!ALLOWED_ADMINS.includes(user.email.toLowerCase())) {
    return NextResponse.json({ error: "Not authorized", code: "unauthorized" }, { status: 403 });
  }

  const secret = process.env.ADMIN_SECRET ?? "fallback-secret-change-me";
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_token", secret, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
