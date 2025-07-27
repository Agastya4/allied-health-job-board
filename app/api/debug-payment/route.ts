import { NextRequest, NextResponse } from "next/server";
import { getPaymentSettings } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    const paymentSettings = getPaymentSettings();
    
    // Check environment variables
    const envCheck = {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_CHECKOUT_PRICE_ID: !!process.env.STRIPE_CHECKOUT_PRICE_ID,
      PAYMENT_ENABLED: process.env.PAYMENT_ENABLED,
      JOB_POSTING_PRICE: process.env.JOB_POSTING_PRICE,
      FREE_JOB_POSTING_LIMIT: process.env.FREE_JOB_POSTING_LIMIT,
      NEXT_PUBLIC_STRIPE_SUCCESS_URL: process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL,
      NEXT_PUBLIC_STRIPE_CANCEL_URL: process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL,
    };

    return NextResponse.json({
      paymentSettings,
      environmentVariables: envCheck,
      message: "Payment configuration check"
    });
  } catch (error) {
    console.error("Debug payment error:", error);
    return NextResponse.json({ error: "Debug failed" }, { status: 500 });
  }
} 