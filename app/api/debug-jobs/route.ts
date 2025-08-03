import { type NextRequest, NextResponse } from "next/server"
import { getJobs } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    console.log("=== Debug Jobs API ===")
    
    const jobs = await getJobs({})
    console.log(`Found ${jobs.length} jobs`)
    
    // Show detailed information about each job
    const jobDetails = jobs.map(job => ({
      id: job.id,
      job_title: job.job_title,
      job_categories: job.job_categories,
      practice_location: job.practice_location,
      location_display: job.location_display,
      city: job.city,
      state: job.state,
      status: job.status,
      payment_status: job.payment_status,
      created_at: job.created_at,
      is_featured: job.is_featured
    }))
    
    return NextResponse.json({
      totalJobs: jobs.length,
      jobs: jobDetails,
      message: "Debug job information"
    })
  } catch (error) {
    console.error("Debug jobs error:", error)
    return NextResponse.json({ error: "Debug failed" }, { status: 500 })
  }
} 