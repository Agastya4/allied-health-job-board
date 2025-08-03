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

    // Check if URLs are properly configured
    const urlCheck = {
      successUrlConfigured: !!process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL,
      cancelUrlConfigured: !!process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL,
      successUrlValue: process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL,
      cancelUrlValue: process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL,
    };

    // Check Stripe configuration
    const stripeConfig = {
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasPriceId: !!process.env.STRIPE_CHECKOUT_PRICE_ID,
      priceIdValue: process.env.STRIPE_CHECKOUT_PRICE_ID,
    };

    return NextResponse.json({
      paymentSettings,
      environmentVariables: envCheck,
      urlConfiguration: urlCheck,
      stripeConfiguration: stripeConfig,
      message: "Payment configuration check",
      recommendations: {
        missingStripeKey: !process.env.STRIPE_SECRET_KEY ? "STRIPE_SECRET_KEY is missing" : null,
        missingPriceId: !process.env.STRIPE_CHECKOUT_PRICE_ID ? "STRIPE_CHECKOUT_PRICE_ID is missing" : null,
        missingSuccessUrl: !process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL ? "NEXT_PUBLIC_STRIPE_SUCCESS_URL is missing" : null,
        missingCancelUrl: !process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL ? "NEXT_PUBLIC_STRIPE_CANCEL_URL is missing" : null,
        paymentDisabled: process.env.PAYMENT_ENABLED !== 'true' ? "PAYMENT_ENABLED is not set to 'true'" : null,
      }
    });
  } catch (error) {
    console.error("Debug payment error:", error);
    return NextResponse.json({ error: "Debug failed" }, { status: 500 });
  }
} 