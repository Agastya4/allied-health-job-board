"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Missing verification token.")
      return
    }
    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json()
        if (data.success) {
          setStatus("success")
          setMessage(data.message || "Email verified successfully.")
        } else {
          setStatus("error")
          setMessage(data.error || "Verification failed.")
        }
      })
      .catch(() => {
        setStatus("error")
        setMessage("Verification failed. Please try again later.")
      })
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Card className="w-full max-w-md bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Email Verification
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {status === "pending" && "Verifying your email..."}
            {status !== "pending" && message}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {status === "success" && (
            <Button className="bg-violet-600 hover:bg-violet-700 text-white" onClick={() => router.push("/sign-in")}>Sign In</Button>
          )}
          {status === "error" && (
            <Button variant="outline" onClick={() => router.push("/")}>Go Home</Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 