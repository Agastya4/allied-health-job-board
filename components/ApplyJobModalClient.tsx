"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ApplyJobModal } from "@/components/apply-job-modal"
import type { Job } from "@/hooks/use-jobs"

export default function ApplyJobModalClient({ job, fullWidth }: { job: Job, fullWidth?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        className={fullWidth ? "w-full block bg-violet-600 hover:bg-violet-700 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}
        onClick={() => setOpen(true)}
      >
        Apply Now
      </Button>
      {open && <ApplyJobModal job={job} onClose={() => setOpen(false)} />}
    </>
  )
} 