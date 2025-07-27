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
import { Button } from "@/components/ui/button"
import { Filter, List, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"

type MobileTab = 'jobs' | 'filters'

export default function JobBoardPage() {
  const { user, loading: authLoading } = useAuth()
  const [filters, setFilters] = useState<JobFilters>({})
  const { jobs, loading: jobsLoading } = useJobs(filters)
  const [selectedJob, setSelectedJob] = useState<Job | null>(jobs[0] || null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mobileTab, setMobileTab] = useState<MobileTab>('jobs')
  const router = useRouter()

  const handleJobSelect = (job: Job) => {
    // On mobile, navigate to the full job page instead of showing details
    if (window.innerWidth < 768) {
      // Create a proper job slug that matches the expected format
      const jobSlug = `${job.id}-${job.job_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`
      router.push(`/jobs/${jobSlug}`)
    } else {
      setSelectedJob(job)
    }
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
      {/* Desktop Layout - Hidden on Mobile */}
      <div className="hidden md:flex w-full h-full">
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
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col w-full h-full">
        {/* Mobile Content Area */}
        <div className="flex-1 overflow-hidden">
          {mobileTab === 'jobs' && (
            <div className="h-full">
              <JobList
                jobs={jobs}
                loading={jobsLoading}
                onSelectJob={handleJobSelect}
                selectedJobId={null}
                onPostJob={() => setShowAuthModal(true)}
              />
            </div>
          )}
          
          {mobileTab === 'filters' && (
            <div className="h-full overflow-y-auto">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                <JobSidebar 
                  user={user} 
                  onFiltersChange={setFilters} 
                  onPostJob={() => setShowAuthModal(true)}
                  initialFilters={filters}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="flex">
            <Button
              variant="ghost"
              className={`flex-1 py-3 flex flex-col items-center gap-1 ${
                mobileTab === 'jobs' 
                  ? 'text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setMobileTab('jobs')}
            >
              <List className="h-5 w-5" />
              <span className="text-xs">Jobs</span>
            </Button>
            
            <Button
              variant="ghost"
              className={`flex-1 py-3 flex flex-col items-center gap-1 ${
                mobileTab === 'filters' 
                  ? 'text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setMobileTab('filters')}
            >
              <Filter className="h-5 w-5" />
              <span className="text-xs">Filters</span>
            </Button>
          </div>
        </div>

        {/* Mobile Floating Action Button for Post Job */}
        {user && (
          <Button
            className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg md:hidden"
            onClick={() => setShowAuthModal(true)}
          >
            <PlusCircle className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Modals */}
      {showApplyModal && selectedJob && <ApplyJobModal job={selectedJob} onClose={() => setShowApplyModal(false)} />}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <AuthForm mode="signin" onClose={() => setShowAuthModal(false)} />
        </div>
      )}
    </div>
  )
} 