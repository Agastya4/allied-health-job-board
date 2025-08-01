'use client'

interface JobStructuredDataProps {
  jobs: Array<{
    id: string
    title: string
    company: string
    location: string
    salary?: string
    employmentType?: string
    datePosted: string
    validThrough: string
    description: string
    url: string
  }>
}

export function JobStructuredData({ jobs }: JobStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Allied Health Jobs",
    "description": "Find allied health jobs in Australia including physiotherapy, occupational therapy, speech pathology, and other healthcare positions.",
    "url": "https://alliedhealthjobs.au/jobs",
    "numberOfItems": jobs.length,
    "itemListElement": jobs.map((job, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description,
        "hiringOrganization": {
          "@type": "Organization",
          "name": job.company,
          "url": "https://alliedhealthjobs.au"
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": job.location,
            "addressCountry": "AU"
          }
        },
        "datePosted": job.datePosted,
        "validThrough": job.validThrough,
        "employmentType": job.employmentType || "FULL_TIME",
        "url": `https://alliedhealthjobs.au${job.url}`,
        ...(job.salary && {
          "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "AUD",
            "value": job.salary
          }
        })
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
} 