"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SEO } from "@/components/seo"

function VerifyEmailContent() {
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
          // Redirect to /employer after a short delay
          setTimeout(() => {
            router.push("/employer")
          }, 1200)
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
            <span className="text-green-600 dark:text-green-400">Redirecting to employer page...</span>
          )}
          {status === "error" && (
            <Button variant="outline" onClick={() => router.push("/")}>Go Home</Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <>
      <SEO 
        title="Verify Email - AlliedHealthJobs.au"
        description="Verify your email address to complete your account registration and access employer features."
        keywords={[
          'verify email',
          'email verification',
          'account verification',
          'employer registration',
          'allied health jobs registration'
        ]}
        url="/verify-email"
        type="website"
      />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
          <Card className="w-full max-w-md bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Email Verification
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Loading...
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </CardContent>
          </Card>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </>
  )
} 