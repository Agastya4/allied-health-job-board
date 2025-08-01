"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { JobCard } from "@/components/job-card"
import { SEO } from "@/components/seo"
import { useJobs } from "@/hooks/use-jobs"
import { getJobsForLocationPage, getJobsForCategoryPage } from "@/lib/job-sorter"
import { STATES, CITIES, JOB_CATEGORIES } from "../seo-links"

interface LocationPageProps {
  params: {
    params: string[]
  }
}

export default function LocationPage({ params }: LocationPageProps) {
  const { params: pathParams } = useParams()
  const [pageTitle, setPageTitle] = useState("")
  const [pageDescription, setPageDescription] = useState("")
  
  // Parse URL parameters
  const segments = Array.isArray(pathParams) ? pathParams : [pathParams]
  const state = segments[0] || ""
  const city = segments[1] || ""
  const category = segments[2] || ""
  
  // Get all jobs
  const { jobs, loading } = useJobs()
  
  // Filter jobs for this location/category
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  
  useEffect(() => {
    if (jobs.length > 0) {
      let filtered: any[] = []
      
      if (category) {
        // Category-specific location page
        filtered = getJobsForLocationPage(jobs, state, city, category)
      } else if (city) {
        // City-specific page
        filtered = getJobsForLocationPage(jobs, state, city)
      } else {
        // State-specific page
        filtered = getJobsForLocationPage(jobs, state)
      }
      
      setFilteredJobs(filtered)
    }
  }, [jobs, state, city, category])
  
  // Generate page title and description
  useEffect(() => {
    const stateInfo = STATES.find(s => s.abbr.toLowerCase() === state)
    const cityInfo = city ? CITIES[stateInfo?.abbr as keyof typeof CITIES]?.find(c => 
      c.toLowerCase().replace(/\s+/g, '-') === city
    ) : null
    const categoryInfo = category ? JOB_CATEGORIES.find(c => c.value === category) : null
    
    let title = ""
    let description = ""
    
    if (category && city) {
      title = `${categoryInfo?.label} Jobs in ${cityInfo}, ${stateInfo?.abbr}`
      description = `Find ${categoryInfo?.label.toLowerCase()} jobs in ${cityInfo}, ${stateInfo?.name}. Browse the latest opportunities and apply today.`
    } else if (category) {
      title = `${categoryInfo?.label} Jobs in ${stateInfo?.name}`
      description = `Find ${categoryInfo?.label.toLowerCase()} jobs in ${stateInfo?.name}. Browse the latest opportunities and apply today.`
    } else if (city) {
      title = `Allied Health Jobs in ${cityInfo}, ${stateInfo?.abbr}`
      description = `Find allied health jobs in ${cityInfo}, ${stateInfo?.name}. Browse physiotherapy, occupational therapy, speech pathology, and other healthcare positions.`
    } else {
      title = `Allied Health Jobs in ${stateInfo?.name}`
      description = `Find allied health jobs in ${stateInfo?.name}. Browse physiotherapy, occupational therapy, speech pathology, and other healthcare positions.`
    }
    
    setPageTitle(title)
    setPageDescription(description)
  }, [state, city, category])
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading jobs...</p>
        </div>
      </div>
    )
  }
  
  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={[
          'allied health jobs',
          'healthcare jobs',
          'physiotherapy jobs',
          'occupational therapy jobs',
          'speech pathology jobs',
          'healthcare careers',
          state,
          city || '',
          category || ''
        ].filter(Boolean)}
        url={`/locations/${state}${city ? `/${city}` : ''}${category ? `/${category}` : ''}`}
        type="website"
      />
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">{pageTitle}</h1>
        
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No jobs found for this location and category.
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              Try browsing other locations or check back later for new opportunities.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={{
                  ...job,
                  is_new: false,
                  company_logo_url: job.company_logo_url || "",
                  salary_range: job.salary_range ?? null,
                  posted_ago: job.posted_ago ?? null,
                  is_bookmarked: job.is_bookmarked ?? false,
                }}
              />
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} in this location
          </p>
        </div>
      </div>
    </>
  )
} 