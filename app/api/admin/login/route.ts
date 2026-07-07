import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireAdminSecret } from "@/lib/admin-auth";
import { verifyPassword, hashPassword } from "@/lib/password-hash";

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

    const { valid, needsRehash } = verifyPassword(password, data.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Self-healing migration: the first successful login against a legacy
    // unsalted sha256 hash upgrades it to salted scrypt in place.
    if (needsRehash) {
      await supabase
        .from("admin_credentials")
        .update({ password_hash: hashPassword(password) })
        .eq("id", 1);
    }

    const secret = requireAdminSecret();
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
