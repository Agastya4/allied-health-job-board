"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { JobPostingForm } from "@/components/job-posting-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SEO } from "@/components/seo"

export default function PostJobPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/sign-in")
      return
    }
    setShowForm(true)
  }, [user, router])

  if (!user) {
    return (
      <>
        <SEO 
          title="Post a Job - AlliedHealthJobs.au"
          description="Post your allied health job listing on AlliedHealthJobs.au. Reach qualified healthcare professionals across Australia."
          keywords={[
            'post job',
            'job posting',
            'hire allied health',
            'healthcare recruitment',
            'allied health jobs posting'
          ]}
          url="/post-job"
          type="website"
        />
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Redirecting to sign in...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO 
        title="Post a Job - AlliedHealthJobs.au"
        description="Post your allied health job listing on AlliedHealthJobs.au. Reach qualified healthcare professionals across Australia."
        keywords={[
          'post job',
          'job posting',
          'hire allied health',
          'healthcare recruitment',
          'allied health jobs posting'
        ]}
        url="/post-job"
        type="website"
      />
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/employer">
              <Button variant="ghost" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Back to Employer Dashboard
              </Button>
            </Link>
          </div>
          
          {showForm && <JobPostingForm onClose={() => router.push("/employer")} />}
        </div>
      </div>
    </>
  )
} 