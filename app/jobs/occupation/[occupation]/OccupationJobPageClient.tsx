"use client"

import { useState, useEffect } from "react"
import { StandardizedJobPreview } from "@/components/standardized-job-preview"
import { Badge } from "@/components/ui/badge"
import { useJobs } from "@/hooks/use-jobs"
import { getJobsForCategoryPage } from "@/lib/job-sorter"
import type { Job } from "@/lib/database"

const occupationNames = {
  "physiotherapy": "Physiotherapy",
  "occupational-therapy": "Occupational Therapy", 
  "speech-pathology": "Speech Pathology",
  "psychology": "Psychology",
  "dietetics-nutrition": "Dietetics & Nutrition",
  "social-work": "Social Work",
  "podiatry": "Podiatry",
  "audiology": "Audiology",
  "exercise-physiology": "Exercise Physiology",
  "optometry": "Optometry",
  "pharmacy": "Pharmacy",
  "radiography": "Radiography"
}

interface OccupationJobPageClientProps {
  occupation: string
}

export default function OccupationJobPageClient({ occupation }: OccupationJobPageClientProps) {
  const [masterSearch, setMasterSearch] = useState("")
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const occupationName = occupationNames[occupation as keyof typeof occupationNames] || occupation

  // Get all jobs
  const { jobs, loading } = useJobs()

  // Filter jobs for this occupation
  useEffect(() => {
    if (jobs.length > 0) {
      // Convert jobs to the correct type for the job sorter
      const jobsWithCorrectType = jobs.map(job => ({
        ...job,
        created_at: new Date(job.created_at),
        updated_at: new Date(job.updated_at)
      })) as Job[]
      
      const filtered = getJobsForCategoryPage(jobsWithCorrectType, occupation)
      setFilteredJobs(filtered)
    }
  }, [jobs, occupation])

  // Set master search to occupation name when component mounts
  useEffect(() => {
    if (occupation) {
      setMasterSearch(occupationName)
    }
  }, [occupation, occupationName])

  const customHeader = (
    <div className="flex items-center gap-4 mb-4">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
        {occupationName} Jobs
      </h1>
      <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
        {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
      </Badge>
    </div>
  )

  return (
    <StandardizedJobPreview
      initialFilters={{ occupation }}
      searchPlaceholder={`Search ${occupationName} jobs, companies, or keywords...`}
      backButton={{
        href: "/career-info",
        label: "Back to Career Info"
      }}
      customHeader={customHeader}
      showSidebar={false}
    />
  )
} 