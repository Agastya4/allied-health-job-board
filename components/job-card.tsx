"use client"
import Image from "next/image"
import type React from "react"

import { MapPin, DollarSign, Briefcase, GraduationCap, Laptop, Building, Bookmark, BookmarkCheck, Calendar, Clock } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, getOccupationName } from "@/lib/utils"

interface Job {
  id: number
  job_title: string
  company_name: string
  company_logo_url: string
  is_new: boolean
  is_featured: boolean
  location_display: string
  job_type: string
  experience_level: string
  salary_range: string | null
  posted_ago: string | null
  is_bookmarked: boolean
  job_details?: string
  job_categories?: string[]
  work_setting?: string
  created_at?: string
}

interface JobCardProps {
  job: Job
  onClick: () => void
  isSelected: boolean
  onBookmarkToggle: (jobId: number) => void
  shiftDown?: boolean
}

// List of Australian state abbreviations
const STATE_ABBREVIATIONS = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];

// Function to get occupation name from job categories
function extractCityState(location: string): string {
  const STATE_ABBREVIATIONS = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
  const parts = location.split(',').map(s => s.trim());
  // Scan from the end to find the state
  for (let i = parts.length - 1; i >= 0; i--) {
    // Match 'NSW' or 'NSW 2000'
    const match = parts[i].match(/^([A-Z]{2,3})\b/);
    if (match && STATE_ABBREVIATIONS.includes(match[1])) {
      // Find the first word before the state that is not a postcode or empty
      for (let j = i - 1; j >= 0; j--) {
        const cityCandidate = parts[j];
        // Skip if it's a number (postcode) or empty
        if (cityCandidate && !/\d{3,}/.test(cityCandidate)) {
          return `${cityCandidate}, ${match[1]}`;
        }
      }
      // If not found, just return state
      return match[1];
    }
    // Exact match for state
    if (STATE_ABBREVIATIONS.includes(parts[i].toUpperCase())) {
      for (let j = i - 1; j >= 0; j--) {
        const cityCandidate = parts[j];
        if (cityCandidate && !/\d{3,}/.test(cityCandidate)) {
          return `${cityCandidate}, ${parts[i]}`;
        }
      }
      return parts[i];
    }
  }
  // Fallback: just return the last two parts that are not a postcode or country
  const filtered = parts.filter(p => !/\d{3,}/.test(p) && !/australia/i.test(p));
  if (filtered.length >= 2) return filtered.slice(-2).join(', ');
  return location;
}

// Function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
}

export function JobCard({ job, onClick, isSelected, onBookmarkToggle, shiftDown }: JobCardProps) {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onBookmarkToggle(job.id)
  }

  // Extract city and state from location_display for preview
  let cityState = job.location_display
  if (cityState) {
    cityState = extractCityState(cityState)
  }

  // Ensure logoSrc is always a valid, non-empty string
  const logoSrc = job.company_logo_url && job.company_logo_url.trim() !== "" ? job.company_logo_url : "/placeholder.svg"

  // Format posted date
  const postedDate = job.created_at ? formatTimeAgo(job.created_at) : job.posted_ago || "Recently"

  return (
    <Card
      className={cn(
        "p-6 flex flex-col md:flex-row md:items-start gap-6 cursor-pointer transition-all duration-200",
        "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:shadow-md",
        isSelected ? "border-violet-600 ring-2 ring-violet-600" : "",
        shiftDown ? "mt-8" : "",
        job.is_featured ? "border-violet-300 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-900/10" : ""
      )}
      onClick={onClick}
    >
      {/* Company Logo */}
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 dark:border-zinc-700">
          <Image
            src={logoSrc}
            alt={`${job.company_name} logo`}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Job Content */}
      <div className="flex-1 min-w-0">
        {/* Header with title, company, and badges */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {job.job_title}
            </h3>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
              <Building className="h-4 w-4" />
              <span className="font-medium">{job.company_name}</span>
            </div>
          </div>
          
          {/* Bookmark and badges */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmarkClick}
              className="p-1 h-auto"
            >
              {job.is_bookmarked ? (
                <BookmarkCheck className="h-5 w-5 text-violet-600" />
              ) : (
                <Bookmark className="h-5 w-5 text-gray-400 hover:text-violet-600" />
              )}
            </Button>
            
            {job.is_featured && (
              <Badge className="bg-violet-600 text-white px-2 py-1 text-xs">
                Featured
              </Badge>
            )}
            
            {job.is_new && (
              <Badge className="bg-green-600 text-white px-2 py-1 text-xs">
                New
              </Badge>
            )}
          </div>
        </div>

        {/* Job Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{cityState}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{job.job_type}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{job.experience_level}</span>
          </div>
          
          {job.salary_range && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{job.salary_range}</span>
            </div>
          )}
          
          {job.work_setting && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{job.work_setting}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{postedDate}</span>
          </div>
        </div>

        {/* Job Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            variant="outline"
            className="bg-violet-50 dark:bg-violet-900/20 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300"
          >
            {getOccupationName(job.job_categories)}
          </Badge>
        </div>

        {/* Job Preview */}
        {job.job_details && (
          <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {job.job_details.length > 150 
              ? `${job.job_details.substring(0, 150)}...` 
              : job.job_details
            }
          </div>
        )}
      </div>
    </Card>
  )
}
