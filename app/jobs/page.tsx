"use client"

import { useState } from "react"
import { JobSidebar } from "@/components/job-sidebar"
import { JobList } from "@/components/job-list"
import { JobDetail } from "@/components/job-detail"
import { ApplyJobModal } from "@/components/apply-job-modal"
import { AuthForm } from "@/components/auth-form"
import { useAuth } from "@/hooks/use-auth"
import { useJobs, type JobFilters, type Job } from "@/hooks/use-jobs"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"

export default function JobBoardPage() {
  const { user, loading: authLoading } = useAuth()
  const [filters, setFilters] = useState<JobFilters>({})
  const { jobs, loading: jobsLoading } = useJobs(filters)
  const [selectedJob, setSelectedJob] = useState<Job | null>(jobs[0] || null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job)
  }

  const handleApplyJob = (job: Job) => {
    setSelectedJob(job)
    setShowApplyModal(true)
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-white overflow-hidden">
      <JobSidebar user={user} onFiltersChange={setFilters} onPostJob={() => setShowAuthModal(true)} />
      <div className="flex-1 flex flex-col h-full">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={45} minSize={25} maxSize={70}>
            <JobList
              jobs={jobs}
              loading={jobsLoading}
              onSelectJob={handleJobSelect}
              selectedJobId={selectedJob ? selectedJob.id : null}
              onPostJob={() => setShowAuthModal(true)}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={55} minSize={30} maxSize={75}>
            <JobDetail
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
              onApply={handleApplyJob}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {showApplyModal && selectedJob && <ApplyJobModal job={selectedJob} onClose={() => setShowApplyModal(false)} />}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <AuthForm mode="signin" onClose={() => setShowAuthModal(false)} />
        </div>
      )}
    </div>
  )
} 