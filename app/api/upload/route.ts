import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getUserFromRequest } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Validate file size (10MB max for blog images, 5MB for logos)
    const maxSize = file.name.includes('blog') || file.name.includes('cover') ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File size must be less than ${maxSize / (1024 * 1024)}MB` }, { status: 400 })
    }

    // Upload to Vercel Blob
    const token = process.env.VERCEL_BLOB_READ_WRITE_TOKEN
    if (!token) {
      return NextResponse.json({ error: "Blob storage token not configured" }, { status: 500 })
    }
    
    // Determine upload path based on file type/name
    const uploadPath = file.name.includes('blog') || file.name.includes('cover') 
      ? `blog-images/${user.id}-${Date.now()}-${file.name}`
      : `logos/${user.id}-${Date.now()}-${file.name}`
    
    const blob = await put(uploadPath, file, {
      access: "public",
      token,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
