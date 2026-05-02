import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "Razorpay not configured" }, { status: 500 });
  }

  let body: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    cheatsheetId: string;
    userId: string;
    amount: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cheatsheetId, userId, amount } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !cheatsheetId || !userId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify signature
  const signatureBody = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET.trim())
    .update(signatureBody)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  // Save purchase
  try {
    const admin = getAdminClient();
    const { error } = await admin.from("purchases").insert({
      user_id: userId,
      cheatsheet_id: cheatsheetId,
      razorpay_order_id,
      razorpay_payment_id,
      amount,
      status: "completed",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  } catch (err) {
    console.error("Purchase save failed:", err);
    return NextResponse.json({ error: "Failed to save purchase. Contact support." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
