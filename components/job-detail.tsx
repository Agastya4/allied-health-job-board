"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, MapPin, DollarSign, Briefcase, GraduationCap, Building, Calendar, Clock, ExternalLink, Send } from "lucide-react"
import Image from "next/image"
import { cn, getOccupationName } from "@/lib/utils"

interface Job {
  id: number
  job_title: string
  company_name: string
  company_logo_url: string
  location_display: string
  job_type: string
  experience_level: string
  salary_range: string | null
  job_details: string
  job_categories: string[]
  work_setting?: string
  contact_email?: string
  contact_phone?: string
  company_website?: string
  created_at?: string
}

interface JobDetailProps {
  job: Job
  onClose: () => void
  onApply: () => void
}

// Function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
}

export function JobDetail({ job, onClose, onApply }: JobDetailProps) {
  // Ensure logoSrc is always a valid, non-empty string
  const logoSrc = job.company_logo_url && job.company_logo_url.trim() !== "" ? job.company_logo_url : "/placeholder.svg"

  // Format posted date
  const postedDate = job.created_at ? formatTimeAgo(job.created_at) : "Recently"

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
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{job.job_title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{job.company_name}</p>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block p-6 border-b border-gray-200 dark:border-zinc-800 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{job.job_title}</h1>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span className="font-medium">{job.company_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location_display}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Posted {postedDate}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="space-y-6">
          {/* Company Information */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
            <div className="w-16 h-16 bg-white dark:bg-zinc-700 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 dark:border-zinc-600">
              <Image
                src={logoSrc}
                alt={`${job.company_name} logo`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{job.company_name}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-violet-600 text-white">
                  {getOccupationName(job.job_categories)}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.location_display}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {job.job_type}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  {job.experience_level}
                </Badge>
                {job.salary_range && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {job.salary_range}
                  </Badge>
                )}
                {job.work_setting && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {job.work_setting}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Job Description</h3>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {job.job_details}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {(job.contact_email || job.contact_phone || job.company_website) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h3>
              <div className="space-y-2">
                {job.contact_email && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Email:</span>
                    <a 
                      href={`mailto:${job.contact_email}`}
                      className="text-violet-600 dark:text-violet-400 hover:underline"
                    >
                      {job.contact_email}
                    </a>
                  </div>
                )}
                {job.contact_phone && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Phone:</span>
                    <a 
                      href={`tel:${job.contact_phone}`}
                      className="text-violet-600 dark:text-violet-400 hover:underline"
                    >
                      {job.contact_phone}
                    </a>
                  </div>
                )}
                {job.company_website && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Website:</span>
                    <a 
                      href={job.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                    >
                      Visit website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 md:p-6 border-t border-gray-200 dark:border-zinc-800 flex-shrink-0">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => window.open(`/jobs/${job.id}-${(job.job_title + '-' + (job.location_display || '')).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, '_blank')}
            className="flex-1"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Full Page
          </Button>
          <Button onClick={onApply} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white">
            <Send className="h-4 w-4 mr-2" />
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  )
}
