"use client"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { JobCard } from "@/components/job-card"
import type { Job } from "@/hooks/use-jobs"

interface JobListProps {
  jobs: Job[]
  loading: boolean
  onSelectJob: (job: Job) => void
  selectedJobId: number | null
  onPostJob: () => void
  shiftDown?: boolean // Add this prop
  title?: string // Add this prop
  prompt?: string // Add this prop
}

export function JobList({ jobs, loading, onSelectJob, selectedJobId, onPostJob, shiftDown, title, prompt }: JobListProps) {
  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-white dark:bg-zinc-950">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400">Loading jobs...</div>
        </div>
      </div>
    )
  }
  if (!loading && jobs.length === 0) {
    return (
      <div className="h-screen flex flex-col bg-white dark:bg-zinc-950">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400 text-center">
            <p>No jobs found matching your criteria.</p>
            <p className="mt-2 text-sm">Try adjusting your filters or check back later.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-950">
      {/* Render the title and prompt at the top of the job list panel if provided */}
      {title && (
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {prompt && <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{prompt}</div>}
        </div>
      )}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No jobs found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-4 px-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={{
                  ...job,
                  is_new: false,
                  company_logo_url: job.company_logo_url || "",
                  salary_range: job.salary_range ?? null,
                  posted_ago: job.posted_ago ?? null,
                  is_bookmarked: job.is_bookmarked ?? false,
                }}
                onClick={() => onSelectJob(job)}
                isSelected={job.id === selectedJobId}
                onBookmarkToggle={() => {}}
                shiftDown={shiftDown}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
