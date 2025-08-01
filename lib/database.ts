import { neon } from "@neondatabase/serverless"

// Get database URL with proper error handling
function getDatabaseUrl(): string | null {
  const url = process.env.NEON_NEON_DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL

  if (!url) {
    console.warn("No database URL found. Using fallback mode.")
    return null
  }

  return url
}

// Initialize database connection
let sql: any = null
try {
  const dbUrl = getDatabaseUrl()
  if (dbUrl) {
    sql = neon(dbUrl)
  }
} catch (error) {
  console.error("Failed to initialize database connection:", error)
  sql = null
}

export interface User {
  id: number
  email: string
  name: string
  password_hash: string
  role: string
  avatar_url?: string
  is_verified: boolean
  email_verification_token?: string | null
  email_verified_at?: Date | null
  created_at: Date
  updated_at: Date
}

export interface Job {
  id: number
  user_id: number
  practice_email: string
  job_title: string
  practice_location: string
  location_display: string
  location_lat?: number
  location_lng?: number
  city?: string
  state?: string
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
  payment_status?: string
  stripe_payment_intent_id?: string
  payment_amount?: number
  created_at: Date
  updated_at: Date
}

export interface JobWithBookmark extends Job {
  is_bookmarked?: boolean
  posted_ago?: string
}

export interface JobFilters {
  jobTitle?: string
  occupation?: string
  city?: string
  state?: string
  jobType?: string
  experienceLevel?: string
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 24) {
    return diffInHours <= 1 ? "new" : `${diffInHours} hours ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`
}

// Remove MOCK_JOBS and all fallback logic that returns mock data

// Test database connection
export async function testConnection(): Promise<boolean> {
  if (!sql) {
    console.warn("No database connection available")
    return false
  }

  try {
    const result = await sql`SELECT 1 as test`
    return result.length > 0
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}

// Check if tables exist
export async function checkTablesExist(): Promise<boolean> {
  if (!sql) return false

  try {
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('users', 'jobs', 'job_bookmarks', 'applications')
    `
    return result.length >= 4
  } catch (error) {
    console.error("Check tables error:", error)
    return false
  }
}

// Helper function to apply filters to jobs
function applyFiltersToJobs(jobs: JobWithBookmark[], filters: JobFilters): JobWithBookmark[] {
  let filteredJobs = [...jobs]
  
  console.log("applyFiltersToJobs called with:", { 
    totalJobs: jobs.length, 
    filters,
    sampleJob: jobs[0] ? { city: jobs[0].city, state: jobs[0].state } : null
  })

  // Job title filter - only filter if there's actually a search term
  if (filters.jobTitle && filters.jobTitle.trim() !== "") {
    const searchTerm = filters.jobTitle.toLowerCase().trim()
    filteredJobs = filteredJobs.filter((job) => 
      job.job_title.toLowerCase().includes(searchTerm)
    )
  }

  // Occupation filter is now handled at database level
  // Client-side occupation filtering removed since it's done in the SQL query

  // City filter - allow partial, case-insensitive match
  if (filters.city && filters.city.trim() !== "" && filters.city !== "any") {
    const normalizedFilterCity = filters.city.toLowerCase().replace(/\s+/g, '-');
    filteredJobs = filteredJobs.filter((job) => {
      const jobCity = (job.city || "").toLowerCase().replace(/\s+/g, '-');
      // Allow partial match
      return jobCity.includes(normalizedFilterCity);
    })
  }

  // State filter - only filter if there's actually a state specified
  if (filters.state && filters.state.trim() !== "" && filters.state !== "any") {
    const normalizedFilterState = filters.state.toLowerCase().replace(/\s+/g, '-');
    console.log("Filtering by state:", { filterState: normalizedFilterState })
    
    // State mapping for normalization
    const stateMap: Record<string, string> = {
      "victoria": "vic",
      "new south wales": "nsw", 
      "queensland": "qld",
      "south australia": "sa",
      "western australia": "wa",
      "tasmania": "tas",
      "australian capital territory": "act",
      "northern territory": "nt"
    };
    
    // Normalize the filter state
    const normalizedFilterStateAbbr = stateMap[normalizedFilterState] || normalizedFilterState;
    
    filteredJobs = filteredJobs.filter((job) => {
      const jobState = (job.state || "").toLowerCase().replace(/\s+/g, '-');
      // Normalize job state as well
      const normalizedJobState = stateMap[jobState] || jobState;
      
      console.log("Comparing states:", { 
        jobState, 
        normalizedJobState,
        filterState: normalizedFilterState, 
        normalizedFilterStateAbbr,
        match: normalizedJobState === normalizedFilterStateAbbr 
      })
      
      // Skip jobs with 'unknown' state unless specifically filtering for it
      if (normalizedJobState === 'unknown' && normalizedFilterStateAbbr !== 'unknown') {
        return false;
      }
      return normalizedJobState === normalizedFilterStateAbbr;
    })
  }

  // Job type filter
  if (filters.jobType && filters.jobType !== "any") {
    filteredJobs = filteredJobs.filter((job) => job.job_type === filters.jobType)
  }

  // Experience level filter
  if (filters.experienceLevel && filters.experienceLevel !== "any") {
    filteredJobs = filteredJobs.filter((job) => job.experience_level === filters.experienceLevel)
  }

  console.log("applyFiltersToJobs result:", { 
    originalCount: jobs.length, 
    filteredCount: filteredJobs.length,
    remainingJobs: filteredJobs.map(j => ({ id: j.id, city: j.city, state: j.state }))
  })

  return filteredJobs
}

// Job operations with fallback - ALWAYS works
export async function getJobs(filters: JobFilters = {}, userId?: number): Promise<JobWithBookmark[]> {
  console.log("getJobs called with filters:", filters, "userId:", userId)

  // If no database connection, return empty array
  if (!sql) {
    console.warn("No database connection, returning empty job list")
    return []
  }

  try {
    // Check if database is properly set up
    const tablesExist = await checkTablesExist()
    if (!tablesExist) {
      console.warn("Database tables don't exist, returning empty job list")
      return []
    }

    // Normalize occupation filter to match the format used when creating jobs
    const normalizeString = (str: string) => str && typeof str === 'string' ? str.trim().toLowerCase().replace(/\s+/g, '-') : '';
    const normalizedOccupation = filters.occupation ? normalizeString(filters.occupation) : undefined;

    // Try to fetch from database
    let jobs
    if (normalizedOccupation && normalizedOccupation !== "any") {
      console.log('Fetching jobs with occupation filter:', filters.occupation, 'normalized to:', normalizedOccupation)
      jobs = await sql`
        SELECT 
          id, user_id, practice_email, job_title, practice_location, location_display,
          location_lat, location_lng, job_type, job_categories, experience_level,
          work_setting, salary_range, job_details, company_name, contact_phone,
          contact_email, company_website, company_logo_url, status,
          created_at, updated_at, city, state, payment_status
        FROM jobs 
        WHERE status = 'active' AND (
          payment_status IS NULL OR 
          (payment_status != 'failed' AND payment_status != 'refunded')
        ) AND ${normalizedOccupation} = ANY(job_categories)
        ORDER BY created_at DESC 
        LIMIT 1000
      `
      console.log(`Found ${jobs.length} jobs for occupation: ${filters.occupation} (normalized: ${normalizedOccupation})`)
      if (jobs.length > 0) {
        console.log('Sample job categories:', jobs.slice(0, 3).map((job: any) => ({
          id: job.id,
          title: job.job_title,
          categories: job.job_categories
        })))
      }
    } else {
      jobs = await sql`
        SELECT 
          id, user_id, practice_email, job_title, practice_location, location_display,
          location_lat, location_lng, job_type, job_categories, experience_level,
          work_setting, salary_range, job_details, company_name, contact_phone,
          contact_email, company_website, company_logo_url, status,
          created_at, updated_at, city, state, payment_status
        FROM jobs 
        WHERE status = 'active' AND (
          payment_status IS NULL OR 
          (payment_status != 'failed' AND payment_status != 'refunded')
        )
        ORDER BY created_at DESC 
        LIMIT 1000
      `
    }

    console.log(`Found ${jobs.length} jobs from database`)

    // If no jobs in database, return empty array
    if (jobs.length === 0) {
      console.warn("No jobs found in database, returning empty job list")
      return []
    }

    // Get bookmarks if user is logged in
    let bookmarkedJobIds: number[] = []
    if (userId) {
      try {
        const bookmarks = await sql`
          SELECT job_id FROM job_bookmarks WHERE user_id = ${userId}
        `
        bookmarkedJobIds = bookmarks.map((b: any) => b.job_id)
      } catch (bookmarkError) {
        console.warn("Failed to fetch bookmarks:", bookmarkError)
      }
    }

    // Process and filter jobs
    let processedJobs = jobs.map((job: any) => {
      // Handle job_categories - they might be stored as JSON string or array
      let jobCategories: string[] = []
      if (Array.isArray(job.job_categories)) {
        jobCategories = job.job_categories
      } else if (typeof job.job_categories === 'string') {
        try {
          jobCategories = JSON.parse(job.job_categories)
        } catch (e) {
          console.warn('Failed to parse job_categories for job', job.id, job.job_categories)
          jobCategories = []
        }
      }
      
      return {
        ...job,
        job_categories: jobCategories,
        company_logo_url: job.company_logo_url || "/placeholder.svg?height=40&width=40&text=Logo",
        posted_ago: getTimeAgo(new Date(job.created_at)),
        is_bookmarked: bookmarkedJobIds.includes(job.id),
        city: job.city || "",
        state: job.state || "",
      }
    }) as JobWithBookmark[]

    // Apply client-side filtering
    processedJobs = applyFiltersToJobs(processedJobs, filters)

    console.log(`Returning ${processedJobs.length} filtered jobs from database`)
    return processedJobs
  } catch (error) {
    console.error("getJobs database error:", error)
    return []
  }
}

export async function getJobById(id: number, userId?: number): Promise<JobWithBookmark | null> {
  // If no database connection, return null
  if (!sql) {
    return null
  }

  try {
    // Check if database is properly set up
    const tablesExist = await checkTablesExist()
    if (!tablesExist) {
      return null
    }

    const result = await sql`
      SELECT * FROM jobs WHERE id = ${id} AND status = 'active' LIMIT 1
    `

    if (result.length === 0) {
      return null
    }

    const job = result[0] as any

    // Check if bookmarked
    let isBookmarked = false
    if (userId) {
      try {
        const bookmark = await sql`
          SELECT id FROM job_bookmarks 
          WHERE user_id = ${userId} AND job_id = ${id} 
          LIMIT 1
        `
        isBookmarked = bookmark.length > 0
      } catch (bookmarkError) {
        console.warn("Failed to check bookmark:", bookmarkError)
      }
    }

    return {
      ...job,
      job_categories: Array.isArray(job.job_categories) ? job.job_categories : [],
      company_logo_url: job.company_logo_url || "/placeholder.svg?height=40&width=40&text=Logo",
      posted_ago: getTimeAgo(new Date(job.created_at)),
      is_bookmarked: isBookmarked,
    } as JobWithBookmark
  } catch (error) {
    console.error("getJobById error:", error)
    return null
  }
}

// User operations - only work with database
export async function getUserById(id: number): Promise<User | null> {
  if (!sql) return null

  try {
    const result = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`
    return (result[0] as User) || null
  } catch (error) {
    console.error("getUserById error:", error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  if (!sql) return null

  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`
    return (result[0] as User) || null
  } catch (error) {
    console.error("getUserByEmail error:", error)
    return null
  }
}

export async function createUser(
  email: string,
  name: string,
  passwordHash: string,
  role = "job_seeker",
  emailVerificationToken?: string
): Promise<User> {
  if (!sql) {
    throw new Error("Database not available")
  }
  try {
    const result = await sql`
      INSERT INTO users (email, name, password_hash, role, is_verified, email_verification_token)
      VALUES (${email}, ${name}, ${passwordHash}, ${role}, false, ${emailVerificationToken})
      RETURNING *
    `
    return result[0] as User
  } catch (error) {
    console.error("createUser error:", error)
    throw new Error("Failed to create user")
  }
}

export async function setUserVerified(token: string): Promise<boolean> {
  if (!sql) return false
  try {
    const result = await sql`
      UPDATE users
      SET is_verified = true, email_verification_token = NULL, email_verified_at = NOW()
      WHERE email_verification_token = ${token} AND is_verified = false
      RETURNING *
    `
    return result.length > 0
  } catch (error) {
    console.error("setUserVerified error:", error)
    return false
  }
}

export async function getUserByVerificationToken(token: string): Promise<User | null> {
  if (!sql) return null
  try {
    const result = await sql`
      SELECT * FROM users WHERE email_verification_token = ${token} LIMIT 1
    `
    return (result[0] as User) || null
  } catch (error) {
    console.error("getUserByVerificationToken error:", error)
    return null
  }
}

// Other database operations with fallbacks
export async function getJobsByUserId(userId: number): Promise<Job[]> {
  if (!sql) return []

  try {
    const result = await sql`
      SELECT * FROM jobs 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    return result.map((job: any) => ({
      ...job,
      job_categories: Array.isArray(job.job_categories) ? job.job_categories : [],
      company_logo_url: job.company_logo_url || "/placeholder.svg?height=40&width=40&text=Logo",
    })) as Job[]
  } catch (error) {
    console.error("getJobsByUserId error:", error)
    return []
  }
}

export async function createJob(jobData: any): Promise<Job> {
  if (!sql) {
    throw new Error("Database not available")
  }

  try {
    // Import location matcher
    const { parseLocation } = await import('./location-matcher')
    
    // Normalize and validate fields
    const normalizeString = (str: string) => str && typeof str === 'string' ? str.trim().toLowerCase().replace(/\s+/g, '-') : '';
    const normalizeCategories = (categories: any) => Array.isArray(categories) ? categories.map(normalizeString) : [];
    
    // Parse location using the new location matcher
    const locationMatch = parseLocation(jobData.practice_location)
    const city = locationMatch.normalizedCity || normalizeString(jobData.city);
    const state = locationMatch.normalizedState || normalizeString(jobData.state);
    const job_categories = normalizeCategories(jobData.job_categories);
    const company_logo_url = jobData.company_logo_url || "/placeholder.svg?height=40&width=40&text=Logo";
    
    console.log("createJob - location data:", {
      originalLocation: jobData.practice_location,
      locationMatch,
      normalizedCity: city,
      normalizedState: state,
      locationDisplay: jobData.location_display,
      isLocationMatched: locationMatch.isMatched
    });
    
    if (!job_categories.length) {
      console.error("createJob error: Missing required job categories", { job_categories });
      throw new Error("At least one job category is required.");
    }
    
    const result = await sql`
      INSERT INTO jobs (
        user_id, practice_email, job_title, practice_location, location_display,
        location_lat, location_lng, job_type, job_categories, experience_level,
        work_setting, salary_range, job_details, company_name, contact_phone,
        contact_email, company_website, company_logo_url, status, is_featured, city, state,
        payment_status, payment_amount
      )
      VALUES (
        ${jobData.user_id}, ${jobData.practice_email}, ${jobData.job_title},
        ${jobData.practice_location}, ${jobData.location_display},
        ${jobData.location_lat || null}, ${jobData.location_lng || null},
        ${jobData.job_type}, ${job_categories}, ${jobData.experience_level},
        ${jobData.work_setting || null}, ${jobData.salary_range || null},
        ${jobData.job_details}, ${jobData.company_name}, ${jobData.contact_phone},
        ${jobData.contact_email}, ${jobData.company_website || null},
        ${company_logo_url}, 'active', false, ${city}, ${state},
        ${jobData.payment_status || 'pending'}, ${jobData.payment_amount || 100}
      )
      RETURNING *
    `
    const job = result[0] as any
    console.log("createJob - job created:", {
      id: job.id,
      storedCity: job.city,
      storedState: job.state,
      locationDisplay: job.location_display,
      practiceLocation: job.practice_location
    });
    
    return {
      ...job,
      job_categories: Array.isArray(job.job_categories) ? job.job_categories : [],
    } as Job
  } catch (error) {
    console.error("createJob error:", error)
    throw new Error("Failed to create job")
  }
}

export async function toggleBookmark(userId: number, jobId: number): Promise<boolean> {
  if (!sql) {
    throw new Error("Database not available")
  }

  try {
    const existing = await sql`
      SELECT id FROM job_bookmarks 
      WHERE user_id = ${userId} AND job_id = ${jobId}
      LIMIT 1
    `

    if (existing.length > 0) {
      await sql`
        DELETE FROM job_bookmarks 
        WHERE user_id = ${userId} AND job_id = ${jobId}
      `
      return false
    } else {
      await sql`
        INSERT INTO job_bookmarks (user_id, job_id)
        VALUES (${userId}, ${jobId})
        ON CONFLICT (user_id, job_id) DO NOTHING
      `
      return true
    }
  } catch (error) {
    console.error("toggleBookmark error:", error)
    throw new Error("Failed to toggle bookmark")
  }
}

export async function getBookmarkedJobs(userId: number): Promise<JobWithBookmark[]> {
  if (!sql) return []

  try {
    const result = await sql`
      SELECT j.*, true as is_bookmarked
      FROM jobs j
      INNER JOIN job_bookmarks b ON j.id = b.job_id
      WHERE b.user_id = ${userId} AND j.status = 'active'
      ORDER BY b.created_at DESC
    `

    return result.map((job: any) => ({
      ...job,
      job_categories: Array.isArray(job.job_categories) ? job.job_categories : [],
      company_logo_url: job.company_logo_url || "/placeholder.svg?height=40&width=40&text=Logo",
      posted_ago: getTimeAgo(new Date(job.created_at)),
    })) as JobWithBookmark[]
  } catch (error) {
    console.error("getBookmarkedJobs error:", error)
    return []
  }
}

export async function createApplication(userId: number, jobId: number): Promise<boolean> {
  if (!sql) return false

  try {
    await sql`
      INSERT INTO applications (user_id, job_id, status)
      VALUES (${userId}, ${jobId}, 'pending')
      ON CONFLICT (user_id, job_id) DO NOTHING
    `
    return true
  } catch (error) {
    console.error("createApplication error:", error)
    return false
  }
}

export async function getApplicationsByUserId(userId: number): Promise<any[]> {
  if (!sql) return []

  try {
    const result = await sql`
      SELECT a.*, j.job_title, j.company_name, j.location_display
      FROM applications a
      INNER JOIN jobs j ON a.job_id = j.id
      WHERE a.user_id = ${userId}
      ORDER BY a.applied_at DESC
    `
    return result as any[]
  } catch (error) {
    console.error("getApplicationsByUserId error:", error)
    return []
  }
}

export async function getApplicationsByJobId(jobId: number, userId: number): Promise<any[]> {
  if (!sql) return []

  try {
    const result = await sql`
      SELECT a.*, u.name, u.email
      FROM applications a
      INNER JOIN users u ON a.user_id = u.id
      INNER JOIN jobs j ON a.job_id = j.id
      WHERE a.job_id = ${jobId} AND j.user_id = ${userId}
      ORDER BY a.applied_at DESC
    `
    return result as any[]
  } catch (error) {
    console.error("getApplicationsByJobId error:", error)
    return []
  }
}

export async function deleteJob(jobId: number, userId?: number): Promise<boolean> {
  if (!sql) return false;
  try {
    // Optionally, check if the user owns the job (if userId is provided)
    if (userId) {
      const job = await sql`SELECT id FROM jobs WHERE id = ${jobId} AND user_id = ${userId}`;
      if (job.length === 0) {
        return false; // Not found or not owned by user
      }
    }
    // Delete related applications
    await sql`DELETE FROM applications WHERE job_id = ${jobId}`;
    // Delete related bookmarks
    await sql`DELETE FROM job_bookmarks WHERE job_id = ${jobId}`;
    // Delete the job itself
    await sql`DELETE FROM jobs WHERE id = ${jobId}`;
    return true;
  } catch (error) {
    console.error("deleteJob error:", error);
    return false;
  }
}

export { sql }
