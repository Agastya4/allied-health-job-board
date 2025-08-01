"use client"

import { useState } from "react"
import { JobCard } from "@/components/job-card"
import { useRouter } from "next/navigation"

interface Job {
  id: number
  job_title: string
  company_name: string
  company_logo_url: string
  is_new: boolean
  is_featured: boolean
  location_display: string
  job_type: string
  experience_level: string
  salary_range: string | null
  posted_ago: string | null
  is_bookmarked: boolean
  job_details?: string
  job_categories?: string[]
}

interface JobCardWrapperProps {
  job: Job
}

export function JobCardWrapper({ job }: JobCardWrapperProps) {
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(job.is_bookmarked)

  const handleClick = () => {
    // Navigate to job detail page
    router.push(`/jobs/${job.id}`)
  }

  const handleBookmarkToggle = (jobId: number) => {
    setIsBookmarked(!isBookmarked)
    // Here you could also make an API call to update the bookmark status
    // For now, we'll just update the local state
  }

  return (
    <JobCard
      job={{
        ...job,
        is_bookmarked: isBookmarked
      }}
      onClick={handleClick}
      isSelected={false}
      onBookmarkToggle={handleBookmarkToggle}
    />
  )
} 