import { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/blog-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alliedhealthjobs.au'
  
  // Get all blog posts
  const blogPosts = getAllBlogPosts()
  
  // Static pages - ALL pages in your app
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },

    {
      url: `${baseUrl}/career-info`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/career-info/physiotherapy`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/employer`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/post-job`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Blog post pages
  const blogPages = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Location pages - All Australian states
  const locationPages = [
    { state: 'nsw', name: 'New South Wales' },
    { state: 'vic', name: 'Victoria' },
    { state: 'qld', name: 'Queensland' },
    { state: 'wa', name: 'Western Australia' },
    { state: 'sa', name: 'South Australia' },
    { state: 'tas', name: 'Tasmania' },
    { state: 'act', name: 'Australian Capital Territory' },
    { state: 'nt', name: 'Northern Territory' },
  ].map(location => ({
    url: `${baseUrl}/locations/${location.state}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // City pages - ALL cities from your seo-links.ts
  const cityPages = [
    // NSW cities
    { state: 'nsw', city: 'sydney' },
    { state: 'nsw', city: 'newcastle' },
    { state: 'nsw', city: 'wollongong' },
    { state: 'nsw', city: 'central-coast' },
    { state: 'nsw', city: 'coffs-harbour' },
    { state: 'nsw', city: 'wagga-wagga' },
    // VIC cities
    { state: 'vic', city: 'melbourne' },
    { state: 'vic', city: 'geelong' },
    { state: 'vic', city: 'ballarat' },
    { state: 'vic', city: 'bendigo' },
    { state: 'vic', city: 'shepparton' },
    // QLD cities
    { state: 'qld', city: 'brisbane' },
    { state: 'qld', city: 'gold-coast' },
    { state: 'qld', city: 'cairns' },
    { state: 'qld', city: 'townsville' },
    { state: 'qld', city: 'sunshine-coast' },
    { state: 'qld', city: 'toowoomba' },
    // SA cities
    { state: 'sa', city: 'adelaide' },
    { state: 'sa', city: 'mount-gambier' },
    { state: 'sa', city: 'whyalla' },
    // WA cities
    { state: 'wa', city: 'perth' },
    { state: 'wa', city: 'bunbury' },
    { state: 'wa', city: 'geraldton' },
    { state: 'wa', city: 'albany' },
    // TAS cities
    { state: 'tas', city: 'hobart' },
    { state: 'tas', city: 'launceston' },
    { state: 'tas', city: 'devonport' },
    { state: 'tas', city: 'burnie' },
    // ACT cities
    { state: 'act', city: 'canberra' },
    // NT cities
    { state: 'nt', city: 'darwin' },
    { state: 'nt', city: 'alice-springs' },
  ].map(location => ({
    url: `${baseUrl}/locations/${location.state}/${location.city}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Occupation pages - All job categories
  const occupationPages = [
    'physiotherapy',
    'occupational-therapy',
    'speech-pathology',
    'psychology',
    'dietetics-nutrition',
    'social-work',
    'podiatry',
    'audiology',
    'exercise-physiology',
    'optometry',
    'pharmacy',
    'radiography',
  ].map(occupation => ({
    url: `${baseUrl}/jobs/occupation/${occupation}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Career info profession pages
  const professionPages = [
    'physiotherapist',
    'occupational-therapist',
    'speech-pathologist',
    'psychologist',
    'dietitian',
    'social-worker',
    'podiatrist',
    'audiologist',
    'exercise-physiologist',
    'optometrist',
    'pharmacist',
    'radiographer',
  ].map(profession => ({
    url: `${baseUrl}/career-info/${profession}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Location + Category combinations - Only include valid combinations
  const locationCategoryPages = [
    // Generate valid combinations only
    ...['nsw', 'vic', 'qld', 'wa', 'sa', 'tas', 'act', 'nt'].flatMap(state => 
      ['sydney', 'newcastle', 'wollongong', 'central-coast', 'coffs-harbour', 'wagga-wagga',
       'melbourne', 'geelong', 'ballarat', 'bendigo', 'shepparton',
       'brisbane', 'gold-coast', 'cairns', 'townsville', 'sunshine-coast', 'toowoomba',
       'adelaide', 'mount-gambier', 'whyalla',
       'perth', 'bunbury', 'geraldton', 'albany',
       'hobart', 'launceston', 'devonport', 'burnie',
       'canberra',
       'darwin', 'alice-springs'].filter(city => {
         // Filter cities by state to ensure valid combinations
         if (state === 'nsw') return ['sydney', 'newcastle', 'wollongong', 'central-coast', 'coffs-harbour', 'wagga-wagga'].includes(city)
         if (state === 'vic') return ['melbourne', 'geelong', 'ballarat', 'bendigo', 'shepparton'].includes(city)
         if (state === 'qld') return ['brisbane', 'gold-coast', 'cairns', 'townsville', 'sunshine-coast', 'toowoomba'].includes(city)
         if (state === 'sa') return ['adelaide', 'mount-gambier', 'whyalla'].includes(city)
         if (state === 'wa') return ['perth', 'bunbury', 'geraldton', 'albany'].includes(city)
         if (state === 'tas') return ['hobart', 'launceston', 'devonport', 'burnie'].includes(city)
         if (state === 'act') return ['canberra'].includes(city)
         if (state === 'nt') return ['darwin', 'alice-springs'].includes(city)
         return false
       }).flatMap(city =>
         ['physiotherapy', 'occupational-therapy', 'speech-pathology', 'psychology', 'dietetics-nutrition', 'social-work', 'podiatry', 'audiology', 'exercise-physiology', 'optometry', 'pharmacy', 'radiography'].map(category => ({
           state,
           city,
           category
         }))
       )
    )
  ].map(location => ({
    url: `${baseUrl}/locations/${location.state}/${location.city}/${location.category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Remove any duplicate URLs
  const allUrls = new Set<string>()
  const uniquePages = [
    ...staticPages, 
    ...blogPages,
    ...locationPages, 
    ...cityPages,
    ...occupationPages, 
    ...professionPages,
    ...locationCategoryPages
  ].filter(page => {
    if (allUrls.has(page.url)) {
      return false
    }
    allUrls.add(page.url)
    return true
  })

  return uniquePages
} 