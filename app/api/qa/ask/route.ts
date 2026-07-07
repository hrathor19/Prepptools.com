import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { rateLimitByIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  if (!rateLimitByIp(request, "qa-ask", 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many questions submitted. Please try again later." }, { status: 429 });
  }

  try {
    const { name, email, question } = await request.json();
    if (!name?.trim() || !question?.trim()) {
      return NextResponse.json({ error: "Name and question are required." }, { status: 400 });
    }
    const supabase = getAdminClient();
    const { error } = await supabase.from("questions").insert({
      name: name.trim(),
      email: email?.trim() || null,
      question: question.trim(),
    });
    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ error: "Failed to save question." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("qa/ask error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
