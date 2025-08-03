# Payment Setup Guide

This guide will help you fix the payment integration issues in the job board application.

## Issues Fixed

1. **PaymentForm Auto-Redirect**: Fixed the PaymentForm component to not automatically redirect to Stripe on load
2. **Payment Confirmation**: Improved the payment confirmation API to handle both sessionId and paymentIntentId
3. **Form Validation**: Enhanced form validation with better error messages and validation rules
4. **Error Handling**: Improved error handling throughout the payment flow
5. **Database Schema**: Fixed database schema mismatches that were causing job creation failures

## Database Schema Fix

**IMPORTANT**: If you modified the form after running the SQL scripts, you need to run the database schema fix:

### Option 1: Run the complete setup script
```sql
-- Run this script to ensure all required columns exist
-- File: scripts/014-complete-database-setup.sql
```

### Option 2: Run the schema fix script
```sql
-- Run this script to add missing columns
-- File: scripts/012-fix-jobs-table-schema.sql
```

### Option 3: Verify your current schema
```sql
-- Run this script to check what's missing
-- File: scripts/013-verify-database-schema.sql
```

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/job_board"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email Configuration (Resend)
RESEND_API_KEY="your-resend-api-key"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_CHECKOUT_PRICE_ID="price_your_stripe_price_id"

# Payment Settings
PAYMENT_ENABLED="true"
JOB_POSTING_PRICE="100"
FREE_JOB_POSTING_LIMIT="0"

# Stripe URLs (for development)
NEXT_PUBLIC_STRIPE_SUCCESS_URL="http://localhost:3000/payment-success"
NEXT_PUBLIC_STRIPE_CANCEL_URL="http://localhost:3000/payment-cancel"

# Stripe URLs (for production)
# NEXT_PUBLIC_STRIPE_SUCCESS_URL="https://yourdomain.com/payment-success"
# NEXT_PUBLIC_STRIPE_CANCEL_URL="https://yourdomain.com/payment-cancel"

# Google Places API (for address autocomplete)
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY="your-google-places-api-key"
```

## Stripe Setup Instructions

### 1. Create Stripe Account
- Go to [stripe.com](https://stripe.com) and create an account
- Get your API keys from the Stripe Dashboard

### 2. Create Product and Price
1. In Stripe Dashboard, go to Products
2. Create a new product called "Job Posting"
3. Add a price of $1.00 AUD
4. Copy the Price ID (starts with `price_`)

### 3. Configure Webhook (Optional)
For production, set up a webhook to handle payment events:
- URL: `https://yourdomain.com/api/webhooks/stripe`
- Events: `checkout.session.completed`, `payment_intent.succeeded`

## Database Setup

### Step 1: Run the complete database setup
```bash
# Connect to your PostgreSQL database and run:
psql -d your_database_name -f scripts/014-complete-database-setup.sql
```

### Step 2: Verify the setup
```bash
# Check if all tables and columns exist:
psql -d your_database_name -f scripts/013-verify-database-schema.sql
```

### Step 3: If you have existing data
If you already have jobs in your database, run this to populate missing columns:
```bash
psql -d your_database_name -f scripts/012-fix-jobs-table-schema.sql
```

## Testing the Payment Flow

### 1. Test Configuration
Visit `/test-payment` to test your payment configuration:
- Click "Test Payment Configuration" to check environment variables
- Click "Test Payment Flow" to test the actual payment process

### 2. Debug Payment Issues
Visit `/api/debug-payment` to see detailed configuration information.

### 3. Test Job Posting
1. Sign in as an employer
2. Go to `/post-job`
3. Fill out the form
4. Submit and test the payment flow

## Common Issues and Solutions

### Issue: "Failed to create job" or database errors
**Solution**: Run the database schema fix scripts above. The most common issue is missing `city` and `state` columns in the jobs table.

### Issue: "Payment setup failed"
**Solution**: Check that all environment variables are set correctly, especially:
- `STRIPE_SECRET_KEY`
- `STRIPE_CHECKOUT_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_SUCCESS_URL`
- `NEXT_PUBLIC_STRIPE_CANCEL_URL`

### Issue: "No checkout URL received"
**Solution**: Verify your Stripe Price ID is correct and the product is active in Stripe Dashboard.

### Issue: Payment not redirecting to Stripe
**Solution**: Check that `PAYMENT_ENABLED` is set to `"true"` and you don't have free job postings available.

### Issue: Payment confirmation failing
**Solution**: Ensure the success/cancel URLs are properly configured and accessible.

## Database Schema Requirements

The jobs table must have these columns:
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER REFERENCES users(id))
- `practice_email` (VARCHAR(255))
- `job_title` (VARCHAR(255))
- `practice_location` (TEXT)
- `location_display` (VARCHAR(255))
- `location_lat` (DECIMAL(10, 8))
- `location_lng` (DECIMAL(11, 8))
- `city` (VARCHAR(100)) ← **This was missing**
- `state` (VARCHAR(100)) ← **This was missing**
- `job_type` (VARCHAR(100))
- `job_categories` (TEXT[])
- `experience_level` (VARCHAR(100))
- `work_setting` (VARCHAR(100))
- `salary_range` (VARCHAR(100))
- `job_details` (TEXT)
- `company_name` (VARCHAR(255))
- `contact_phone` (VARCHAR(50))
- `contact_email` (VARCHAR(255))
- `company_website` (VARCHAR(255))
- `company_logo_url` (TEXT)
- `status` (VARCHAR(50))
- `is_featured` (BOOLEAN)
- `payment_status` (VARCHAR(50)) ← **This was missing**
- `stripe_payment_intent_id` (VARCHAR(255)) ← **This was missing**
- `payment_amount` (INTEGER) ← **This was missing**
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

## Payment Flow Overview

1. **Job Creation**: Job is created with `payment_status: 'pending'`
2. **Payment Form**: User sees payment form with job details
3. **Stripe Checkout**: User is redirected to Stripe for payment
4. **Success Page**: After payment, user returns to `/payment-success`
5. **Confirmation**: Backend confirms payment and updates job status
6. **Job Live**: Job is now visible on the job board

## Free Job Postings

To enable free job postings:
1. Set `FREE_JOB_POSTING_LIMIT` to a number > 0
2. Users will get free postings up to this limit
3. After the limit, they must pay for additional postings

## Production Deployment

For production deployment:

1. **Update URLs**: Change success/cancel URLs to your production domain
2. **Use Live Keys**: Switch from test to live Stripe keys
3. **Set Environment**: Ensure `NODE_ENV=production`
4. **Database**: Run all migration scripts on production database
5. **Webhooks**: Set up Stripe webhooks for production

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive configuration
- Regularly rotate API keys
- Monitor payment logs for suspicious activity

## Support

If you continue to have issues:

1. Check the browser console for errors
2. Check the server logs for API errors
3. Use the debug endpoints to verify configuration
4. Test with Stripe's test mode first
5. Verify all environment variables are set correctly
6. **Run the database schema verification script** 