/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'vercel-blob.com',
      'prucvxqlaz88anms.public.blob.vercel-storage.com',
    ],
    formats: ['image/webp', 'image/avif'],
    // Recommended blog image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

export default nextConfig
