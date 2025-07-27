import { type NextRequest, NextResponse } from "next/server"
import { setUserVerified, getUserByVerificationToken } from "@/lib/database"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 })
  }
  const user = await getUserByVerificationToken(token)
  if (!user) {
    return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 400 })
  }
  const verified = await setUserVerified(token)
  if (!verified) {
    return NextResponse.json({ success: false, error: "Could not verify user" }, { status: 400 })
  }
  return NextResponse.json({ success: true, message: "Email verified successfully. You can now sign in." })
} 