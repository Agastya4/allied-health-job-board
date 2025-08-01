import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    if (!query || query.length < 3) {
      return NextResponse.json({
        predictions: [],
        success: true
      })
    }

    // Use OpenStreetMap Nominatim API (completely free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(query + ', Australia')}` +
      `&countrycodes=au` +
      `&format=json` +
      `&limit=10` +
      `&addressdetails=1` +
      `&accept-language=en`,
      {
        headers: {
          'User-Agent': 'AlliedHealthJobs-AU/1.0'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`)
    }

    const data = await response.text()
    
    // Check if response is HTML (rate limited or error)
    if (data.trim().startsWith('<')) {
      console.warn("OpenStreetMap API returned HTML (likely rate limited)")
      return NextResponse.json({
        predictions: [],
        success: false,
        error: "Address service temporarily unavailable"
      })
    }

    let jsonData
    try {
      jsonData = JSON.parse(data)
    } catch (parseError) {
      console.error("Failed to parse OpenStreetMap response:", parseError)
      return NextResponse.json({
        predictions: [],
        success: false,
        error: "Invalid response from address service"
      })
    }

    // Format predictions for our use case
    const predictions = jsonData.map((place: any) => ({
      placeId: place.place_id,
      description: place.display_name,
      structuredFormatting: {
        main_text: place.name || place.display_name.split(',')[0],
        secondary_text: place.display_name.split(',').slice(1, 3).join(',')
      },
      types: place.type ? [place.type] : [],
      matchedSubstrings: []
    }))

    return NextResponse.json({
      predictions,
      success: true
    })

  } catch (error) {
    console.error("Address validation error:", error)
    return NextResponse.json({
      predictions: [],
      success: false,
      error: error instanceof Error ? error.message : "Address validation failed"
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { placeId } = body

    if (!placeId) {
      return NextResponse.json({
        error: "Place ID is required",
        success: false
      })
    }

    // Get detailed place information using Nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/lookup?` +
      `osm_ids=${placeId}` +
      `&format=json` +
      `&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'AlliedHealthJobs-AU/1.0'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`)
    }

    const data = await response.text()
    
    // Check if response is HTML (rate limited or error)
    if (data.trim().startsWith('<')) {
      console.warn("OpenStreetMap API returned HTML (likely rate limited)")
      return NextResponse.json({
        error: "Address service temporarily unavailable",
        success: false
      })
    }

    let jsonData
    try {
      jsonData = JSON.parse(data)
    } catch (parseError) {
      console.error("Failed to parse OpenStreetMap response:", parseError)
      return NextResponse.json({
        error: "Invalid response from address service",
        success: false
      })
    }
    
    if (!jsonData || jsonData.length === 0) {
      return NextResponse.json({
        error: "Place not found",
        success: false
      })
    }

    const place = jsonData[0]
    const address = place.address || {}

    // Extract address components
    const addressDetails = {
      formattedAddress: place.display_name,
      streetNumber: address.house_number || "",
      route: address.road || "",
      locality: address.city || address.town || address.suburb || "", // City/Suburb
      administrativeAreaLevel1: address.state || "", // State
      postalCode: address.postcode || "",
      country: address.country || "Australia",
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon)
    }

    return NextResponse.json({
      address: addressDetails,
      success: true
    })

  } catch (error) {
    console.error("Place details error:", error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Failed to get place details",
      success: false
    })
  }
} 