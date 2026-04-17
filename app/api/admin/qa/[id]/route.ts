import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminClient } from "@/lib/supabase";

async function isAuthenticated() {
  const cookieStore = await cookies();
  return !!cookieStore.get("admin_token")?.value;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { answer } = await request.json();
    if (!answer?.trim()) {
      return NextResponse.json({ error: "Answer is required." }, { status: 400 });
    }
    const supabase = getAdminClient();
    const { error } = await supabase
      .from("questions")
      .update({ answer: answer.trim(), is_answered: true, answered_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin/qa answer error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const supabase = getAdminClient();
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin/qa delete error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
