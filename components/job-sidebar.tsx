"use client"

import Link from "next/link"
import { ClipboardList, LayoutDashboard, LogIn, Sun, Moon, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/hooks/use-auth"
import type { JobFilters } from "@/hooks/use-jobs"
import Logo from "./logo";
import { STATES, CITIES } from "@/app/locations/seo-links";
import { LocationAutocomplete } from "@/components/location-autocomplete";

interface JobSidebarProps {
  user: any
  onFiltersChange: (filters: JobFilters) => void
  onPostJob: () => void
  initialFilters?: JobFilters
}

export function JobSidebar({ user, onFiltersChange, onPostJob, initialFilters }: JobSidebarProps) {
  const { signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [filters, setFilters] = useState<JobFilters>(initialFilters || {})
  const router = useRouter();
  const pathname = usePathname();

  // Update filters when initialFilters change (e.g., from URL parameters)
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  // Check if we're on a location page with specific city/state
  const isLocationPage = pathname.startsWith('/locations/');
  const hasSpecificLocation = isLocationPage && !!(initialFilters?.city || initialFilters?.state);
  
  // Use uppercase state abbr for dropdown and city lookup
  const selectedStateAbbr =
    STATES.find(s => s.abbr === (filters.state || initialFilters?.state || ''))?.abbr || "";
  const validStateAbbrs = Object.keys(CITIES) as (keyof typeof CITIES)[];
  const cityOptions = validStateAbbrs.includes(selectedStateAbbr as keyof typeof CITIES)
    ? CITIES[selectedStateAbbr as keyof typeof CITIES]
    : [];

  // Define allowed options for each select
  const occupationOptions = [
    "any",
    "physiotherapy",
    "occupational-therapy",
    "speech-pathology",
    "psychology",
    "dietetics-nutrition",
    "social-work",
    "podiatry",
    "audiology",
    "exercise-physiology",
    "optometry",
    "pharmacy",
    "radiography"
  ];
  const locationRequirementOptions = [
    "any",
    "remote",
    "in-office",
    "hybrid",
    "community"
  ];
  const jobTypeOptions = [
    "any",
    "full-time",
    "part-time",
    "contract",
    "temporary"
  ];
  const experienceLevelOptions = [
    "any",
    "junior",
    "mid",
    "senior",
    "lead"
  ];

  // Defensive: ensure state value is valid
  const stateValue = STATES.some(s => s.abbr === (filters.state || "")) ? filters.state : "any";
  // Defensive: ensure city value is valid and always normalized
  const normalizedCityOptions = cityOptions
    .map((city) => city && city.trim())
    .filter((city) => !!city)
    .map((city) => city!.toLowerCase().replace(/\s+/g, "-"));
  const cityValue = typeof filters.city === 'string' ? filters.city : "any";
  // Defensive: ensure occupation, locationRequirement, jobType, experienceLevel are valid
  const occupationValue = occupationOptions.includes(filters.occupation ?? "") ? filters.occupation : "any";
  const locationRequirementValue = locationRequirementOptions.includes(filters.locationRequirement ?? "") ? filters.locationRequirement : "any";
  const jobTypeValue = jobTypeOptions.includes(filters.jobType ?? "") ? filters.jobType : "any";
  const experienceLevelValue = experienceLevelOptions.includes(filters.experienceLevel ?? "") ? filters.experienceLevel : "any";

  const handleFilterChange = (key: keyof JobFilters, value: string) => {
    let newFilters = { ...filters }
    
    // Handle different filter types
    if (key === 'jobTitle') {
      // For job title, allow empty string to show all jobs
      newFilters.jobTitle = value;
    } else if (key === 'city' && value) {
      // Allow partial, case-insensitive match
      newFilters.city = value.trim().toLowerCase();
    } else if (key === 'city' && (value === 'any' || value === '')) {
      // Remove city filter when empty or "any"
      delete newFilters.city;
    } else if (key === 'state' && value === 'any') {
      // Remove state filter when "any"
      delete newFilters.state;
    } else if (key === 'state' && value) {
      // Always store state as uppercase abbr
      newFilters.state = value.toUpperCase();
    } else if (value === 'any') {
      // Remove filter when set to "any"
      delete newFilters[key];
    } else {
      // Set the filter value
      newFilters[key] = value;
    }
    
    setFilters(newFilters)
    
    // Immediately apply filters (real-time filtering)
    onFiltersChange(newFilters)

    // Only navigate if we're not on a location page (to avoid conflicts)
    const isLocationPage = pathname.startsWith('/locations/');
    if (!isLocationPage && (key === 'state' || key === 'city' || key === 'occupation')) {
      const state = key === 'state' ? value : newFilters.state || initialFilters?.state || '';
      const city = key === 'city' ? newFilters.city : newFilters.city || initialFilters?.city || '';
      const occupation = key === 'occupation' ? value : newFilters.occupation || initialFilters?.occupation || '';
      // Only navigate if state and occupation are set
      if (state && occupation && city) {
        router.push(`/locations/${state.toLowerCase()}/${city.toLowerCase().replace(/\s+/g, '-')}/${occupation}`);
      } else if (state && occupation) {
        router.push(`/locations/${state.toLowerCase()}/${occupation}`);
      }
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }

  return (
    <div className="w-full md:w-60 bg-gray-50 dark:bg-zinc-900 flex flex-col border-r border-gray-200 dark:border-zinc-800 h-full md:h-screen">
      <div className="p-3 border-b border-gray-200 dark:border-zinc-800">
        {/* Logo removed as per request */}
      </div>
      <div className="flex-1 flex flex-col p-3 md:p-3">
        <div className="space-y-4 md:space-y-3 flex-1">
          <div>
            <label htmlFor="job-title" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
              Job Title
            </label>
            <Input
              id="job-title"
              placeholder="Search job titles..."
              value={filters.jobTitle || ""}
              onChange={(e) => handleFilterChange("jobTitle", e.target.value)}
              className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 h-12 md:h-10 text-base md:text-sm"
            />
          </div>
          <div>
            <label htmlFor="occupation" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
              Occupation
            </label>
            <Select
              value={occupationValue}
              onValueChange={(value) => handleFilterChange("occupation", value)}
              disabled={hasSpecificLocation}
            >
              <SelectTrigger
                id="occupation"
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white h-12 md:h-10 text-base md:text-sm"
              >
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white">
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="physiotherapy">Physiotherapy</SelectItem>
                <SelectItem value="occupational-therapy">Occupational Therapy</SelectItem>
                <SelectItem value="speech-pathology">Speech Pathology</SelectItem>
                <SelectItem value="psychology">Psychology</SelectItem>
                <SelectItem value="dietetics-nutrition">Dietetics & Nutrition</SelectItem>
                <SelectItem value="social-work">Social Work</SelectItem>
                <SelectItem value="podiatry">Podiatry</SelectItem>
                <SelectItem value="audiology">Audiology</SelectItem>
                <SelectItem value="exercise-physiology">Exercise Physiology</SelectItem>
                <SelectItem value="optometry">Optometry</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="radiography">Radiography</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="state" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
              State
            </label>
            <Select
              value={stateValue}
              onValueChange={(value) => handleFilterChange("state", value)}
              disabled={hasSpecificLocation}
            >
              <SelectTrigger
                id="state"
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white h-12 md:h-10 text-base md:text-sm"
              >
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white">
                <SelectItem value="any">Any</SelectItem>
                {STATES.map((state) => (
                  <SelectItem key={state.abbr} value={state.abbr}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="city" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
              City
            </label>
            <LocationAutocomplete
              placeholder="Any"
              value={filters.city || ""}
              onChange={(value) => handleFilterChange("city", value)}
              className="h-12 md:h-10 text-base md:text-sm"
            />
          </div>
          <div>
            <label htmlFor="job-type" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
              Job Type
            </label>
            <Select
              value={jobTypeValue}
              onValueChange={(value) => handleFilterChange("jobType", value)}
            >
              <SelectTrigger
                id="job-type"
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white h-12 md:h-10 text-base md:text-sm"
              >
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white">
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="experience-level" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
              Experience Level
            </label>
            <Select
              value={experienceLevelValue}
              onValueChange={(value) => handleFilterChange("experienceLevel", value)}
            >
              <SelectTrigger
                id="experience-level"
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white h-12 md:h-10 text-base md:text-sm"
              >
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white">
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="location-requirement" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
              Work Setting
            </label>
            <Select
              value={locationRequirementValue}
              onValueChange={(value) => handleFilterChange("locationRequirement", value)}
            >
              <SelectTrigger
                id="location-requirement"
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white h-12 md:h-10 text-base md:text-sm"
              >
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white">
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="in-office">In Office</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="community">Community</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Clear Filters Button - Mobile Friendly */}
        <div className="pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setFilters({})
              onFiltersChange({})
            }}
            className="w-full h-12 md:h-10 text-base md:text-sm"
          >
            Clear All Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
