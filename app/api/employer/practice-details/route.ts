import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get practice details for the user
    const result = await sql`
      SELECT 
        practice_name,
        street_address,
        suburb,
        postcode,
        state,
        phone_number,
        website,
        logo_url
      FROM employer_practice_details 
      WHERE user_id = ${user.id}
      LIMIT 1
    `

    const practiceDetails = result.length > 0 ? result[0] : null

    return NextResponse.json({
      success: true,
      practiceDetails
    })
  } catch (error) {
    console.error("Error fetching practice details:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch practice details"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const {
      practiceName,
      streetAddress,
      suburb,
      postcode,
      state,
      phoneNumber,
      website,
      logoUrl
    } = body

    // Upsert practice details
    const result = await sql`
      INSERT INTO employer_practice_details (
        user_id, practice_name, street_address, suburb, postcode, 
        state, phone_number, website, logo_url, created_at, updated_at
      ) VALUES (
        ${user.id}, ${practiceName}, ${streetAddress}, ${suburb}, ${postcode},
        ${state}, ${phoneNumber}, ${website}, ${logoUrl}, NOW(), NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        practice_name = EXCLUDED.practice_name,
        street_address = EXCLUDED.street_address,
        suburb = EXCLUDED.suburb,
        postcode = EXCLUDED.postcode,
        state = EXCLUDED.state,
        phone_number = EXCLUDED.phone_number,
        website = EXCLUDED.website,
        logo_url = EXCLUDED.logo_url,
        updated_at = NOW()
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      practiceDetails: result[0]
    })
  } catch (error) {
    console.error("Error saving practice details:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to save practice details"
    }, { status: 500 })
  }
} 