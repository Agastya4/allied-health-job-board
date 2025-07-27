# Stripe Setup Guide

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key
STRIPE_CHECKOUT_PRICE_ID=price_...  # Your Stripe price ID

# Payment Settings
PAYMENT_ENABLED=true  # Set to 'false' to disable payments
JOB_POSTING_PRICE=100  # Price in cents ($1.00)
FREE_JOB_POSTING_LIMIT=0  # Number of free postings per user (0 = no free postings)

# Redirect URLs (for production)
NEXT_PUBLIC_STRIPE_SUCCESS_URL=https://yourdomain.com/payment-success
NEXT_PUBLIC_STRIPE_CANCEL_URL=https://yourdomain.com/payment-cancel

# For testing (localhost)
# NEXT_PUBLIC_STRIPE_SUCCESS_URL=http://localhost:3000/payment-success
# NEXT_PUBLIC_STRIPE_CANCEL_URL=http://localhost:3000/payment-cancel
```

## How to Get Your Stripe Price ID

1. **Go to Stripe Dashboard** → Products
2. **Create a new product** called "Job Posting"
3. **Add a price**:
   - Amount: $1.00 AUD
   - Billing: One-time
   - Currency: AUD
4. **Copy the Price ID** (starts with `price_`)

## Troubleshooting

### Payment Form Not Working?

1. **Check browser console** for errors
2. **Check server logs** for API errors
3. **Verify environment variables** are set correctly
4. **Test with Stripe test keys** first

### Common Issues

- **"Payment configuration error"**: Missing `STRIPE_CHECKOUT_PRICE_ID`
- **"Payment disabled"**: `PAYMENT_ENABLED` is not set to 'true'
- **"No checkout URL"**: Stripe API error (check secret key)

### Testing

Use Stripe test card: `4242 4242 4242 4242`
Any future expiry date and any 3-digit CVC. 