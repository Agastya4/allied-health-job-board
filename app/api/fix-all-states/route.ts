import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    // State mapping: full names and variations to abbreviations
    const stateMappings = [
      { from: "victoria", to: "vic" },
      { from: "new south wales", to: "nsw" },
      { from: "queensland", to: "qld" },
      { from: "south australia", to: "sa" },
      { from: "western australia", to: "wa" },
      { from: "tasmania", to: "tas" },
      { from: "australian capital territory", to: "act" },
      { from: "northern territory", to: "nt" },
      // Also handle uppercase variations
      { from: "VICTORIA", to: "vic" },
      { from: "NEW SOUTH WALES", to: "nsw" },
      { from: "QUEENSLAND", to: "qld" },
      { from: "SOUTH AUSTRALIA", to: "sa" },
      { from: "WESTERN AUSTRALIA", to: "wa" },
      { from: "TASMANIA", to: "tas" },
      { from: "AUSTRALIAN CAPITAL TERRITORY", to: "act" },
      { from: "NORTHERN TERRITORY", to: "nt" },
    ];

    let totalUpdated = 0;
    const results = [];

    // Update each state mapping
    for (const mapping of stateMappings) {
      const result = await sql`
        UPDATE jobs 
        SET state = ${mapping.to}
        WHERE LOWER(state) = ${mapping.from.toLowerCase()}
        RETURNING id, job_title, city, state, location_display
      `;
      
      if (result.length > 0) {
        totalUpdated += result.length;
        results.push({
          from: mapping.from,
          to: mapping.to,
          updatedJobs: result.length,
          sampleJobs: result.slice(0, 3) // Show first 3 examples
        });
      }
    }

    // Get summary of all jobs after update
    const allJobs = await sql`
      SELECT id, job_title, city, state, location_display
      FROM jobs 
      WHERE status = 'active'
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      totalUpdated,
      stateMappings: results,
      allJobsAfterUpdate: allJobs,
      message: `Updated ${totalUpdated} jobs to use state abbreviations`
    });
  } catch (error) {
    console.error("Fix all states error:", error);
    return NextResponse.json({ error: "Failed to fix states" }, { status: 500 });
  }
} 