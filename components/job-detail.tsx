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
        <p>No job selected or job not found.</p>
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
    <div className="h-screen bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
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
            {job.job_type === "Remote" ? <Laptop className="h-3 w-3 mr-1" /> : <Building className="h-3 w-3 mr-1" />}
            {job.job_type}
          </Badge>
          <Badge
            variant="outline"
            className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300"
          >
            <GraduationCap className="h-3 w-3 mr-1" />
            {job.experience_level}
          </Badge>
          {job.work_setting && (
            <Badge
              variant="outline"
              className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300"
            >
              <Building className="h-3 w-3 mr-1" />
              {job.work_setting}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button onClick={handleApply} className="bg-violet-600 hover:bg-violet-700 text-white flex-1">
            <Users className="h-4 w-4 mr-2" />
            Apply Now
          </Button>
          <Link href={`/jobs/${job.id}-${jobSlug}`} passHref legacyBehavior>
            <Button variant="outline" className="flex-1 border-gray-300 dark:border-zinc-600 bg-transparent">
              View Full Page
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-6 space-y-8">
          {/* Job Description */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About this role</h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{jobDetails}</div>
            </div>
          </div>

          <Separator className="bg-gray-200 dark:bg-zinc-700" />

          {/* Job Categories */}
          {job.job_categories.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {job.job_categories.map((category, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300"
                  >
                    {category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Company Info */}
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About {job.company_name}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>{job.location_display}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Mail className="h-4 w-4" />
                <span>{job.contact_email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Phone className="h-4 w-4" />
                <span>{job.contact_phone}</span>
              </div>
              {job.company_website && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Building className="h-4 w-4" />
                  <a
                    href={job.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-600 hover:underline"
                  >
                    {job.company_website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex gap-3">
          <Button onClick={handleApply} className="bg-violet-600 hover:bg-violet-700 text-white flex-1">
            <Users className="h-4 w-4 mr-2" />
            Apply for this Position
          </Button>
        </div>
      </div>
    </div>
  )
}
