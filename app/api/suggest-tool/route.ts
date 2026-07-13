import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { rateLimitByIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  if (!rateLimitByIp(request, "suggest-tool", 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many suggestions submitted. Please try again later." }, { status: 429 });
  }

  try {
    const { name, email, phone, tool, description, website } = await request.json();

    // Honeypot: real users never see or fill this field. Pretend to succeed
    // so bots don't learn to look elsewhere, without writing anything.
    if (website) return NextResponse.json({ ok: true });

    if (!name?.trim() || !tool?.trim()) {
      return NextResponse.json({ error: "Name and tool name are required." }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { error } = await supabase.from("tool_suggestions").insert({
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      tool_name: tool.trim(),
      description: description?.trim() || null,
    });

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ error: "Failed to save suggestion." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("suggest-tool error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
