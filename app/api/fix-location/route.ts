import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    const { jobId } = await request.json();

    // Fix the location data for the specific job
    // Change from: city: 'wurundjeri-way', state: 'docklands'
    // To: city: 'docklands', state: 'victoria'
    const result = await sql`
      UPDATE jobs 
      SET 
        city = 'docklands',
        state = 'victoria',
        location_display = 'Docklands, Victoria'
      WHERE id = ${jobId}
      RETURNING id, job_title, city, state, location_display
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      updatedJob: result[0],
      message: "Location data fixed successfully"
    });
  } catch (error) {
    console.error("Fix location error:", error);
    return NextResponse.json({ error: "Failed to fix location" }, { status: 500 });
  }
} 