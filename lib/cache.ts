// Simple in-memory cache implementation
// In production, use Redis or a proper caching service

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class Cache {
  private store = new Map<string, CacheEntry<any>>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes

  // Set cache entry
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  // Get cache entry
  get<T>(key: string): T | null {
    const entry = this.store.get(key)
    
    if (!entry) {
      return null
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key)
      return null
    }

    return entry.data
  }

  // Delete cache entry
  delete(key: string): void {
    this.store.delete(key)
  }

  // Clear all cache
  clear(): void {
    this.store.clear()
  }

  // Get cache size
  size(): number {
    return this.store.size
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.store.delete(key)
      }
    }
  }
}

// Global cache instance
const cache = new Cache()

// Clean up expired entries every minute
setInterval(() => {
  cache.cleanup()
}, 60 * 1000)

// Cache keys
export const CACHE_KEYS = {
  JOBS: 'jobs',
  JOBS_BY_FILTER: 'jobs_by_filter',
  JOBS_BY_USER: 'jobs_by_user',
  USER: 'user',
  JOB_DETAIL: 'job_detail',
  BOOKMARKS: 'bookmarks',
  APPLICATIONS: 'applications',
  PRACTICE_DETAILS: 'practice_details'
} as const

// Cache functions for jobs
export const jobCache = {
  // Cache jobs with filters
  setJobs: (filters: any, jobs: any[]) => {
    const key = `${CACHE_KEYS.JOBS_BY_FILTER}:${JSON.stringify(filters)}`
    cache.set(key, jobs, 2 * 60 * 1000) // 2 minutes for job listings
  },

  getJobs: (filters: any) => {
    const key = `${CACHE_KEYS.JOBS_BY_FILTER}:${JSON.stringify(filters)}`
    return cache.get(key)
  },

  // Cache individual job
  setJob: (jobId: number, job: any) => {
    const key = `${CACHE_KEYS.JOB_DETAIL}:${jobId}`
    cache.set(key, job, 5 * 60 * 1000) // 5 minutes for job details
  },

  getJob: (jobId: number) => {
    const key = `${CACHE_KEYS.JOB_DETAIL}:${jobId}`
    return cache.get(key)
  },

  // Cache user's jobs
  setUserJobs: (userId: number, jobs: any[]) => {
    const key = `${CACHE_KEYS.JOBS_BY_USER}:${userId}`
    cache.set(key, jobs, 1 * 60 * 1000) // 1 minute for user jobs
  },

  getUserJobs: (userId: number) => {
    const key = `${CACHE_KEYS.JOBS_BY_USER}:${userId}`
    return cache.get(key)
  },

  // Invalidate job-related cache
  invalidateJob: (jobId: number) => {
    cache.delete(`${CACHE_KEYS.JOB_DETAIL}:${jobId}`)
    // Note: This is a simplified implementation since we can't access private store
    // In a real implementation, you'd want to track keys or use a different approach
    cache.clear() // Clear all cache as a fallback
  },

  invalidateUserJobs: (userId: number) => {
    cache.delete(`${CACHE_KEYS.JOBS_BY_USER}:${userId}`)
  },

  invalidateAllJobs: () => {
    // Note: This is a simplified implementation since we can't access private store
    // In a real implementation, you'd want to track keys or use a different approach
    cache.clear() // Clear all cache as a fallback
  }
}

// Cache functions for users
export const userCache = {
  setUser: (userId: number, user: any) => {
    const key = `${CACHE_KEYS.USER}:${userId}`
    cache.set(key, user, 10 * 60 * 1000) // 10 minutes for user data
  },

  getUser: (userId: number) => {
    const key = `${CACHE_KEYS.USER}:${userId}`
    return cache.get(key)
  },

  invalidateUser: (userId: number) => {
    cache.delete(`${CACHE_KEYS.USER}:${userId}`)
  }
}

// Cache functions for bookmarks
export const bookmarkCache = {
  setBookmarks: (userId: number, bookmarks: any[]) => {
    const key = `${CACHE_KEYS.BOOKMARKS}:${userId}`
    cache.set(key, bookmarks, 2 * 60 * 1000) // 2 minutes for bookmarks
  },

  getBookmarks: (userId: number) => {
    const key = `${CACHE_KEYS.BOOKMARKS}:${userId}`
    return cache.get(key)
  },

  invalidateBookmarks: (userId: number) => {
    cache.delete(`${CACHE_KEYS.BOOKMARKS}:${userId}`)
  }
}

// Cache functions for applications
export const applicationCache = {
  setApplications: (userId: number, applications: any[]) => {
    const key = `${CACHE_KEYS.APPLICATIONS}:${userId}`
    cache.set(key, applications, 2 * 60 * 1000) // 2 minutes for applications
  },

  getApplications: (userId: number) => {
    const key = `${CACHE_KEYS.APPLICATIONS}:${userId}`
    return cache.get(key)
  },

  invalidateApplications: (userId: number) => {
    cache.delete(`${CACHE_KEYS.APPLICATIONS}:${userId}`)
  }
}

// Cache functions for practice details
export const practiceCache = {
  setPracticeDetails: (userId: number, details: any) => {
    const key = `${CACHE_KEYS.PRACTICE_DETAILS}:${userId}`
    cache.set(key, details, 30 * 60 * 1000) // 30 minutes for practice details
  },

  getPracticeDetails: (userId: number) => {
    const key = `${CACHE_KEYS.PRACTICE_DETAILS}:${userId}`
    return cache.get(key)
  },

  invalidatePracticeDetails: (userId: number) => {
    cache.delete(`${CACHE_KEYS.PRACTICE_DETAILS}:${userId}`)
  }
}

// Utility function to generate cache keys
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|')
  return `${prefix}:${sortedParams}`
}

// Cache middleware for API routes
export function withCache<T>(
  keyGenerator: (request: any) => string,
  ttl: number = 5 * 60 * 1000
) {
  return (handler: Function) => {
    return async (request: any) => {
      const cacheKey = keyGenerator(request)
      const cached = cache.get(cacheKey)
      
      if (cached) {
        return new Response(JSON.stringify(cached), {
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const response = await handler(request)
      
      if (response.ok) {
        const data = await response.json()
        cache.set(cacheKey, data, ttl)
      }

      return response
    }
  }
}

export default cache 