import { type NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return NextResponse.json({ error: "Checkout session not found" }, { status: 404 });
    }

    // Verify session belongs to this user
    if (session.metadata?.userId !== user.id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const jobId = session.metadata?.jobId;
    if (!jobId) {
      return NextResponse.json({ error: "Job ID not found in session" }, { status: 400 });
    }

    // Check payment status
    if (session.payment_status === 'paid') {
      // Update job payment status
      const { sql } = await import('@/lib/database');
      
      await sql`
        UPDATE jobs 
        SET payment_status = 'paid', stripe_payment_intent_id = ${session.payment_intent as string}
        WHERE id = ${parseInt(jobId)} AND user_id = ${user.id}
      `;

      // Get job title for response
      const jobResult = await sql`
        SELECT job_title FROM jobs WHERE id = ${parseInt(jobId)}
      `;
      const jobTitle = jobResult[0]?.job_title || "Your job posting";

      // Record payment in payments table
      await sql`
        INSERT INTO payments (job_id, user_id, stripe_payment_intent_id, amount, currency, status, payment_method)
        VALUES (${parseInt(jobId)}, ${user.id}, ${session.payment_intent as string}, ${session.amount_total || 0}, ${session.currency || 'aud'}, 'succeeded', 'card')
        ON CONFLICT (stripe_payment_intent_id) DO NOTHING
      `;

      return NextResponse.json({ 
        success: true, 
        message: "Payment confirmed and job posted successfully",
        jobTitle
      });
    } else if (session.payment_status === 'unpaid') {
      return NextResponse.json({ 
        error: "Payment failed. Please try again with a different payment method." 
      }, { status: 400 });
    } else {
      return NextResponse.json({ 
        error: `Payment status: ${session.payment_status}` 
      }, { status: 400 });
    }

  } catch (error) {
    console.error("Confirm payment error:", error);
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 });
  }
} 