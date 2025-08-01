import { type NextRequest, NextResponse } from "next/server"
import { getAllLocations, getLocationSuggestions, parseLocation, isLocationMatched } from "@/lib/location-matcher"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const action = searchParams.get("action") || "suggestions"

    console.log("=== Locations API GET Request ===")
    console.log("Query:", query)
    console.log("Action:", action)

    switch (action) {
      case "suggestions":
        if (!query || query.length < 2) {
          return NextResponse.json({
            suggestions: [],
            success: true
          })
        }

        const suggestions = getLocationSuggestions(query)
        return NextResponse.json({
          suggestions,
          success: true
        })

      case "validate":
        const locationMatch = parseLocation(query)
        return NextResponse.json({
          isValid: locationMatch.isMatched,
          match: locationMatch,
          success: true
        })

      case "all":
        const allLocations = getAllLocations()
        return NextResponse.json({
          locations: allLocations,
          success: true
        })

      default:
        return NextResponse.json({
          error: "Invalid action",
          success: false
        }, { status: 400 })
    }
  } catch (error) {
    console.error("=== Locations API Error ===")
    console.error("Error details:", error)
    
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error occurred",
      success: false
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { location } = body

    if (!location) {
      return NextResponse.json({
        error: "Location is required",
        success: false
      }, { status: 400 })
    }

    const locationMatch = parseLocation(location)
    
    return NextResponse.json({
      isValid: locationMatch.isMatched,
      match: locationMatch,
      success: true
    })
  } catch (error) {
    console.error("=== Locations API POST Error ===")
    console.error("Error details:", error)
    
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error occurred",
      success: false
    }, { status: 500 })
  }
} 