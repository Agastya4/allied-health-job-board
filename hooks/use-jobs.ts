"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"

export interface Job {
  id: number
  user_id: number
  practice_email: string
  job_title: string
  practice_location: string
  location_display: string
  location_lat?: number
  location_lng?: number
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
  created_at: string
  updated_at: string
  is_bookmarked?: boolean
  posted_ago?: string
}

export interface JobFilters {
  jobTitle?: string
  occupation?: string
  locationRequirement?: string
  city?: string
  state?: string
  jobType?: string
  experienceLevel?: string
  search?: string
}

export function useJobs(filters: JobFilters = {}) {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'any') {
          params.append(key, value)
        }
      })

      const response = await fetch(`/api/jobs?${params.toString()}`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (err) {
      console.error("Fetch jobs error:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch jobs")
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [JSON.stringify(filters), user?.id])

  const toggleBookmark = async (jobId: number) => {
    if (!user) {
      throw new Error("Authentication required")
    }

    try {
      const response = await fetch("/api/jobs/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ jobId }),
      })

      if (!response.ok) {
        throw new Error("Failed to toggle bookmark")
      }

      const data = await response.json()
      
      // Update local state
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.id === jobId ? { ...job, is_bookmarked: data.isBookmarked } : job
        )
      )

      return data.isBookmarked
    } catch (error) {
      console.error("Toggle bookmark error:", error)
      throw error
    }
  }

  const createJob = async (jobData: any) => {
    if (!user) {
      throw new Error("Authentication required")
    }

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(jobData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create job")
      }

      const data = await response.json()
      
      // Refresh jobs list
      await fetchJobs()
      
      return data.job
    } catch (error) {
      console.error("Create job error:", error)
      throw error
    }
  }

  const applyToJob = async (jobId: number) => {
    if (!user) {
      throw new Error("Authentication required")
    }

    try {
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ jobId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to apply to job")
      }

      return true
    } catch (error) {
      console.error("Apply to job error:", error)
      throw error
    }
  }

  return {
    jobs,
    loading,
    error,
    refetch: fetchJobs,
    toggleBookmark,
    createJob,
    applyToJob,
  }
}
