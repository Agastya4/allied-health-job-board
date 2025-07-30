'use client'

import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'job'
  jobData?: {
    title: string
    company: string
    location: string
    salary?: string
    employmentType?: string
    datePosted: string
    validThrough: string
  }
  articleData?: {
    title: string
    description: string
    author: string
    publishedTime: string
    modifiedTime?: string
    section?: string
    tags?: string[]
  }
}

export function SEO({
  title,
  description,
  keywords = [],
  image = '/Logo.png',
  url,
  type = 'website',
  jobData,
  articleData
}: SEOProps) {
  const siteTitle = 'AlliedHealthJobs.au'
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const fullDescription = description || 'Find the best allied health jobs in Australia. Browse physiotherapy, occupational therapy, speech pathology, and other healthcare positions.'
  const fullUrl = url ? `https://alliedhealthjobs.au${url}` : 'https://alliedhealthjobs.au'

  // Generate structured data
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type === 'job' ? 'JobPosting' : type === 'article' ? 'Article' : 'WebSite',
      name: fullTitle,
      description: fullDescription,
      url: fullUrl,
      publisher: {
        '@type': 'Organization',
        name: siteTitle,
        url: 'https://alliedhealthjobs.au',
        logo: {
          '@type': 'ImageObject',
          url: 'https://alliedhealthjobs.au/Logo.png'
        }
      }
    }

    if (type === 'job' && jobData) {
      return {
        ...baseData,
        '@type': 'JobPosting',
        title: jobData.title,
        hiringOrganization: {
          '@type': 'Organization',
          name: jobData.company
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: jobData.location
          }
        },
        datePosted: jobData.datePosted,
        validThrough: jobData.validThrough,
        employmentType: jobData.employmentType || 'FULL_TIME',
        ...(jobData.salary && {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'AUD',
            value: jobData.salary
          }
        })
      }
    }

    if (type === 'article' && articleData) {
      return {
        ...baseData,
        '@type': 'Article',
        headline: articleData.title,
        author: {
          '@type': 'Person',
          name: articleData.author
        },
        datePublished: articleData.publishedTime,
        ...(articleData.modifiedTime && { dateModified: articleData.modifiedTime }),
        ...(articleData.section && { articleSection: articleData.section }),
        ...(articleData.tags && { keywords: articleData.tags.join(', ') })
      }
    }

    return baseData
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={`https://alliedhealthjobs.au${image}`} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_AU" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={`https://alliedhealthjobs.au${image}`} />
      <meta name="twitter:creator" content="@alliedhealthjobs" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={siteTitle} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#7c3aed" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData())
        }}
      />

      {/* Additional structured data for job board */}
      {type === 'website' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'JobPosting',
              title: 'Allied Health Jobs',
              description: 'Find allied health jobs in Australia',
              hiringOrganization: {
                '@type': 'Organization',
                name: 'AlliedHealthJobs.au'
              },
              jobLocation: {
                '@type': 'Place',
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'AU'
                }
              }
            })
          }}
        />
      )}
    </Head>
  )
} 