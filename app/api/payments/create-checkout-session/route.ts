import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { stripe, getPaymentSettings, checkFreeJobPostings } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Check if user is an employer
    if (user.role !== 'employer') {
      return NextResponse.json({ error: "Only employers can post jobs" }, { status: 403 });
    }

    const { jobData, jobTitle, amount, currency } = await request.json();
    console.log("Creating checkout session:", { jobTitle, amount, currency, userId: user.id })

    if (!jobData || !jobTitle) {
      return NextResponse.json({ error: "Job data and title are required" }, { status: 400 });
    }

    // Get payment settings
    const paymentSettings = await getPaymentSettings();
    console.log("Payment settings:", paymentSettings)

    // Always create a Stripe checkout session (even for free postings)
    // This allows us to collect customer information and handle the flow consistently
    
    if (!paymentSettings.priceId) {
      console.error("Missing Stripe price ID")
      return NextResponse.json({ 
        error: "Payment configuration error",
        details: "Stripe price ID not configured"
      }, { status: 500 });
    }

    // Create Stripe checkout session with minimal metadata
    // Store only essential identifiers to avoid metadata size limits
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: paymentSettings.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL}`,
      metadata: {
        userId: user.id.toString(),
        jobTitle: jobTitle,
        type: 'job_posting',
        // Store a unique identifier for the job data instead of the full data
        jobDataId: `job_${Date.now()}_${user.id}`
      },
      customer_email: user.email,
      allow_promotion_codes: true,
    });

    console.log("Stripe session created:", { sessionId: session.id, url: session.url })

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
      requiresPayment: true, // Always true since we're always redirecting to Stripe
      jobDataId: `job_${Date.now()}_${user.id}` // Return the same ID for frontend storage
    });

  } catch (error) {
    console.error("Error creating checkout session:", error);
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: "Failed to create checkout session",
        details: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: "Failed to create checkout session",
      details: "Unknown error occurred"
    }, { status: 500 });
  }
} 