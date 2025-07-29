import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    console.log("=== Update Jobs Locations API ===")

    // Check current state of jobs
    const currentJobs = await sql`
      SELECT 
        id, 
        job_title, 
        practice_location, 
        location_display,
        city,
        state,
        job_categories
      FROM jobs 
      WHERE status = 'active' 
      ORDER BY created_at DESC
      LIMIT 500
    `

    console.log("Current jobs state:", currentJobs)

    // Update jobs that have location_display but missing city/state
    const updateResult = await sql`
      UPDATE jobs 
      SET 
        city = CASE 
          WHEN city IS NULL OR city = '' THEN
            CASE 
              WHEN location_display LIKE '%,%' THEN 
                LOWER(TRIM(SPLIT_PART(location_display, ',', 1)))
              ELSE 'unknown'
            END
          ELSE city
        END,
        state = CASE 
          WHEN state IS NULL OR state = '' THEN
            CASE 
              WHEN location_display LIKE '%,%' THEN 
                UPPER(TRIM(SPLIT_PART(location_display, ',', 2)))
              ELSE 'unknown'
            END
          ELSE state
        END
      WHERE (city IS NULL OR city = '' OR state IS NULL OR state = '')
        AND location_display IS NOT NULL 
        AND location_display != ''
    `

    // Normalize existing city and state values
    const normalizeResult = await sql`
      UPDATE jobs 
      SET 
        city = LOWER(REPLACE(TRIM(city), ' ', '-')),
        state = LOWER(REPLACE(TRIM(state), ' ', '-'))
      WHERE city IS NOT NULL 
        AND city != '' 
        AND state IS NOT NULL 
        AND state != ''
    `

    // Set default values for jobs that still don't have city/state
    const defaultResult = await sql`
      UPDATE jobs 
      SET 
        city = 'unknown',
        state = 'unknown'
      WHERE (city IS NULL OR city = '') 
        OR (state IS NULL OR state = '')
    `

    // Get updated jobs
    const updatedJobs = await sql`
      SELECT 
        id, 
        job_title, 
        city,
        state,
        job_categories
      FROM jobs 
      WHERE status = 'active'
      ORDER BY created_at DESC
      LIMIT 200
    `

    return NextResponse.json({
      success: true,
      message: "Jobs locations updated successfully",
      currentJobs: currentJobs,
      updatedJobs: updatedJobs,
      updateCount: updateResult.count,
      normalizeCount: normalizeResult.count,
      defaultCount: defaultResult.count,
    })
  } catch (error) {
    console.error("=== Update Jobs Locations Error ===")
    console.error("Error details:", error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }, { status: 500 })
  }
} 