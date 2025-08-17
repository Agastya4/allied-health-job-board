"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, MapPin, DollarSign, Briefcase, GraduationCap, Building, Calendar, Clock, ExternalLink, Send, Globe, Bookmark, BookmarkCheck, Star, CheckCircle, Share2, MoreVertical } from "lucide-react"
import Image from "next/image"
import { cn, getOccupationName } from "@/lib/utils"
import { ApplyJobModal } from "@/components/apply-job-modal"

interface Job {
  id: number
  user_id: number
  practice_email: string
  job_title: string
  practice_location: string
  location_display: string
  location_lat?: number
  location_lng?: number
  city?: string
  state?: string
  job_type: string
  job_categories: string[]
  experience_level: string
  work_setting?: string
  salary_range?: string
  job_details: string
  company_name: string
  contact_phone: string
  contact_email: string
  company_website?: string
  company_logo_url?: string
  status: string
  is_featured: boolean
  payment_status?: string
  stripe_payment_intent_id?: string
  payment_amount?: number
  created_at: string
  updated_at: string
  is_bookmarked?: boolean
  posted_ago?: string
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
  const [showContactModal, setShowContactModal] = useState(false)

  // Ensure logoSrc is always a valid, non-empty string
  const logoSrc = job.company_logo_url && job.company_logo_url.trim() !== "" ? job.company_logo_url : "/placeholder.svg"

  // Format posted date
  const postedDate = job.created_at ? formatTimeAgo(job.created_at) : job.posted_ago || "Recently"

  const handleQuickApply = () => {
    setShowContactModal(true)
  }

  const handleViewDetails = () => {
    // Navigate to the full job page
    const jobSlug = `${job.id}-${job.job_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`
    window.open(`/jobs/${jobSlug}`, '_blank')
  }

  const handleWebsiteClick = () => {
    if (job.company_website) {
      window.open(job.company_website, '_blank')
    }
  }

  return (
    <>
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

        {/* Desktop Content */}
        <div className="hidden md:flex flex-col h-full overflow-y-auto">
          {/* Header Section with Logo and Actions */}
          <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
            <div className="flex items-start justify-between mb-6">
              {/* Company Logo and Info */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 dark:border-zinc-700">
                    <Image
                      src={logoSrc}
                      alt={`${job.company_name} logo`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{job.company_name}</h2>
                </div>
              </div>

              {/* Website Icon */}
              {job.company_website && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleWebsiteClick}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Globe className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Job Title */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
                {job.job_title}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{job.company_name}</span>
              </div>
            </div>

            {/* Job Details with Icons */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{job.location_display}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Building className="h-4 w-4 flex-shrink-0" />
                <span>{getOccupationName(job.job_categories)} ({job.job_categories[0]})</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>{job.job_type}</span>
              </div>
              
              {job.salary_range && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <DollarSign className="h-4 w-4 flex-shrink-0" />
                  <span>{job.salary_range}</span>
                </div>
              )}
            </div>

            {/* Posted Date */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Posted {postedDate}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleQuickApply}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                Quick apply
              </Button>
              <Button
                onClick={handleViewDetails}
                variant="outline"
                className="flex-1 h-12 text-base font-semibold border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10 rounded-lg transition-all duration-200"
              >
                View details
              </Button>
            </div>
          </div>

          {/* Job Description */}
          <div className="flex-1 p-6">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed break-words text-base">
                {job.job_details}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Details Modal */}
      {showContactModal && (
        <ApplyJobModal 
          job={job} 
          onClose={() => setShowContactModal(false)} 
        />
      )}
    </>
  )
}
