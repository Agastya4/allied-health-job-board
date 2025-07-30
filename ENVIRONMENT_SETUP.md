# Environment Variables Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

### Database
```bash
# Neon Database
DATABASE_URL="your-neon-database-url"
```

### Authentication
```bash
# JWT Secret (generate a strong random string)
JWT_SECRET="your-super-secret-jwt-key-here"
```

### Email (Resend)
```bash
# Resend API Key
RESEND_API_KEY="your-resend-api-key"
```

### File Upload (Vercel Blob)
```bash
# Vercel Blob Storage
VERCEL_BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### Payment Processing (Stripe)
```bash
# Stripe Keys
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

### Google Analytics & SEO
```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Google Tag Manager
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"

# Google Search Console Verification
GOOGLE_SEARCH_CONSOLE_VERIFICATION="your-google-verification-code"

# Bing Webmaster Tools
BING_WEBMASTER_VERIFICATION="your-bing-verification-code"

# Yandex Webmaster Tools
YANDEX_VERIFICATION="your-yandex-verification-code"
```

### User Experience Analytics
```bash
# Hotjar (User Behavior Analytics)
NEXT_PUBLIC_HOTJAR_ID="your-hotjar-id"

# Microsoft Clarity (Session Recording)
NEXT_PUBLIC_CLARITY_ID="your-clarity-id"

# FullStory (User Experience Analytics)
NEXT_PUBLIC_FULLSTORY_ID="your-fullstory-id"
```

### Social Media & Marketing
```bash
# Facebook Pixel
NEXT_PUBLIC_FACEBOOK_PIXEL_ID="your-facebook-pixel-id"

# LinkedIn Insight Tag
NEXT_PUBLIC_LINKEDIN_PARTNER_ID="your-linkedin-partner-id"

# Twitter Pixel
NEXT_PUBLIC_TWITTER_PIXEL_ID="your-twitter-pixel-id"
```

### Performance Monitoring
```bash
# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"

# LogRocket (Session Replay)
NEXT_PUBLIC_LOGROCKET_ID="your-logrocket-id"

# Mixpanel (Product Analytics)
NEXT_PUBLIC_MIXPANEL_TOKEN="your-mixpanel-token"
```

### SEO & Search
```bash
# Google Places API (for location autocomplete)
GOOGLE_PLACES_API_KEY="your-google-places-api-key"

# Bing Maps API
BING_MAPS_API_KEY="your-bing-maps-api-key"
```

## Setup Instructions

### 1. Google Analytics Setup
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Get your Measurement ID (starts with G-)
4. Add it to `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### 2. Google Search Console Setup
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (https://alliedhealthjobs.au)
3. Verify ownership (HTML tag method)
4. Copy the verification code to `GOOGLE_SEARCH_CONSOLE_VERIFICATION`

### 3. Google Tag Manager Setup
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new account and container
3. Get your Container ID (starts with GTM-)
4. Add it to `NEXT_PUBLIC_GTM_ID`

### 4. Hotjar Setup
1. Go to [Hotjar](https://www.hotjar.com/)
2. Create a new site
3. Get your Site ID
4. Add it to `NEXT_PUBLIC_HOTJAR_ID`

### 5. Microsoft Clarity Setup
1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Create a new project
3. Get your Project ID
4. Add it to `NEXT_PUBLIC_CLARITY_ID`

### 6. Social Media Pixels
- **Facebook Pixel**: Create in Facebook Ads Manager
- **LinkedIn Insight Tag**: Create in LinkedIn Campaign Manager
- **Twitter Pixel**: Create in Twitter Ads

### 7. Performance Monitoring
- **Sentry**: Create account at sentry.io
- **LogRocket**: Create account at logrocket.com
- **Mixpanel**: Create account at mixpanel.com

## Verification Steps

After setting up all environment variables:

1. **Test Google Analytics**:
   - Deploy your site
   - Visit your website
   - Check Google Analytics Real-Time reports

2. **Test Google Search Console**:
   - Submit your sitemap.xml
   - Request indexing of important pages

3. **Test Performance**:
   - Run Lighthouse audits
   - Check Core Web Vitals
   - Monitor error rates in Sentry

4. **Test SEO**:
   - Use Google's Rich Results Test
   - Check structured data with Google's testing tool
   - Verify meta tags with browser dev tools

## Security Notes

- Never commit `.env.local` to version control
- Use different API keys for development and production
- Regularly rotate sensitive keys
- Monitor API usage to prevent abuse

## Production Checklist

Before going live:

- [ ] All environment variables set
- [ ] Google Analytics tracking working
- [ ] Google Search Console verified
- [ ] Sitemap.xml accessible
- [ ] Robots.txt configured
- [ ] SSL certificate installed
- [ ] Performance optimized
- [ ] Error monitoring active
- [ ] Backup strategy in place 