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
    const { sessionId, paymentIntentId, jobId } = body;

    // Handle both sessionId and paymentIntentId
    let session;
    let paymentIntent;

    if (sessionId) {
      // Retrieve the checkout session from Stripe
      session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (!session) {
        return NextResponse.json({ error: "Checkout session not found" }, { status: 404 });
      }

      // Verify session belongs to this user
      if (session.metadata?.userId !== user.id.toString()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      const sessionJobId = session.metadata?.jobId;
      if (!sessionJobId) {
        return NextResponse.json({ error: "Job ID not found in session" }, { status: 400 });
      }

      // Check payment status
      if (session.payment_status === 'paid') {
        // Update job payment status
        const { sql } = await import('@/lib/database');
        
        await sql`
          UPDATE jobs 
          SET payment_status = 'paid', stripe_payment_intent_id = ${session.payment_intent as string}
          WHERE id = ${parseInt(sessionJobId)} AND user_id = ${user.id}
        `;

        // Get job title for response
        const jobResult = await sql`
          SELECT job_title FROM jobs WHERE id = ${parseInt(sessionJobId)}
        `;
        const jobTitle = jobResult[0]?.job_title || "Your job posting";

        // Record payment in payments table
        await sql`
          INSERT INTO payments (job_id, user_id, stripe_payment_intent_id, amount, currency, status, payment_method)
          VALUES (${parseInt(sessionJobId)}, ${user.id}, ${session.payment_intent as string}, ${session.amount_total || 0}, ${session.currency || 'aud'}, 'succeeded', 'card')
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
    } else if (paymentIntentId) {
      // Handle direct payment intent ID
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (!paymentIntent) {
        return NextResponse.json({ error: "Payment intent not found" }, { status: 404 });
      }

      // Verify payment intent belongs to this user
      if (paymentIntent.metadata?.userId !== user.id.toString()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      const intentJobId = paymentIntent.metadata?.jobId || jobId;
      if (!intentJobId) {
        return NextResponse.json({ error: "Job ID not found in payment intent" }, { status: 400 });
      }

      // Check payment status
      if (paymentIntent.status === 'succeeded') {
        // Update job payment status
        const { sql } = await import('@/lib/database');
        
        await sql`
          UPDATE jobs 
          SET payment_status = 'paid', stripe_payment_intent_id = ${paymentIntentId}
          WHERE id = ${parseInt(intentJobId)} AND user_id = ${user.id}
        `;

        // Get job title for response
        const jobResult = await sql`
          SELECT job_title FROM jobs WHERE id = ${parseInt(intentJobId)}
        `;
        const jobTitle = jobResult[0]?.job_title || "Your job posting";

        // Record payment in payments table
        await sql`
          INSERT INTO payments (job_id, user_id, stripe_payment_intent_id, amount, currency, status, payment_method)
          VALUES (${parseInt(intentJobId)}, ${user.id}, ${paymentIntentId}, ${paymentIntent.amount}, ${paymentIntent.currency}, 'succeeded', 'card')
          ON CONFLICT (stripe_payment_intent_id) DO NOTHING
        `;

        return NextResponse.json({ 
          success: true, 
          message: "Payment confirmed and job posted successfully",
          jobTitle
        });
      } else {
        return NextResponse.json({ 
          error: `Payment status: ${paymentIntent.status}` 
        }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Session ID or Payment Intent ID is required" }, { status: 400 });
    }

  } catch (error) {
    console.error("Confirm payment error:", error);
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 });
  }
} 