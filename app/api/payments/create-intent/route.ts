import { type NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { createPaymentIntent, getPaymentSettings, checkFreeJobPostings } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Only employers can post jobs
    if (user.role !== 'employer') {
      return NextResponse.json({ error: "Only employers can post jobs" }, { status: 403 });
    }

    const body = await request.json();
    const { jobTitle } = body;

    if (!jobTitle) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    // Get payment settings
    const settings = await getPaymentSettings();

    // Check if payment is enabled
    if (!settings.paymentEnabled) {
      return NextResponse.json({ 
        requiresPayment: false,
        message: "Payment is currently disabled. Job posting will be free." 
      });
    }

    // Check if user has free job postings available
    const hasFreePostings = await checkFreeJobPostings(user.id);
    
    if (hasFreePostings) {
      return NextResponse.json({ 
        requiresPayment: false,
        message: "You have free job postings available." 
      });
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent({
      amount: settings.jobPostingPrice,
      currency: 'aud',
      metadata: {
        userId: user.id.toString(),
        jobTitle: jobTitle,
      },
    });

    return NextResponse.json({
      requiresPayment: true,
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });

  } catch (error) {
    console.error("Create payment intent error:", error);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
} 