# 🚀 DAY 1-2 SETUP GUIDE: ANALYTICS & TRACKING

## IMMEDIATE ACTIONS (Next 48 Hours)

### Step 1: Create Environment Variables File

Create a `.env.local` file in your project root with these variables:

```bash
# Database
DATABASE_URL="your-neon-database-url"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-here"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"

# File Upload (Vercel Blob)
VERCEL_BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Payment Processing (Stripe)
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Google Analytics & SEO (CRITICAL FOR DAY 1)
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"
GOOGLE_SEARCH_CONSOLE_VERIFICATION="your-google-verification-code"
BING_WEBMASTER_VERIFICATION="your-bing-verification-code"
YANDEX_VERIFICATION="your-yandex-verification-code"

# User Experience Analytics (CRITICAL FOR DAY 1)
NEXT_PUBLIC_HOTJAR_ID="your-hotjar-id"
NEXT_PUBLIC_CLARITY_ID="your-clarity-id"
NEXT_PUBLIC_FULLSTORY_ID="your-fullstory-id"

# Social Media & Marketing
NEXT_PUBLIC_FACEBOOK_PIXEL_ID="your-facebook-pixel-id"
NEXT_PUBLIC_LINKEDIN_PARTNER_ID="your-linkedin-partner-id"
NEXT_PUBLIC_TWITTER_PIXEL_ID="your-twitter-pixel-id"

# Performance Monitoring
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_LOGROCKET_ID="your-logrocket-id"
NEXT_PUBLIC_MIXPANEL_TOKEN="your-mixpanel-token"

# SEO & Search
GOOGLE_PLACES_API_KEY="your-google-places-api-key"
BING_MAPS_API_KEY="your-bing-maps-api-key"
```

### Step 2: Google Analytics 4 Setup (CRITICAL)

1. **Go to Google Analytics**: https://analytics.google.com/
2. **Create Account**: "AlliedHealthJobs.au"
3. **Create Property**: "AlliedHealthJobs.au Website"
4. **Get Measurement ID**: Copy the G-XXXXXXXXXX code
5. **Add to .env.local**: `NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"`

### Step 3: Google Search Console Setup (CRITICAL)

1. **Go to Google Search Console**: https://search.google.com/search-console
2. **Add Property**: https://alliedhealthjobs.au
3. **Verify Ownership**: Use HTML tag method
4. **Copy Verification Code**: Add to `GOOGLE_SEARCH_CONSOLE_VERIFICATION`
5. **Submit Sitemap**: https://alliedhealthjobs.au/sitemap.xml

### Step 4: Google Tag Manager Setup

1. **Go to Google Tag Manager**: https://tagmanager.google.com/
2. **Create Account**: "AlliedHealthJobs.au"
3. **Create Container**: "Website"
4. **Get Container ID**: Copy the GTM-XXXXXXX code
5. **Add to .env.local**: `NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"`

### Step 5: Hotjar Setup (User Behavior Analytics)

1. **Go to Hotjar**: https://www.hotjar.com/
2. **Create Account**: Sign up for free plan
3. **Add Site**: https://alliedhealthjobs.au
4. **Get Site ID**: Copy the ID number
5. **Add to .env.local**: `NEXT_PUBLIC_HOTJAR_ID="your-hotjar-id"`

### Step 6: Microsoft Clarity Setup (Session Recording)

1. **Go to Microsoft Clarity**: https://clarity.microsoft.com/
2. **Create Account**: Sign up for free
3. **Create Project**: "AlliedHealthJobs.au"
4. **Get Project ID**: Copy the ID
5. **Add to .env.local**: `NEXT_PUBLIC_CLARITY_ID="your-clarity-id"`

### Step 7: Deploy and Test

1. **Deploy to Vercel**: `git push` to trigger deployment
2. **Test Analytics**: Visit your site and check Google Analytics Real-Time
3. **Test Search Console**: Verify sitemap submission
4. **Test Hotjar**: Check if session recording works
5. **Test Clarity**: Verify session recording

## ✅ VERIFICATION CHECKLIST

After completing all steps:

- [ ] Google Analytics tracking working
- [ ] Google Search Console verified
- [ ] Sitemap submitted and indexed
- [ ] Hotjar recording sessions
- [ ] Clarity recording sessions
- [ ] All environment variables set
- [ ] Site deployed and accessible

## 🎯 NEXT STEPS (Day 3-4)

Once Day 1-2 is complete, we'll move to:

1. **Content Creation**: 10 high-quality blog posts
2. **Page-Specific SEO**: Add SEO component to all pages
3. **Performance Optimization**: Image optimization, lazy loading
4. **Testing**: SEO testing, performance testing

## 🚨 CRITICAL SUCCESS FACTORS

1. **Complete ALL steps above** - Don't skip any
2. **Test everything** - Verify each tool is working
3. **Monitor data** - Check analytics daily
4. **Be patient** - SEO takes time to show results

## 📊 EXPECTED RESULTS

After Day 1-2 completion:
- ✅ Analytics tracking active
- ✅ Search engines aware of your site
- ✅ User behavior data collection
- ✅ Foundation for SEO success

**Ready to proceed with Day 3-4 content creation once Day 1-2 is complete!** 