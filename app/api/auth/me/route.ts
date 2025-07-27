import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getUserById } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    console.log("Auth me endpoint called")

    const user = getUserFromRequest(request)
    if (!user) {
      console.log("No user token found")
      return NextResponse.json({ user: null }, { status: 200 })
    }

    console.log("User token found, fetching from database:", user.id)

    // Get fresh user data from database
    const dbUser = await getUserById(user.id)
    if (!dbUser) {
      console.log("User not found in database")
      return NextResponse.json({ user: null }, { status: 200 })
    }

    console.log("User found in database:", dbUser.email)

    return NextResponse.json(
      {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          avatar_url: dbUser.avatar_url,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Auth me error:", error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
