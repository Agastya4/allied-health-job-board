import { JobCard } from "@/components/job-card"
import { SEO } from "@/components/seo"
import { getJobsForLocationPage } from "@/lib/job-sorter"
import { STATES, CITIES, JOB_CATEGORIES } from "../seo-links"
import { getJobs } from "@/lib/database"
import { JobCardWrapper } from "@/components/job-card-wrapper"

interface LocationPageProps {
  params: Promise<{
    params: string[]
  }>
}

export default async function LocationPage({ params }: LocationPageProps) {
  // Parse URL parameters
  const resolvedParams = await params
  const segments = resolvedParams.params
  const state = segments[0] || ""
  const city = segments[1] || ""
  const category = segments[2] || ""
  
  // Get all jobs from database
  const jobs = await getJobs({})
  
  // Filter jobs for this location/category
  let filteredJobs: any[] = []
  
  if (category) {
    // Category-specific location page
    filteredJobs = getJobsForLocationPage(jobs, state, city, category)
  } else if (city) {
    // City-specific page
    filteredJobs = getJobsForLocationPage(jobs, state, city)
  } else {
    // State-specific page
    filteredJobs = getJobsForLocationPage(jobs, state)
  }
  
  // Generate page title and description
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
  
  return (
    <>
      <SEO
        title={title}
        description={description}
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
        <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>
        
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
              <JobCardWrapper
                key={job.id}
                job={{
                  ...job,
                  is_new: false,
                  company_logo_url: job.company_logo_url || "",
                  salary_range: job.salary_range ?? null,
                  posted_ago: null,
                  is_bookmarked: false,
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