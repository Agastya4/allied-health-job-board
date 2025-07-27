# Google Places API Setup

To use the faster Google Places API for location search, follow these steps:

## 1. Get a Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Places API**
   - **Geocoding API** (optional, for additional features)
4. Go to "Credentials" and create an API key
5. Restrict the API key to:
   - Only the APIs you enabled
   - Your domain (for security)

## 2. Add the API Key to Your Environment

Create a `.env.local` file in your project root and add:

```env
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_actual_api_key_here
```

## 3. Restart Your Development Server

After adding the environment variable, restart your Next.js development server:

```bash
npm run dev
# or
pnpm dev
```

## 4. Test the Location Search

The location search should now be much faster and more reliable!

## Performance Benefits

- **Speed**: ~100-200ms response time (vs 500-1000ms with OpenStreetMap)
- **Reliability**: Google's infrastructure is more stable
- **Accuracy**: Better city name recognition and formatting
- **Caching**: Built-in caching for repeated searches

## Cost

Google Places API has a generous free tier:
- 1,000 requests per day free
- $0.017 per 1,000 additional requests

For most job board applications, this will be well within the free tier.

## Fallback

If the Google Places API key is not configured, the component will show an error message and fall back to showing only the popular cities list. 