"use client"

import { StandardizedJobPreview } from "@/components/standardized-job-preview"
import { SEO } from "@/components/seo"

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