import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    // Get all jobs with their location data
    const jobs = await sql`
      SELECT 
        id, job_title, city, state, location_display, practice_location,
        job_categories, payment_status, status, created_at
      FROM jobs 
      WHERE status = 'active'
      ORDER BY created_at DESC
    `;

    // Get some sample jobs to check their data
    const sampleJobs = jobs.slice(0, 5);

    return NextResponse.json({
      totalJobs: jobs.length,
      sampleJobs,
      allJobs: jobs,
      message: "Job data for debugging location filtering"
    });
  } catch (error) {
    console.error("Debug jobs error:", error);
    return NextResponse.json({ error: "Debug failed" }, { status: 500 });
  }
} 