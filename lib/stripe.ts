import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export { stripe };

// Types for payment data
export interface PaymentIntentData {
  amount: number; // Amount in cents
  currency: string;
  metadata: {
    jobId?: string;
    userId: string;
    jobTitle?: string;
  };
}

// Create payment intent using Stripe Product/Price
export async function createPaymentIntentWithProduct(data: PaymentIntentData) {
  try {
    // Get the price ID from environment variable or use default
    const priceId = process.env.STRIPE_JOB_POSTING_PRICE_ID;
    
    if (priceId) {
      // Use Stripe Product/Price
      const paymentIntent = await stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency,
        metadata: data.metadata,
        automatic_payment_methods: {
          enabled: true,
        },
        // Note: price_data is not supported in PaymentIntent creation
        // Use metadata for job details instead
      });

      return paymentIntent;
    } else {
      // Fallback to direct amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency,
        metadata: data.metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    }
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// Create payment intent (legacy method)
export async function createPaymentIntent(data: PaymentIntentData) {
  return createPaymentIntentWithProduct(data);
}

// Retrieve payment intent
export async function getPaymentIntent(paymentIntentId: string) {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw error;
  }
}

// Confirm payment intent
export async function confirmPaymentIntent(paymentIntentId: string) {
  try {
    return await stripe.paymentIntents.confirm(paymentIntentId);
  } catch (error) {
    console.error('Error confirming payment intent:', error);
    throw error;
  }
}

// Get Stripe products and prices
export async function getStripeProducts() {
  try {
    const products = await stripe.products.list({
      active: true,
      limit: 100,
    });

    const prices = await stripe.prices.list({
      active: true,
      limit: 100,
    });

    return {
      products: products.data,
      prices: prices.data,
    };
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    throw error;
  }
}

// Get payment settings - simplified for security
export function getPaymentSettings() {
  // For security, payment settings are now managed through environment variables
  // and Stripe Dashboard only
  return {
    paymentEnabled: process.env.PAYMENT_ENABLED === 'true',
    jobPostingPrice: parseInt(process.env.JOB_POSTING_PRICE || '100'),
    freeJobPostingLimit: parseInt(process.env.FREE_JOB_POSTING_LIMIT || '0'),
    priceId: process.env.STRIPE_CHECKOUT_PRICE_ID,
  };
}

// Check if user has free job postings available
export async function checkFreeJobPostings(userId: number) {
  const { sql } = await import('./database');
  
  try {
    const settings = await getPaymentSettings();
    
    if (settings.freeJobPostingLimit === 0) {
      return false; // No free postings allowed
    }
    
    // Count user's existing job postings
    const jobCount = await sql`
      SELECT COUNT(*) as count 
      FROM jobs 
      WHERE user_id = ${userId} AND status = 'active'
    `;
    
    return jobCount[0]?.count < settings.freeJobPostingLimit;
  } catch (error) {
    console.error('Error checking free job postings:', error);
    return false;
  }
} 