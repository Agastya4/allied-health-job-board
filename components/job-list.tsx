"use client"

import { JobCard } from "@/components/job-card"
import { useAuth } from "@/hooks/use-auth"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  work_setting?: string
  created_at?: string
}

interface JobListProps {
  jobs: Job[]
  loading: boolean
  title?: string
  prompt?: string
  selectedJobId?: number | null
  onJobSelect: (job: Job) => void
  onBookmarkToggle: (jobId: number) => void
}

export function JobList({ 
  jobs, 
  loading, 
  title, 
  prompt, 
  selectedJobId, 
  onJobSelect, 
  onBookmarkToggle 
}: JobListProps) {
  const { user } = useAuth()

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 dark:bg-zinc-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No jobs found matching your criteria.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Render the title and prompt at the top of the job list panel if provided */}
      {title && (
        <div className="px-3 md:px-4 pt-3 pb-2 flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h1>
          {prompt && <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{prompt}</div>}
        </div>
      )}
      <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0">
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No jobs found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-1.5 px-3 md:px-4 py-2">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => onJobSelect(job)}
                isSelected={selectedJobId === job.id}
                onBookmarkToggle={onBookmarkToggle}
                shiftDown={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
