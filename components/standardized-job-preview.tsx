"use client"

import React, { useState } from "react"
import { JobSidebar } from "@/components/job-sidebar"
import { JobList } from "@/components/job-list"
import { JobDetail } from "@/components/job-detail"
import { ApplyJobModal } from "@/components/apply-job-modal"
import { AuthForm } from "@/components/auth-form"
import { useAuth } from "@/hooks/use-auth"
import { useJobs, type JobFilters, type Job } from "@/hooks/use-jobs"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, List, PlusCircle, Search, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { getOccupationName, getOccupationSlug } from "@/lib/utils"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

type MobileTab = 'jobs' | 'filters'

interface StandardizedJobPreviewProps {
  // Initial filters to apply
  initialFilters?: JobFilters
  // Master search placeholder
  searchPlaceholder?: string
  // Title to display above job list
  title?: string
  // Prompt text below title
  prompt?: string
  // Whether to show the sidebar (default: true)
  showSidebar?: boolean
  // Whether to auto-select first job (default: false)
  autoSelectFirst?: boolean
  // Whether to shift job list down (for location pages)
  shiftDown?: boolean
  // Back button configuration
  backButton?: {
    href: string
    label: string
  }
  // Custom header content
  customHeader?: React.ReactNode
}

export function StandardizedJobPreview({
  initialFilters = {},
  searchPlaceholder = "Search for any job, company, location, or occupation...",
  title,
  prompt,
  showSidebar = true,
  autoSelectFirst = false,
  shiftDown = false,
  backButton,
  customHeader
}: StandardizedJobPreviewProps) {
  const { user, loading: authLoading } = useAuth()
  const [filters, setFilters] = useState<JobFilters>(initialFilters)
  const [masterSearch, setMasterSearch] = useState("")
  const { jobs, loading: jobsLoading } = useJobs(filters)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mobileTab, setMobileTab] = useState<MobileTab>('jobs')
  const router = useRouter()

  // Auto-select first job if enabled
  React.useEffect(() => {
    if (autoSelectFirst && jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0])
    }
  }, [jobs, selectedJob, autoSelectFirst])

  // Filter jobs by master search
  const filteredJobs = jobs
    .filter(job => {
      if (!masterSearch.trim()) return true
      
      const searchTerm = masterSearch.toLowerCase()
      const occupationName = getOccupationName(job.job_categories).toLowerCase()
      const occupationSlug = getOccupationSlug(getOccupationName(job.job_categories)).toLowerCase()
      
      return (
        job.job_title?.toLowerCase().includes(searchTerm) ||
        job.company_name?.toLowerCase().includes(searchTerm) ||
        job.job_details?.toLowerCase().includes(searchTerm) ||
        job.location_display?.toLowerCase().includes(searchTerm) ||
        occupationName.includes(searchTerm) ||
        occupationSlug.includes(searchTerm) ||
        // Also check if any of the job categories directly match the search term
        job.job_categories?.some(category => category.toLowerCase().includes(searchTerm)) ||
        false
      )
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

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
        {showSidebar && (
          <JobSidebar user={user} onFiltersChange={setFilters} onPostJob={() => setShowAuthModal(true)} />
        )}
        <div className="flex-1 flex flex-col h-full">
          {/* Master Search Header */}
          <div className="border-b border-gray-200 dark:border-zinc-800 p-4">
            {customHeader ? (
              customHeader
            ) : (
              <div className="flex items-center gap-4 mb-4">
                {backButton && (
                  <Link href={backButton.href}>
                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {backButton.label}
                    </Button>
                  </Link>
                )}
                {title && (
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h1>
                )}
              </div>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={masterSearch}
                onChange={(e) => setMasterSearch(e.target.value)}
                className="pl-10 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
              />
            </div>
          </div>
          
          <ResizablePanelGroup direction="horizontal" className="h-full w-full min-h-0">
            <ResizablePanel defaultSize={45} minSize={25} maxSize={70}>
              <JobList
                jobs={filteredJobs}
                loading={jobsLoading}
                onSelectJob={handleJobSelect}
                selectedJobId={selectedJob ? selectedJob.id : null}
                onPostJob={() => setShowAuthModal(true)}
                shiftDown={shiftDown}
                title={title}
                prompt={prompt}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={55} minSize={30} maxSize={75} className="h-full min-h-0">
              <div className="h-full min-h-0">
                <JobDetail
                  job={selectedJob}
                  onClose={() => setSelectedJob(null)}
                  onApply={handleApplyJob}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col w-full h-full">
        {/* Mobile Header with Master Search */}
        <div className="border-b border-gray-200 dark:border-zinc-800 p-4">
          {customHeader ? (
            customHeader
          ) : (
            <div className="flex items-center gap-4 mb-4">
              {backButton && (
                <Link href={backButton.href}>
                  <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {backButton.label}
                  </Button>
                </Link>
              )}
              {title && (
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h1>
              )}
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search jobs..."
              value={masterSearch}
              onChange={(e) => setMasterSearch(e.target.value)}
              className="pl-10 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
            />
          </div>
        </div>
        
        {/* Mobile Content Area */}
        <div className="flex-1 overflow-hidden">
          {mobileTab === 'jobs' && (
            <div className="h-full">
              <JobList
                jobs={filteredJobs}
                loading={jobsLoading}
                onSelectJob={handleJobSelect}
                selectedJobId={null}
                onPostJob={() => setShowAuthModal(true)}
                shiftDown={shiftDown}
                title={title}
                prompt={prompt}
              />
            </div>
          )}
          
          {mobileTab === 'filters' && showSidebar && (
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
            
            {showSidebar && (
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
            )}
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