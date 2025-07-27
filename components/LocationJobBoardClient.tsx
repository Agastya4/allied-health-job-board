"use client";
import { useState, useEffect } from "react";
import { JobSidebar } from "@/components/job-sidebar";
import { JobList } from "@/components/job-list";
import { JobDetail } from "@/components/job-detail";
import { ApplyJobModal } from "@/components/apply-job-modal";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import type { Job, JobFilters } from "@/hooks/use-jobs";
import { useJobs } from "@/hooks/use-jobs";

// Helper function to normalize location strings
function normalizeLocation(str: string): string {
  return str ? str.trim().toLowerCase().replace(/\s+/g, '-') : '';
}

// Helper function to denormalize location strings for display
function denormalizeLocation(str: string): string {
  return str ? str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '';
}

export default function LocationJobBoardClient({ city, state, category, title, prompt }: { city: string; state: string; category: string; title?: string; prompt?: string }) {
  // Normalize the incoming parameters to match database format
  const normalizedCity = normalizeLocation(city);
  const normalizedState = normalizeLocation(state);
  
  const initialFilters: JobFilters = {
    city: normalizedCity || undefined,
    state: normalizedState || undefined,
    occupation: category || undefined,
  };
  
  const [filters, setFilters] = useState<JobFilters>(initialFilters);
  const { jobs, loading } = useJobs(filters);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Update filters when URL parameters change
  useEffect(() => {
    const newFilters: JobFilters = {
      city: normalizedCity || undefined,
      state: normalizedState || undefined,
      occupation: category || undefined,
    };
    setFilters(newFilters);
  }, [normalizedCity, normalizedState, category]);

  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
    if (jobs.length === 0 && selectedJob) {
      setSelectedJob(null);
    }
  }, [jobs, selectedJob]);

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  const handleApplyJob = (job: Job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleFiltersChange = (newFilters: JobFilters) => {
    // Preserve the location and category filters from the URL
    const updatedFilters = {
      ...newFilters,
      city: normalizedCity || newFilters.city,
      state: normalizedState || newFilters.state,
      occupation: category || newFilters.occupation,
    };
    setFilters(updatedFilters);
  };

  return (
    <div className="h-full w-full min-h-0 flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-white overflow-hidden">
      <JobSidebar 
        user={null} 
        onFiltersChange={handleFiltersChange} 
        onPostJob={() => {}} 
        initialFilters={initialFilters} 
      />
      <div className="flex-1 flex flex-col h-full min-h-0">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full min-h-0">
          <ResizablePanel defaultSize={45} minSize={25} maxSize={70} className="h-full min-h-0">
            <JobList
              jobs={jobs}
              loading={loading}
              onSelectJob={handleJobSelect}
              selectedJobId={selectedJob ? selectedJob.id : null}
              onPostJob={() => {}}
              shiftDown={true}
              title={title}
              prompt={prompt}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={55} minSize={30} maxSize={75} className="h-full min-h-0">
            <JobDetail
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
              onApply={handleApplyJob}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
        {showApplyModal && selectedJob && (
          <ApplyJobModal job={selectedJob} onClose={() => setShowApplyModal(false)} />
        )}
      </div>
    </div>
  );
} 