import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getAdminClient } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local" }, { status: 500 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
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

  const { cheatsheetId } = await request.json();
  if (!cheatsheetId) return NextResponse.json({ error: "Missing cheatsheetId" }, { status: 400 });

  const admin = getAdminClient();

  const { data: sheet, error } = await admin
    .from("cheatsheets")
    .select("id, title, price, is_free")
    .eq("id", cheatsheetId)
    .eq("is_published", true)
    .single();

  if (error || !sheet) return NextResponse.json({ error: "Cheatsheet not found" }, { status: 404 });
  if (sheet.is_free) return NextResponse.json({ error: "This cheatsheet is free" }, { status: 400 });

  const { data: existing } = await admin
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("cheatsheet_id", cheatsheetId)
    .maybeSingle();

  if (existing) return NextResponse.json({ error: "Already purchased" }, { status: 400 });

  const order = await razorpay.orders.create({
    amount: sheet.price,
    currency: "INR",
    receipt: `cs_${cheatsheetId.slice(0, 8)}_${Date.now()}`,
    notes: { cheatsheetId, userId: user.id, title: sheet.title },
  });

  return NextResponse.json({ orderId: order.id, amount: sheet.price, currency: "INR", name: sheet.title });
}
