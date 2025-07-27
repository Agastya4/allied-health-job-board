import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

// Use environment variable - no fallback for security
const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET or NEXTAUTH_SECRET environment variable is required")
}

export interface User {
  id: number
  email: string
  name: string
  role: string
  avatar_url?: string
}

export function hashPassword(password: string): string {
  try {
    return bcrypt.hashSync(password, 12)
  } catch (error) {
    console.error("Password hashing error:", error)
    throw new Error("Failed to hash password")
  }
}

export function verifyPassword(password: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(password, hash)
  } catch (error) {
    console.error("Password verification error:", error)
    return false
  }
}

export function generateToken(user: User): string {
  try {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "30d" },
    )
  } catch (error) {
    console.error("Token generation error:", error)
    throw new Error("Failed to generate token")
  }
}

export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, JWT_SECRET) as User
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export function getUserFromRequest(request: NextRequest): User | null {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) return null
    return verifyToken(token)
  } catch (error) {
    console.error("Get user from request error:", error)
    return null
  }
}
