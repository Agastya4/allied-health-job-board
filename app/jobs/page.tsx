"use client"

import { StandardizedJobPreview } from "@/components/standardized-job-preview"
import { SEO } from "@/components/seo"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Allied Health Jobs Australia - Find Healthcare Careers",
  description: "Browse Thousands of Allied Health Jobs Across Australia. Find Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions. Apply Directly to Employers.",
  keywords: [
    'Allied Health Jobs Australia',
    'Physiotherapy Jobs',
    'Occupational Therapy Jobs',
    'Speech Pathology Jobs',
    'Healthcare Jobs Australia',
    'Therapy Jobs',
    'Rehabilitation Jobs',
    'Allied Health Careers'
  ],
  openGraph: {
    title: "Allied Health Jobs Australia - Find Healthcare Careers",
    description: "Browse Thousands of Allied Health Jobs Across Australia. Find Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions.",
    url: "https://alliedhealthjobs.au/jobs",
    siteName: "AlliedHealthJobs.au",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "Allied Health Jobs Australia",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Allied Health Jobs Australia - Find Healthcare Careers",
    description: "Browse Thousands of Allied Health Jobs Across Australia. Find Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions.",
    images: ["/Logo.png"],
    creator: "@alliedhealthjobs",
  },
  alternates: {
    canonical: "https://alliedhealthjobs.au/jobs",
  },
}

export default function JobBoardPage() {
  return (
    <>
      <SEO 
        title="Allied Health Jobs Australia - Find Healthcare Careers"
        description="Browse Thousands of Allied Health Jobs Across Australia. Find Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions. Apply Directly to Employers."
        keywords={[
          'Allied Health Jobs Australia',
          'Physiotherapy Jobs',
          'Occupational Therapy Jobs',
          'Speech Pathology Jobs',
          'Healthcare Jobs Australia',
          'Therapy Jobs',
          'Rehabilitation Jobs',
          'Allied Health Careers'
        ]}
        url="/jobs"
        type="website"
      />
      <StandardizedJobPreview
        autoSelectFirst={true}
      />
    </>
  )
} 