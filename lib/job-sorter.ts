import { Job } from './database'
import { parseLocation } from './location-matcher'
import { STATES, CITIES, JOB_CATEGORIES } from '@/app/locations/seo-links'

export interface JobSortingResult {
  job: Job
  locationPages: string[]
  categoryPages: string[]
  shouldAppearOnHomepage: boolean
  primaryLocationPage?: string
  primaryCategoryPage?: string
}

export interface LocationPage {
  url: string
  state: string
  city?: string
  category?: string
}

// Normalize string for comparison
function normalizeString(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, '-')
}

// Get all possible location pages
function getAllLocationPages(): LocationPage[] {
  const pages: LocationPage[] = []
  
  // State-only pages
  STATES.forEach(state => {
    pages.push({
      url: `/locations/${state.abbr.toLowerCase()}`,
      state: state.abbr.toLowerCase()
    })
    
    // City pages
    const cities = CITIES[state.abbr as keyof typeof CITIES] || []
    cities.forEach(city => {
      pages.push({
        url: `/locations/${state.abbr.toLowerCase()}/${normalizeString(city)}`,
        state: state.abbr.toLowerCase(),
        city: normalizeString(city)
      })
      
      // Category-specific city pages
      JOB_CATEGORIES.forEach(category => {
        pages.push({
          url: `/locations/${state.abbr.toLowerCase()}/${normalizeString(city)}/${category.value}`,
          state: state.abbr.toLowerCase(),
          city: normalizeString(city),
          category: category.value
        })
      })
    })
    
    // State-level category pages
    JOB_CATEGORIES.forEach(category => {
      pages.push({
        url: `/locations/${state.abbr.toLowerCase()}/${category.value}`,
        state: state.abbr.toLowerCase(),
        category: category.value
      })
    })
  })
  
  return pages
}

// Get all category pages
function getAllCategoryPages(): string[] {
  return JOB_CATEGORIES.map(category => `/jobs/occupation/${category.value}`)
}

// Check if job matches a location page
function jobMatchesLocationPage(job: Job, page: LocationPage): boolean {
  // Parse job location
  const locationMatch = parseLocation(job.practice_location)
  
  // Check state match
  if (page.state && locationMatch.normalizedState !== page.state) {
    return false
  }
  
  // Check city match
  if (page.city && locationMatch.normalizedCity !== page.city) {
    return false
  }
  
  // Check category match
  if (page.category) {
    const jobCategories = job.job_categories || []
    const normalizedJobCategories = jobCategories.map(cat => normalizeString(cat))
    if (!normalizedJobCategories.includes(page.category)) {
      return false
    }
  }
  
  return true
}

// Sort a single job
export function sortJob(job: Job): JobSortingResult {
  const locationPages = getAllLocationPages()
  const categoryPages = getAllCategoryPages()
  
  const matchingLocationPages: string[] = []
  const matchingCategoryPages: string[] = []
  
  // Check location page matches
  locationPages.forEach(page => {
    if (jobMatchesLocationPage(job, page)) {
      matchingLocationPages.push(page.url)
    }
  })
  
  // Check category page matches
  const jobCategories = job.job_categories || []
  jobCategories.forEach(category => {
    const normalizedCategory = normalizeString(category)
    const categoryPage = `/jobs/occupation/${normalizedCategory}`
    if (categoryPages.includes(categoryPage)) {
      matchingCategoryPages.push(categoryPage)
    }
  })
  
  // Determine if job should appear on homepage
  // Job appears on homepage if it doesn't match any specific location/category pages
  // OR if it's a featured job
  const shouldAppearOnHomepage = job.is_featured || 
    (matchingLocationPages.length === 0 && matchingCategoryPages.length === 0)
  
  // Get primary pages (most specific matches)
  const primaryLocationPage = matchingLocationPages.length > 0 
    ? matchingLocationPages[matchingLocationPages.length - 1] // Most specific (longest URL)
    : undefined
    
  const primaryCategoryPage = matchingCategoryPages.length > 0 
    ? matchingCategoryPages[0] 
    : undefined
  
  return {
    job,
    locationPages: matchingLocationPages,
    categoryPages: matchingCategoryPages,
    shouldAppearOnHomepage,
    primaryLocationPage,
    primaryCategoryPage
  }
}

// Sort multiple jobs
export function sortJobs(jobs: Job[]): JobSortingResult[] {
  return jobs.map(sortJob)
}

// Get jobs for a specific location page
export function getJobsForLocationPage(
  jobs: Job[], 
  state: string, 
  city?: string, 
  category?: string
): Job[] {
  const locationPage: LocationPage = {
    url: '',
    state: normalizeString(state),
    city: city ? normalizeString(city) : undefined,
    category: category ? normalizeString(category) : undefined
  }
  
  return jobs.filter(job => jobMatchesLocationPage(job, locationPage))
}

// Get jobs for a specific category page
export function getJobsForCategoryPage(jobs: Job[], category: string): Job[] {
  const normalizedCategory = normalizeString(category)
  
  return jobs.filter(job => {
    const jobCategories = job.job_categories || []
    return jobCategories.some(cat => normalizeString(cat) === normalizedCategory)
  })
}

// Get jobs for homepage
export function getJobsForHomepage(jobs: Job[]): Job[] {
  const sortedJobs = sortJobs(jobs)
  return sortedJobs
    .filter(result => result.shouldAppearOnHomepage)
    .map(result => result.job)
}

// Get job URL based on sorting
export function getJobUrl(job: Job): string {
  const sorting = sortJob(job)
  
  // If job has a primary location page, use that
  if (sorting.primaryLocationPage) {
    return `${sorting.primaryLocationPage}/jobs/${job.id}-${normalizeString(job.job_title)}`
  }
  
  // If job has a primary category page, use that
  if (sorting.primaryCategoryPage) {
    return `${sorting.primaryCategoryPage}/jobs/${job.id}-${normalizeString(job.job_title)}`
  }
  
  // Default to main jobs page
  return `/jobs/${job.id}-${normalizeString(job.job_title)}`
}

// Check if a job should appear on a specific page
export function shouldJobAppearOnPage(
  job: Job, 
  pageUrl: string
): boolean {
  const sorting = sortJob(job)
  
  // Check if job matches the page URL
  return sorting.locationPages.includes(pageUrl) || 
         sorting.categoryPages.includes(pageUrl) ||
         (pageUrl === '/' && sorting.shouldAppearOnHomepage)
}

// Get all pages where a job should appear
export function getJobPages(job: Job): string[] {
  const sorting = sortJob(job)
  const pages = [...sorting.locationPages, ...sorting.categoryPages]
  
  if (sorting.shouldAppearOnHomepage) {
    pages.push('/')
  }
  
  return pages
} 