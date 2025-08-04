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

// Function to extract city and state abbreviation from location
function extractCityState(location: string): string {
  if (!location) return "";
  
  const STATE_ABBREVIATIONS = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
  const STATE_NAMES = {
    "new south wales": "NSW",
    "victoria": "VIC", 
    "queensland": "QLD",
    "south australia": "SA",
    "western australia": "WA",
    "tasmania": "TAS",
    "australian capital territory": "ACT",
    "northern territory": "NT"
  };
  
  const parts = location.split(',').map(s => s.trim());
  
  // Find state abbreviation or name
  let state = "";
  let city = "";
  
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    
    // Check for state abbreviation (NSW, VIC, etc.)
    const stateMatch = part.match(/^([A-Z]{2,3})\b/);
    if (stateMatch && STATE_ABBREVIATIONS.includes(stateMatch[1])) {
      state = stateMatch[1];
      // Look for city before state
      for (let j = i - 1; j >= 0; j--) {
        const cityCandidate = parts[j];
        if (cityCandidate && !/\d{3,}/.test(cityCandidate) && !/australia/i.test(cityCandidate) && !/council/i.test(cityCandidate)) {
          city = cityCandidate;
          break;
        }
      }
      break;
    }
    
    // Check for full state name
    const stateNameLower = part.toLowerCase();
    if (STATE_NAMES[stateNameLower as keyof typeof STATE_NAMES]) {
      state = STATE_NAMES[stateNameLower as keyof typeof STATE_NAMES];
      // Look for city before state
      for (let j = i - 1; j >= 0; j--) {
        const cityCandidate = parts[j];
        if (cityCandidate && !/\d{3,}/.test(cityCandidate) && !/australia/i.test(cityCandidate) && !/council/i.test(cityCandidate)) {
          city = cityCandidate;
          break;
        }
      }
      break;
    }
  }
  
  // Special handling for complex addresses like "Moore Street, Liverpool, Sydney, Liverpool City Council, New South Wales, 2170, Australia"
  if (!city && !state) {
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      // Look for state name or abbreviation
      if (part.toLowerCase().includes('new south wales') || part === 'NSW') {
        state = 'NSW';
        // Look for city before this part
        for (let j = i - 1; j >= 0; j--) {
          const cityCandidate = parts[j];
          if (cityCandidate && !/\d{3,}/.test(cityCandidate) && !/australia/i.test(cityCandidate) && !/council/i.test(cityCandidate)) {
            city = cityCandidate;
            break;
          }
        }
        break;
      }
    }
  }
  
  if (city && state) {
    return `${city}, ${state}`;
  } else if (state) {
    return state;
  } else if (city) {
    return city;
  }
  
  return location;
}

export function JobCard({ job, onClick, isSelected, onBookmarkToggle, shiftDown }: JobCardProps) {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onBookmarkToggle(job.id)
  }

  // Ensure logoSrc is always a valid, non-empty string
  const logoSrc = job.company_logo_url && job.company_logo_url.trim() !== "" ? job.company_logo_url : "/placeholder.svg"

  // Format posted date
  const postedDate = job.created_at ? formatTimeAgo(job.created_at) : job.posted_ago || "Recently"

  // Extract city and state from location
  const locationDisplay = extractCityState(job.location_display)

  return (
    <Card
      className={cn(
        "p-3 flex items-start gap-3 cursor-pointer transition-all duration-200 min-h-[90px]",
        "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:shadow-md",
        isSelected ? "border-green-600 ring-2 ring-green-600" : "",
        shiftDown ? "mt-8" : "",
        job.is_featured ? "border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10" : ""
      )}
      onClick={onClick}
    >
      {/* Company Logo */}
      <div className="flex-shrink-0">
        <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 dark:border-zinc-700">
          <Image
            src={logoSrc}
            alt={`${job.company_name} logo`}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Job Content */}
      <div className="flex-1 min-w-0 flex flex-col h-full">
        {/* Header with title, company, and date */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
              {job.job_title}
            </h3>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Building className="h-3 w-3 flex-shrink-0" />
              <span className="font-medium text-xs truncate">{job.company_name}</span>
            </div>
          </div>
          
          {/* Posted date */}
          <div className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
            {postedDate}
          </div>
        </div>

        {/* Tags/Badges - moved lower and more compact */}
        <div className="flex flex-wrap gap-1 mt-auto">
          <Badge className="bg-green-600 text-white text-xs px-2 py-0.5">
            {getOccupationName(job.job_categories)}
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-0.5">
            <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
            <span className="truncate">{locationDisplay}</span>
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-0.5">
            <Briefcase className="h-2.5 w-2.5 flex-shrink-0" />
            <span className="truncate">{job.job_type}</span>
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-0.5">
            <GraduationCap className="h-2.5 w-2.5 flex-shrink-0" />
            <span className="truncate">{job.experience_level}</span>
          </Badge>
        </div>
      </div>
    </Card>
  )
}
