import { type NextRequest, NextResponse } from "next/server"
import { getJobById, deleteJob } from "@/lib/database"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request)
    const { id } = await params
    const jobId = Number.parseInt(id)

    if (isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 })
    }

    const job = await getJobById(jobId, user?.id)
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ job })
  } catch (error) {
    console.error("Get job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const jobId = Number.parseInt(id)
    if (isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 })
    }
    // Only allow deletion if the job belongs to the user
    const deleted = await deleteJob(jobId, user.id)
    if (!deleted) {
      return NextResponse.json({ error: "Job not found or not owned by user" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
