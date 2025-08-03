import { type NextRequest, NextResponse } from "next/server"
import { getJobs, createJob } from "@/lib/database"
import { getUserFromRequest } from "@/lib/auth"
import { searchJobs, searchJobsWithFilters } from "@/lib/search-engine"

export async function GET(request: NextRequest) {
  try {
    console.log("=== Jobs API GET Request ===")

    const user = getUserFromRequest(request)
    console.log("User from request:", user ? `${user.email} (ID: ${user.id})` : "Not authenticated")

    const { searchParams } = new URL(request.url)
    console.log("Search params:", Object.fromEntries(searchParams.entries()))

    const filters = {
      jobTitle: searchParams.get("jobTitle") || undefined,
      occupation: searchParams.get("occupation") || undefined,
      city: searchParams.get("city") || undefined,
      state: searchParams.get("state") || undefined,
      jobType: searchParams.get("jobType") || undefined,
      experienceLevel: searchParams.get("experienceLevel") || undefined,
    }

    // New search parameter
    const searchQuery = searchParams.get("search") || undefined

    console.log("Filters applied:", filters)
    console.log("Search query:", searchQuery)

    // Get all jobs from the database
    const allJobs = await getJobs({}, user?.id)
    console.log(`Successfully fetched ${allJobs.length} jobs`)

    let jobs = allJobs

    // Apply advanced search if search query is provided
    if (searchQuery && searchQuery.trim()) {
      const searchResults = searchJobsWithFilters(
        allJobs,
        searchQuery,
        {
          city: filters.city,
          state: filters.state,
          jobType: filters.jobType,
          experienceLevel: filters.experienceLevel,
          occupation: filters.occupation,
        }
      )
      
      // Extract jobs from search results and maintain order
      jobs = searchResults.map(result => result.job)
      console.log(`Search found ${jobs.length} matching jobs`)
    } else {
      // Apply traditional filters if no search query
      jobs = await getJobs(filters, user?.id)
    }

    return NextResponse.json({
      jobs,
      count: jobs.length,
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("=== Jobs API Error ===")
    console.error("Error details:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    // Return empty array or error message, but never mock data
    return NextResponse.json({
      jobs: [],
      count: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString(),
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== Jobs API POST Request ===")
    const user = getUserFromRequest(request)
    if (!user) {
      console.log("Authentication required for job creation")
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    console.log("Creating job for user:", user.email)
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = [
      'practice_email', 'job_title', 'practice_location', 'location_display',
      'job_type', 'job_categories', 'experience_level',
      'job_details', 'company_name', 'contact_phone', 'contact_email'
    ];
    const missingFields = requiredFields.filter(f => !body[f] || (Array.isArray(body[f]) && body[f].length === 0));
    if (missingFields.length > 0) {
      console.error("Job creation error: Missing fields", missingFields);
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    // Derive city and state from location_display if not provided
    let city = body.city;
    let state = body.state;
    
    if (!city || !state) {
      const locationDisplay = body.location_display;
      if (locationDisplay && locationDisplay.includes(',')) {
        const parts = locationDisplay.split(',').map((part: string) => part.trim());
        if (parts.length >= 2) {
          city = city || parts[0];
          state = state || parts[1];
        } else {
          city = city || locationDisplay;
        }
      } else {
        city = city || locationDisplay;
      }
    }

    const jobData = {
      user_id: user.id,
      practice_email: body.practice_email,
      job_title: body.job_title,
      practice_location: body.practice_location,
      location_display: body.location_display,
      location_lat: body.location_lat,
      location_lng: body.location_lng,
      job_type: body.job_type,
      job_categories: body.job_categories,
      experience_level: body.experience_level,
      work_setting: body.work_setting,
      salary_range: body.salary_range,
      job_details: body.job_details,
      company_name: body.company_name,
      contact_phone: body.contact_phone,
      contact_email: body.contact_email,
      company_website: body.company_website,
      company_logo_url: body.company_logo_url,
      city: city,
      state: state,
    }
    
    console.log("Job data to be created:", jobData)
    const job = await createJob(jobData)
    console.log("Job created successfully with ID:", job.id)
    return NextResponse.json(
      {
        job,
        success: true,
        message: "Job created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("=== Create Job Error ===")
    console.error("Error details:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create job",
      },
      { status: 500 },
    )
  }
}
