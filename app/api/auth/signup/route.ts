import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/database"
import { hashPassword, generateToken } from "@/lib/auth"
import { randomBytes } from "crypto"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, password, role = "employer" } = body

    if (!email || !name || !password) {
      return NextResponse.json({ error: "Email, name, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Only allow employer signup
    if (role !== "employer") {
      return NextResponse.json({ error: "Only employer signup is allowed" }, { status: 403 })
    }

    const cleanEmail = email.toLowerCase().trim()

    // Check if user already exists
    const existingUser = await getUserByEmail(cleanEmail)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
    }

    // Generate email verification token
    const emailVerificationToken = randomBytes(32).toString("hex")

    // Create new user (unverified)
    const passwordHash = hashPassword(password)
    const user = await createUser(cleanEmail, name.trim(), passwordHash, role, emailVerificationToken)

    // Send verification email
    await sendVerificationEmail({ to: user.email, token: emailVerificationToken })

    // Do not log in user yet; require verification
    return NextResponse.json({ success: true, message: "Verification email sent. Please check your inbox." }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
