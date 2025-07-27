import { type NextRequest, NextResponse } from "next/server"
import { getJobsByUserId } from "@/lib/database"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const jobs = await getJobsByUserId(user.id)
    return NextResponse.json({ jobs })
  } catch (error) {
    console.error("Get my jobs error:", error)
    return NextResponse.json({ jobs: [] }, { status: 500 })
  }
}
