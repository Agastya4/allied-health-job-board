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

// Check if a job's address contains any known city names
function findKnownCitiesInAddress(job: Job): string[] {
  const address = job.practice_location.toLowerCase()
  const foundCities: string[] = []
  
  // Check only the cities from our database (the ones that have pages)
  Object.entries(CITIES).forEach(([stateAbbr, cities]) => {
    cities.forEach(city => {
      const cityLower = city.toLowerCase()
      // Check if city name appears in the address
      if (address.includes(cityLower)) {
        foundCities.push(city)
      }
    })
  })
  
  return foundCities
}

// Check if a job's address contains any known state names
function findKnownStatesInAddress(job: Job): string[] {
  const address = job.practice_location.toLowerCase()
  const foundStates: string[] = []
  
  // Check state names and abbreviations
  STATES.forEach(state => {
    const stateName = state.name.toLowerCase()
    const stateAbbr = state.abbr.toLowerCase()
    
    // Check if state name or abbreviation appears in the address
    if (address.includes(stateName) || address.includes(stateAbbr)) {
      foundStates.push(state.abbr)
    }
  })
  
  return foundStates
}

// Sort a single job
export function sortJob(job: Job): JobSortingResult {
  const locationPages = getAllLocationPages()
  const categoryPages = getAllCategoryPages()
  
  const matchingLocationPages: string[] = []
  const matchingCategoryPages: string[] = []
  
  // Find known cities in the job's address (only the ones with pages)
  const knownCities = findKnownCitiesInAddress(job)
  console.log(`Job ${job.id} address "${job.practice_location}" contains known cities:`, knownCities)
  
  // Find known states in the job's address
  const knownStates = findKnownStatesInAddress(job)
  console.log(`Job ${job.id} address "${job.practice_location}" contains known states:`, knownStates)
  
  // Check location page matches
  locationPages.forEach(page => {
    if (jobMatchesLocationPage(job, page)) {
      matchingLocationPages.push(page.url)
    }
  })
  
  // If no location pages matched but we found known cities, create matches for existing pages only
  if (matchingLocationPages.length === 0 && knownCities.length > 0) {
    // Find the state for the job
    const locationMatch = parseLocation(job.practice_location)
    const stateAbbr = locationMatch.stateAbbr || 'NSW' // Default to NSW if not found
    
    // Create location pages for each found city (only for cities that have pages)
    knownCities.forEach(city => {
      const normalizedCity = normalizeString(city)
      
      // Add city-only page (only if it exists in our page structure)
      const cityPage = `/locations/${stateAbbr.toLowerCase()}/${normalizedCity}`
      matchingLocationPages.push(cityPage)
      
      // Add category-specific city pages (only if they exist)
      const jobCategories = job.job_categories || []
      jobCategories.forEach(category => {
        const normalizedCategory = normalizeString(category)
        const categoryCityPage = `/locations/${stateAbbr.toLowerCase()}/${normalizedCity}/${normalizedCategory}`
        matchingLocationPages.push(categoryCityPage)
      })
    })
  }
  
  // If no location pages matched but we found known states, create state page matches
  if (matchingLocationPages.length === 0 && knownStates.length > 0) {
    knownStates.forEach(stateAbbr => {
      // Add state-only page
      const statePage = `/locations/${stateAbbr.toLowerCase()}`
      matchingLocationPages.push(statePage)
      
      // Add category-specific state pages
      const jobCategories = job.job_categories || []
      jobCategories.forEach(category => {
        const normalizedCategory = normalizeString(category)
        const categoryStatePage = `/locations/${stateAbbr.toLowerCase()}/${normalizedCategory}`
        matchingLocationPages.push(categoryStatePage)
      })
    })
  }
  
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
  // Job appears on homepage if:
  // 1. It's a featured job, OR
  // 2. No known cities or states found in address (meaning it doesn't match any specific location pages)
  const shouldAppearOnHomepage = job.is_featured || (knownCities.length === 0 && knownStates.length === 0)
  
  // Get primary pages (most specific matches)
  const primaryLocationPage = matchingLocationPages.length > 0 
    ? matchingLocationPages[matchingLocationPages.length - 1] // Most specific (longest URL)
    : undefined
    
  const primaryCategoryPage = matchingCategoryPages.length > 0 
    ? matchingCategoryPages[0] 
    : undefined
  
  console.log(`Job ${job.id} sorting result:`, {
    knownCities,
    knownStates,
    locationPages: matchingLocationPages,
    categoryPages: matchingCategoryPages,
    shouldAppearOnHomepage
  })
  
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
  

  
  return jobs.filter(job => {
    // If we're looking for a specific state (no city), check if the job's address contains that state
    if (!city) {
      const knownStates = findKnownStatesInAddress(job)
      const targetState = state.replace(/-/g, ' ') // Convert URL format back to readable
      const matchesState = knownStates.some(knownState => 
        normalizeString(knownState) === normalizeString(targetState)
      )
      
      // If category is specified, also check category match
      if (category) {
        const jobCategories = job.job_categories || []
        const normalizedJobCategories = jobCategories.map(cat => normalizeString(cat))
        const normalizedCategory = normalizeString(category)
        const categoryMatch = normalizedJobCategories.includes(normalizedCategory)
        return matchesState && categoryMatch
      }
      
      return matchesState
    }
    
    // If we're looking for a specific city, check if the job's address contains that exact city
    if (city) {
      const knownCities = findKnownCitiesInAddress(job)
      const targetCity = city.replace(/-/g, ' ') // Convert URL format back to readable
      const matchesCity = knownCities.some(knownCity => 
        normalizeString(knownCity) === normalizeString(targetCity)
      )
      
      // If category is specified, also check category match
      if (category) {
        const jobCategories = job.job_categories || []
        const normalizedJobCategories = jobCategories.map(cat => normalizeString(cat))
        const normalizedCategory = normalizeString(category)
        const categoryMatch = normalizedJobCategories.includes(normalizedCategory)
        return matchesCity && categoryMatch
      }
      
      return matchesCity
    }
    
    // Fallback: check if job matches the location page criteria
    const matchesLocationPage = jobMatchesLocationPage(job, locationPage)
    return matchesLocationPage
  })
}

// Get jobs for a specific category page
export function getJobsForCategoryPage(jobs: Job[], category: string): Job[] {
  const normalizedCategory = normalizeString(category)
  
  console.log(`Filtering jobs for category: ${category} (normalized: ${normalizedCategory})`)
  
  return jobs.filter(job => {
    const jobCategories = job.job_categories || []
    console.log(`Job ${job.id} (${job.job_title}) has categories:`, jobCategories)
    
    // Check if any job category matches the target category
    const hasMatchingCategory = jobCategories.some(cat => {
      const normalizedJobCat = normalizeString(cat)
      const matches = normalizedJobCat === normalizedCategory
      console.log(`  Category "${cat}" (normalized: ${normalizedJobCat}) matches: ${matches}`)
      return matches
    })
    
    // If category matches, also check if job has known cities for better routing
    if (hasMatchingCategory) {
      const knownCities = findKnownCitiesInAddress(job)
      console.log(`  Job ${job.id} matches category ${category}: ${hasMatchingCategory}`)
      console.log(`  Job ${job.id} contains known cities:`, knownCities)
    }
    
    console.log(`  Job ${job.id} matches category ${category}: ${hasMatchingCategory}`)
    return hasMatchingCategory
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