import { Job } from './database'

export interface SearchResult {
  job: Job
  relevanceScore: number
  matchedFields: string[]
}

export interface SearchOptions {
  searchTerms?: string[]
  caseSensitive?: boolean
  exactMatch?: boolean
  fieldWeights?: Record<string, number>
}

// Default field weights for relevance scoring
const DEFAULT_FIELD_WEIGHTS: Record<string, number> = {
  job_title: 10,
  company_name: 8,
  location_display: 6,
  job_details: 5,
  job_categories: 4,
  job_type: 3,
  experience_level: 3,
  work_setting: 2,
  salary_range: 1
}

// Normalize text for comparison
function normalizeText(text: string, caseSensitive: boolean = false): string {
  if (!text) return ''
  let normalized = text.toString()
  if (!caseSensitive) {
    normalized = normalized.toLowerCase()
  }
  return normalized.trim()
}

// Check if text contains all search terms
function containsAllTerms(text: string, searchTerms: string[], caseSensitive: boolean = false): boolean {
  const normalizedText = normalizeText(text, caseSensitive)
  return searchTerms.every(term => 
    normalizedText.includes(normalizeText(term, caseSensitive))
  )
}

// Check if text contains any search terms
function containsAnyTerms(text: string, searchTerms: string[], caseSensitive: boolean = false): boolean {
  const normalizedText = normalizeText(text, caseSensitive)
  return searchTerms.some(term => 
    normalizedText.includes(normalizeText(term, caseSensitive))
  )
}

// Calculate relevance score for a job
function calculateRelevanceScore(
  job: Job, 
  searchTerms: string[], 
  fieldWeights: Record<string, number>,
  caseSensitive: boolean = false
): { score: number; matchedFields: string[] } {
  let totalScore = 0
  const matchedFields: string[] = []

  // Check each field
  Object.entries(fieldWeights).forEach(([field, weight]) => {
    const fieldValue = job[field as keyof Job]
    if (fieldValue) {
      const text = Array.isArray(fieldValue) ? fieldValue.join(' ') : String(fieldValue)
      
      if (containsAllTerms(text, searchTerms, caseSensitive)) {
        totalScore += weight * 2 // Bonus for exact phrase match
        matchedFields.push(field)
      } else if (containsAnyTerms(text, searchTerms, caseSensitive)) {
        totalScore += weight
        matchedFields.push(field)
      }
    }
  })

  return { score: totalScore, matchedFields }
}

// Main search function
export function searchJobs(
  jobs: Job[], 
  searchQuery: string, 
  options: SearchOptions = {}
): SearchResult[] {
  if (!searchQuery.trim()) {
    return jobs.map(job => ({
      job,
      relevanceScore: 0,
      matchedFields: []
    }))
  }

  const {
    caseSensitive = false,
    exactMatch = false,
    fieldWeights = DEFAULT_FIELD_WEIGHTS
  } = options

  // Parse search query into terms
  let searchTerms: string[]
  if (exactMatch) {
    searchTerms = [searchQuery.trim()]
  } else {
    searchTerms = searchQuery
      .split(/\s+/)
      .map(term => term.trim())
      .filter(term => term.length > 0)
  }

  if (searchTerms.length === 0) {
    return jobs.map(job => ({
      job,
      relevanceScore: 0,
      matchedFields: []
    }))
  }

  // Search through all jobs
  const results: SearchResult[] = []

  jobs.forEach(job => {
    const { score, matchedFields } = calculateRelevanceScore(
      job, 
      searchTerms, 
      fieldWeights, 
      caseSensitive
    )

    if (score > 0) {
      results.push({
        job,
        relevanceScore: score,
        matchedFields
      })
    }
  })

  // Sort by relevance score (highest first)
  results.sort((a, b) => b.relevanceScore - a.relevanceScore)

  return results
}

// Search with filters
export function searchJobsWithFilters(
  jobs: Job[],
  searchQuery: string,
  filters: {
    city?: string
    state?: string
    jobType?: string
    experienceLevel?: string
    occupation?: string
  } = {},
  options: SearchOptions = {}
): SearchResult[] {
  // First apply filters
  let filteredJobs = jobs

  if (filters.city) {
    const normalizedCity = filters.city.toLowerCase().replace(/\s+/g, '-')
    filteredJobs = filteredJobs.filter(job => 
      job.city?.toLowerCase().replace(/\s+/g, '-').includes(normalizedCity)
    )
  }

  if (filters.state) {
    const normalizedState = filters.state.toLowerCase().replace(/\s+/g, '-')
    filteredJobs = filteredJobs.filter(job => 
      job.state?.toLowerCase().replace(/\s+/g, '-').includes(normalizedState)
    )
  }

  if (filters.jobType) {
    filteredJobs = filteredJobs.filter(job => 
      job.job_type === filters.jobType
    )
  }

  if (filters.experienceLevel) {
    filteredJobs = filteredJobs.filter(job => 
      job.experience_level === filters.experienceLevel
    )
  }

  if (filters.occupation) {
    filteredJobs = filteredJobs.filter(job => 
      job.job_categories?.some(category => 
        category.toLowerCase().includes(filters.occupation!.toLowerCase())
      )
    )
  }

  // Then apply search
  if (searchQuery.trim()) {
    return searchJobs(filteredJobs, searchQuery, options)
  }

  // If no search query, return filtered jobs with default scores
  return filteredJobs.map(job => ({
    job,
    relevanceScore: 1,
    matchedFields: []
  }))
}

// Highlight search terms in text
export function highlightSearchTerms(
  text: string, 
  searchTerms: string[], 
  highlightClass: string = 'bg-yellow-200 dark:bg-yellow-800'
): string {
  if (!text || searchTerms.length === 0) return text

  let highlightedText = text
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi')
    highlightedText = highlightedText.replace(regex, `<span class="${highlightClass}">$1</span>`)
  })

  return highlightedText
}

// Get search suggestions based on job data
export function getSearchSuggestions(
  jobs: Job[], 
  partialQuery: string, 
  maxSuggestions: number = 10
): string[] {
  if (!partialQuery.trim()) return []

  const suggestions = new Set<string>()
  const normalizedQuery = partialQuery.toLowerCase()

  jobs.forEach(job => {
    // Add job titles
    if (job.job_title.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(job.job_title)
    }

    // Add company names
    if (job.company_name.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(job.company_name)
    }

    // Add locations
    if (job.location_display?.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(job.location_display)
    }

    // Add job categories
    job.job_categories?.forEach(category => {
      if (category.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(category)
      }
    })
  })

  return Array.from(suggestions).slice(0, maxSuggestions)
} 