import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getAdminClient } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local" }, { status: 500 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID.trim(),
    key_secret: process.env.RAZORPAY_KEY_SECRET.trim(),
  });
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user }, error: authError } = await userClient.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let cheatsheetId: string;
  try {
    ({ cheatsheetId } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (!cheatsheetId) return NextResponse.json({ error: "Missing cheatsheetId" }, { status: 400 });

  const admin = getAdminClient();

  const { data: sheet, error } = await admin
    .from("cheatsheets")
    .select("id, title, price, is_free")
    .eq("id", cheatsheetId)
    .eq("is_published", true)
    .single();

  if (error || !sheet) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  if (sheet.is_free) return NextResponse.json({ error: "This course is free" }, { status: 400 });

  const amount = Number(sheet.price);
  if (!amount || amount < 100) {
    return NextResponse.json({ error: "Invalid course price" }, { status: 400 });
  }

  const { data: existing } = await admin
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("cheatsheet_id", cheatsheetId)
    .maybeSingle();

  if (existing) return NextResponse.json({ error: "Already purchased" }, { status: 400 });

  let order;
  try {
    order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `cs_${Date.now()}`,
      notes: {
        cheatsheetId: String(cheatsheetId),
        userId: String(user.id),
        title: String(sheet.title ?? ""),
      },
    });
  } catch (err: unknown) {
    const rzpErr = err as { statusCode?: number; error?: { description?: string } };
    const detail = rzpErr?.error?.description ?? (err instanceof Error ? err.message : String(err));
    console.error("Razorpay order creation failed:", detail, err);
    return NextResponse.json(
      { error: `Payment gateway error: ${detail}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ orderId: order.id, amount, currency: "INR", name: sheet.title });
}
