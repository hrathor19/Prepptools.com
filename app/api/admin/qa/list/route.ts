import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ questions: data ?? [] });
  } catch (err) {
    console.error("admin/qa/list error:", err);
    return NextResponse.json({ questions: [] });
  }
}
