"use client"
import Image from "next/image"
import type React from "react"

import { MapPin, DollarSign, Briefcase, GraduationCap, Laptop, Building, Bookmark, BookmarkCheck } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  job_details?: string // Added job_details to the interface
}

interface JobCardProps {
  job: Job
  onClick: () => void
  isSelected: boolean
  onBookmarkToggle: (jobId: number) => void
  shiftDown?: boolean // Add this prop
}

// List of Australian state abbreviations
const STATE_ABBREVIATIONS = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];

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

export function JobCard({ job, onClick, isSelected, onBookmarkToggle, shiftDown }: JobCardProps) {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onBookmarkToggle(job.id)
  }

  // Extract requirements if present (split by 'Requirements:' or similar)
  let requirements = ''
  if (job.job_details) {
    const reqMatch = job.job_details.match(/Requirements:(.*)$/i)
    if (reqMatch) {
      requirements = reqMatch[1].trim()
    }
  }

  // Extract city and state from location_display for preview
  let cityState = job.location_display
  if (cityState) {
    cityState = extractCityState(cityState)
  }

  // Ensure logoSrc is always a valid, non-empty string
  const logoSrc = job.company_logo_url && job.company_logo_url.trim() !== "" ? job.company_logo_url : "/placeholder.svg"

  return (
    <Card
      className={cn(
        "p-4 md:p-4 flex flex-col md:flex-row md:items-start gap-4 cursor-pointer transition-colors relative",
        "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800",
        isSelected ? "border-violet-600 ring-2 ring-violet-600" : "",
        shiftDown ? "mt-8" : "" // Add margin top if shiftDown is true
      )}
      onClick={onClick}
    >
      {/* Mobile: Logo and company info at top */}
      <div className="flex items-center gap-3 md:hidden">
        <Image
          src={logoSrc}
          alt={`${job.company_name} logo`}
          width={48}
          height={48}
          className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-zinc-700"
        />
        <div className="flex-1">
          <p className="text-gray-700 dark:text-white text-sm font-medium">{job.company_name}</p>
          <div className="flex items-center gap-2 mt-1">
            {job.posted_ago === "new" && (
              <Badge className="bg-violet-600 text-white px-2 py-1 rounded-md text-xs font-medium">New</Badge>
            )}
            {job.posted_ago && job.posted_ago !== "new" && (
              <span className="text-sm text-gray-500 dark:text-gray-400">{job.posted_ago}</span>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: Logo on left */}
      <Image
        src={logoSrc}
        alt={`${job.company_name} logo`}
        width={56}
        height={56}
        className="hidden md:block w-14 h-14 object-cover rounded-lg border border-gray-200 dark:border-zinc-700"
      />

      <div className="flex-1">
        {/* Mobile: Job title and badges */}
        <div className="md:hidden">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{job.job_title}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge
              variant="outline"
              className="bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white flex items-center gap-1 text-xs"
            >
              <MapPin className="h-3 w-3" />
              {cityState}
            </Badge>
            <Badge
              variant="outline"
              className="bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white flex items-center gap-1 text-xs"
            >
              <Briefcase className="h-3 w-3" />
              {job.job_type}
            </Badge>
            <Badge
              variant="outline"
              className="bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white flex items-center gap-1 text-xs"
            >
              <GraduationCap className="h-3 w-3" />
              {job.experience_level}
            </Badge>
          </div>
          {job.salary_range && (
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <DollarSign className="h-4 w-4" />
              {job.salary_range}
            </div>
          )}
        </div>

        {/* Desktop: Original layout */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.job_title}</h3>
            <div className="flex items-center gap-2">
              {job.posted_ago === "new" && (
                <Badge className="bg-violet-600 text-white px-2 py-1 rounded-md text-xs font-medium">New</Badge>
              )}
              {job.posted_ago && job.posted_ago !== "new" && (
                <span className="text-sm text-gray-500 dark:text-gray-400">{job.posted_ago}</span>
              )}
            </div>
          </div>
          <p className="text-gray-700 dark:text-white text-sm mb-2">{job.company_name}</p>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white flex items-center gap-1"
            >
              <MapPin className="h-3 w-3" />
              {cityState}
            </Badge>
            <Badge
              variant="outline"
              className="bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white flex items-center gap-1"
            >
              <Briefcase className="h-3 w-3" />
              {job.job_type}
            </Badge>
            <Badge
              variant="outline"
              className="bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white flex items-center gap-1"
            >
              <GraduationCap className="h-3 w-3" />
              {job.experience_level}
            </Badge>
          </div>
        </div>
        {/* Remove job details from minimized preview */}
      </div>
    </Card>
  )
}
