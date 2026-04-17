import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("questions")
      .select("id, name, question, answer, answered_at")
      .eq("is_answered", true)
      .order("answered_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ questions: data ?? [] });
  } catch (err) {
    console.error("qa/list error:", err);
    return NextResponse.json({ questions: [] });
  }
}
