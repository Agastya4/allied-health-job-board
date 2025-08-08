import { NextResponse } from "next/server"
import { testConnection, checkTablesExist } from "@/lib/database"

export async function GET() {
  try {
    console.log("=== Testing Database Connection ===")
    
    const connectionTest = await testConnection()
    console.log("Database connection test:", connectionTest)
    
    const tablesExist = await checkTablesExist()
    console.log("Tables exist check:", tablesExist)
    
    return NextResponse.json({
      success: true,
      databaseConnected: connectionTest,
      tablesExist: tablesExist,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
