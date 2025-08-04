'use client'

import { Metadata } from 'next'

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
  const fullDescription = description || 'Find the Best Allied Health Jobs in Australia. Browse Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions.'
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

  // This component now only generates structured data
  // Metadata should be handled by the page components using generateMetadata
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateStructuredData())
      }}
    />
  )
} 