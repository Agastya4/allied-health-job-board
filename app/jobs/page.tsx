"use client"

import { StandardizedJobPreview } from "@/components/standardized-job-preview"
import { SEO } from "@/components/seo"

export default function JobBoardPage() {
  return (
    <>
      <SEO 
        title="Allied Health Jobs Australia - Find Healthcare Careers"
        description="Browse thousands of allied health jobs across Australia. Find physiotherapy, occupational therapy, speech pathology, and other healthcare positions. Apply directly to employers."
        keywords={[
          'allied health jobs Australia',
          'physiotherapy jobs',
          'occupational therapy jobs',
          'speech pathology jobs',
          'healthcare jobs Australia',
          'therapy jobs',
          'rehabilitation jobs',
          'allied health careers'
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