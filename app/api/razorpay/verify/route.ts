import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import type { Orders } from "razorpay/dist/types/orders";
import type { Payments } from "razorpay/dist/types/payments";
import { getAdminClient } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "Razorpay not configured" }, { status: 500 });
  }

  // Identify the buyer from their session — never trust a client-supplied userId.
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user }, error: authError } = await userClient.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // The signature only proves this order/payment pair genuinely came from
  // Razorpay — it says nothing about which course, user, or amount it was
  // for. Those must be re-derived from Razorpay's own records below, never
  // taken from the request body.
  const signatureBody = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET.trim())
    .update(signatureBody)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID.trim(),
    key_secret: process.env.RAZORPAY_KEY_SECRET.trim(),
  });

  let order: Orders.RazorpayOrder;
  let payment: Payments.RazorpayPayment;
  try {
    [order, payment] = await Promise.all([
      razorpay.orders.fetch(razorpay_order_id),
      razorpay.payments.fetch(razorpay_payment_id),
    ]);
  } catch (err) {
    console.error("Razorpay fetch failed:", err);
    return NextResponse.json({ error: "Could not verify payment with Razorpay" }, { status: 502 });
  }

  if (payment.order_id !== razorpay_order_id || payment.status !== "captured") {
    return NextResponse.json({ error: "Payment not captured" }, { status: 400 });
  }

  const cheatsheetId = typeof order.notes?.cheatsheetId === "string" ? order.notes.cheatsheetId : undefined;
  const orderUserId = typeof order.notes?.userId === "string" ? order.notes.userId : undefined;

  if (!cheatsheetId || orderUserId !== user.id) {
    return NextResponse.json({ error: "Order does not belong to this user" }, { status: 403 });
  }

  const admin = getAdminClient();

  const { data: sheet } = await admin
    .from("cheatsheets")
    .select("id, price")
    .eq("id", cheatsheetId)
    .single();

  if (!sheet) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  if (Number(order.amount) !== Number(sheet.price)) {
    return NextResponse.json({ error: "Order amount does not match course price" }, { status: 400 });
  }

  // Idempotent: replaying the same signature must not create duplicate purchases.
  const { data: existing } = await admin
    .from("purchases")
    .select("id")
    .eq("razorpay_order_id", razorpay_order_id)
    .maybeSingle();

  if (existing) return NextResponse.json({ success: true });

  try {
    const { error } = await admin.from("purchases").insert({
      user_id: user.id,
      cheatsheet_id: cheatsheetId,
      razorpay_order_id,
      razorpay_payment_id,
      amount: order.amount,
      status: "completed",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  } catch (err) {
    console.error("Purchase save failed:", err);
    return NextResponse.json({ error: "Failed to save purchase. Contact support." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
