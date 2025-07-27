# Blog Image Guidelines

## Overview
The blog posting feature is restricted to the admin user (patelagastya1@gmail.com) and includes image attachment capabilities for blog post covers.

## Image Specifications

### **Recommended Blog Post Cover Image Sizes:**
- **Optimal Size**: 1200px × 630px (2:1 aspect ratio)
- **Minimum Size**: 600px × 315px
- **Maximum Size**: 10MB
- **Supported Formats**: JPG, PNG, WebP, AVIF

### **Company Logo Sizes (Job Postings):**
- **Optimal Size**: 400px × 400px (1:1 aspect ratio)
- **Minimum Size**: 200px × 200px
- **Maximum Size**: 5MB
- **Supported Formats**: JPG, PNG, WebP, AVIF

## Technical Details

### **Upload Storage:**
- Blog images are stored in: `blog-images/` directory
- Company logos are stored in: `logos/` directory
- All images are served via Vercel Blob Storage
- Images are automatically optimized for web delivery

### **Image Optimization:**
- Next.js automatically serves WebP/AVIF formats to supported browsers
- Responsive images with multiple sizes for different screen sizes
- Automatic compression and optimization

### **File Naming Convention:**
- Blog images: `blog-images/{user-id}-{timestamp}-{filename}`
- Company logos: `logos/{user-id}-{timestamp}-{filename}`

## Best Practices

### **For Blog Cover Images:**
1. Use high-quality, relevant images
2. Ensure good contrast for text overlay
3. Avoid busy backgrounds that make text hard to read
4. Test how the image looks at different screen sizes
5. Keep file sizes under 2MB for faster loading

### **For Company Logos:**
1. Use transparent backgrounds when possible
2. Ensure the logo is clear at small sizes
3. Use vector formats (SVG) when possible for logos
4. Maintain consistent branding across job postings

## Admin Access
Only the user with email `patelagastya1@gmail.com` can access the blog posting form with image upload functionality.

## Error Handling
- File size validation (5MB for logos, 10MB for blog images)
- File type validation (images only)
- Automatic fallback to placeholder images if upload fails 