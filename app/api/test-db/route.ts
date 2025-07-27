import { NextResponse } from "next/server"
import { testConnection, sql } from "@/lib/database"

export async function GET() {
  try {
    console.log("=== Database Test ===")
    
    const isConnected = await testConnection()
    console.log("Connection test result:", isConnected)

    if (!isConnected) {
      return NextResponse.json({
        success: false,
        message: "Database connection failed",
        timestamp: new Date().toISOString(),
        environment: {
          hasNeonUrl: !!process.env.NEON_DATABASE_URL,
          hasPostgresUrl: !!process.env.POSTGRES_URL,
          hasPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
          nodeEnv: process.env.NODE_ENV,
        },
      }, { status: 500 })
    }

    // Test table existence
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    console.log("Tables found:", tables.map((t: any) => t.table_name))

    // Test jobs table
    let jobCount = 0
    try {
      const jobResult = await sql`SELECT COUNT(*) as count FROM jobs`
      jobCount = jobResult[0].count
      console.log("Jobs count:", jobCount)
    } catch (jobError) {
      console.error("Jobs table error:", jobError)
    }

    // Test users table
    let userCount = 0
    try {
      const userResult = await sql`SELECT COUNT(*) as count FROM users`
      userCount = userResult[0].count
      console.log("Users count:", userCount)
    } catch (userError) {
      console.error("Users table error:", userError)
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
      data: {
        tables: tables.map((t: any) => t.table_name),
        jobCount,
        userCount,
      },
      environment: {
        hasNeonUrl: !!process.env.NEON_DATABASE_URL,
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        hasPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
        nodeEnv: process.env.NODE_ENV,
      },
    })
  } catch (error: any) {
    console.error("=== Database Test Error ===")
    console.error("Error details:", error)
    console.error("Error stack:", error.stack)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
