import { type NextRequest, NextResponse } from "next/server"
import { setUserVerified, getUserByVerificationToken } from "@/lib/database"
import { generateToken } from "@/lib/auth"

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
  // Generate JWT and set as HTTP-only cookie
  const jwt = generateToken({ id: user.id, email: user.email, name: user.name, role: user.role, avatar_url: user.avatar_url })
  const response = NextResponse.json({ success: true, message: "Email verified and signed in." })
  response.cookies.set("auth-token", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })
  return response
} 