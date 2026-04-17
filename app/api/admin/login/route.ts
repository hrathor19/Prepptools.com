import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { getAdminClient } from "@/lib/supabase";

function sha256(str: string) {
  return createHash("sha256").update(str).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("admin_credentials")
      .select("password_hash")
      .eq("id", 1)
      .single();

    if (error || !data) {
      console.error("Supabase error:", error?.message);
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const inputHash = sha256(password);
    if (inputHash !== data.password_hash) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
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
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
