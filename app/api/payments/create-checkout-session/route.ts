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
      return NextResponse.json({ error: "Job data and job title are required" }, { status: 400 });
    }

    // Get payment settings
    const paymentSettings = getPaymentSettings();
    console.log("Payment settings:", paymentSettings)
    
    // Check if payment is enabled
    if (!paymentSettings.paymentEnabled) {
      console.log("Payment disabled, returning free")
      return NextResponse.json({ 
        requiresPayment: false,
        message: "Payment is currently disabled" 
      });
    }

    // Check if user has free job postings
    const hasFreePostings = await checkFreeJobPostings(user.id);
    console.log("Has free postings:", hasFreePostings)
    if (hasFreePostings) {
      return NextResponse.json({ 
        requiresPayment: false,
        message: "You have free job postings available" 
      });
    }

    // Validate price ID exists
    if (!paymentSettings.priceId) {
      console.error("No price ID configured")
      return NextResponse.json({ error: "Payment configuration error - no price ID" }, { status: 500 });
    }

    // Check if this is a $0 price (free job posting)
    if (paymentSettings.jobPostingPrice === 0) {
      console.log("Job posting is free ($0), creating job directly")
      return NextResponse.json({ 
        requiresPayment: false,
        message: "Job posting is free - no payment required" 
      });
    }

    console.log("Creating Stripe checkout session with price ID:", paymentSettings.priceId)
    
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: paymentSettings.priceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL,
        metadata: {
          userId: user.id.toString(),
          jobTitle: jobTitle,
          // Store job data as JSON string in metadata
          jobData: JSON.stringify(jobData),
        },
      });

      console.log("Stripe session created:", { sessionId: session.id, url: session.url })

      return NextResponse.json({ 
        checkoutUrl: session.url,
        requiresPayment: true 
      });
    } catch (stripeError) {
      console.error("Stripe API error:", stripeError);
      return NextResponse.json({ 
        error: "Stripe checkout creation failed", 
        details: stripeError instanceof Error ? stripeError.message : "Unknown Stripe error",
        stripeError: stripeError
      }, { status: 500 });
    }
  } catch (err) {
    console.error("General API error:", err);
    return NextResponse.json({ 
      error: "Failed to create checkout session",
      details: err instanceof Error ? err.message : "Unknown error",
      fullError: err
    }, { status: 500 });
  }
} 