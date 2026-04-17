import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, tool, description } = await request.json();

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
