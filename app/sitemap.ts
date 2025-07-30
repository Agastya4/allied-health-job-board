import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alliedhealthjobs.au'
  
  // Static pages - these are the most important
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
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/post-job`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/career-info`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Location pages
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

  // Occupation pages
  const occupationPages = [
    'physiotherapist',
    'occupational-therapist', 
    'speech-pathologist',
    'podiatrist',
    'dietitian',
    'exercise-physiologist',
    'osteopath',
    'chiropractor',
  ].map(occupation => ({
    url: `${baseUrl}/jobs/occupation/${occupation}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...locationPages, ...occupationPages]
} 