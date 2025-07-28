"use client"

import { useState, useEffect } from "react"
import { StandardizedJobPreview } from "@/components/standardized-job-preview"
import { Badge } from "@/components/ui/badge"

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
  const occupationName = occupationNames[occupation as keyof typeof occupationNames] || occupation

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
      <Badge variant="outline" className="bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300">
        Pre-filtered for {occupationName}
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