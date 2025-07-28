"use client"
import Image from "next/image"
import {
  X,
  MapPin,
  DollarSign,
  Briefcase,
  GraduationCap,
  Laptop,
  Building,
  Clock,
  Users,
  Star,
  Bookmark,
  BookmarkCheck,
  Mail,
  Phone,
  ArrowLeft,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Job } from "@/hooks/use-jobs"
import Link from "next/link"
import { slugify } from "@/lib/utils"

interface JobDetailProps {
  job: Job | null
  onClose: () => void
  onApply: (job: Job) => void
}

export function JobDetail({ job, onClose, onApply }: JobDetailProps) {
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-gray-600 dark:text-gray-400">
        <div className="text-center">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a Job</h3>
          <p className="text-gray-600 dark:text-gray-400">Choose a job from the list to view details</p>
        </div>
      </div>
    )
  }

  const handleApply = () => {
    onApply(job)
  }

  const jobSlug = slugify(`${job.job_title}-${job.location_display || ''}`)
  // Remove requirements extraction logic
  let jobDetails = job.job_details
  return (
    <div className="h-full bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 flex flex-col">
      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b border-gray-200 dark:border-zinc-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{job.job_title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{job.company_name}</p>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block p-6 border-b border-gray-200 dark:border-zinc-800 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Image
              src={job.company_logo_url || "/placeholder.svg"}
              alt={`${job.company_name} logo`}
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-zinc-700"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{job.job_title}</h1>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">{job.company_name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location_display}</span>
                    {job.posted_ago && (
                      <>
                        <span>•</span>
                        <Clock className="h-4 w-4" />
                        <span>Posted {job.posted_ago}</span>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {job.salary_range && (
            <Badge
              variant="outline"
              className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300"
            >
              <DollarSign className="h-3 w-3 mr-1" />
              {job.salary_range}
            </Badge>
          )}
          <Badge
            variant="outline"
            className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300"
          >
            <Briefcase className="h-3 w-3 mr-1" />
            {job.job_type}
          </Badge>
          <Badge
            variant="outline"
            className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300"
          >
            <GraduationCap className="h-3 w-3 mr-1" />
            {job.experience_level}
          </Badge>
        </div>
      </div>

      {/* Mobile Company Info */}
      <div className="md:hidden p-4 border-b border-gray-200 dark:border-zinc-800 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={job.company_logo_url || "/placeholder.svg"}
            alt={`${job.company_name} logo`}
            width={60}
            height={60}
            className="w-15 h-15 object-cover rounded-lg border border-gray-200 dark:border-zinc-700"
          />
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{job.company_name}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>{job.location_display}</span>
            </div>
          </div>
        </div>
        
        {/* Mobile Badges */}
        <div className="flex flex-wrap gap-2">
          {job.salary_range && (
            <Badge
              variant="outline"
              className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 text-xs"
            >
              <DollarSign className="h-3 w-3 mr-1" />
              {job.salary_range}
            </Badge>
          )}
          <Badge
            variant="outline"
            className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 text-xs"
          >
            <Briefcase className="h-3 w-3 mr-1" />
            {job.job_type}
          </Badge>
          <Badge
            variant="outline"
            className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 text-xs"
          >
            <GraduationCap className="h-3 w-3 mr-1" />
            {job.experience_level}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
        <div className="p-4 md:p-6 pb-8 flex-1">
          {/* Job Details */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Job Description</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
                {jobDetails}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Company Information */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Company Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Building className="h-4 w-4" />
                <span>{job.company_name}</span>
              </div>
              {job.practice_location && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>{job.practice_location}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Mail className="h-4 w-4" />
                <span>{job.contact_email}</span>
              </div>
              {job.contact_phone && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Phone className="h-4 w-4" />
                  <span>{job.contact_phone}</span>
                </div>
              )}
              {job.company_website && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Laptop className="h-4 w-4" />
                  <Link
                    href={job.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-700 dark:text-violet-400 hover:underline"
                  >
                    {job.company_website}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Quick Actions */}
          <div className="space-y-3">
            <Link
              href={`/jobs/${job.id}-${jobSlug}`}
              className="block w-full"
            >
              <Button className="w-full border-2 border-violet-600 text-violet-600 hover:bg-violet-50 h-12 md:h-10" variant="outline">
                View Full Page
              </Button>
            </Link>
            <Button
              onClick={handleApply}
              className="w-full border-2 border-violet-600 text-violet-600 hover:bg-violet-50 h-12 md:h-10"
              variant="outline"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Apply Button (remove, now handled by sticky desktop section) */}
    </div>
  )
}
