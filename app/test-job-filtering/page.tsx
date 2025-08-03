"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useJobs } from "@/hooks/use-jobs"
import { getJobsForCategoryPage } from "@/lib/job-sorter"

export default function TestJobFilteringPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { jobs } = useJobs()

  const testJobFiltering = async () => {
    setLoading(true)
    try {
      // Convert jobs to the correct type for the job sorter
      const jobsWithCorrectType = jobs.map(job => ({
        ...job,
        created_at: new Date(job.created_at),
        updated_at: new Date(job.updated_at)
      }))
      
      // Test speech pathology filtering
      const speechPathologyJobs = getJobsForCategoryPage(jobsWithCorrectType, "speech-pathology")
      
      // Get debug info from API
      const response = await fetch("/api/debug-jobs")
      const debugData = await response.json()
      
      setDebugInfo({
        totalJobs: jobs.length,
        speechPathologyJobs: speechPathologyJobs.length,
        allJobs: debugData.jobs,
        filteredJobs: speechPathologyJobs.map(job => ({
          id: job.id,
          title: job.job_title,
          categories: job.job_categories,
          location: job.practice_location,
          city: job.city,
          state: job.state
        }))
      })
    } catch (error) {
      console.error("Test failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Filtering Test</CardTitle>
            <CardDescription>
              Test the job filtering for speech pathology jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testJobFiltering} disabled={loading}>
              {loading ? "Testing..." : "Test Job Filtering"}
            </Button>
          </CardContent>
        </Card>

        {debugInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Debug Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Summary</h3>
                <p>Total jobs: {debugInfo.totalJobs}</p>
                <p>Speech pathology jobs found: {debugInfo.speechPathologyJobs}</p>
              </div>

              <div>
                <h3 className="font-semibold">All Jobs</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {debugInfo.allJobs.map((job: any) => (
                    <div key={job.id} className="p-2 border rounded text-sm">
                      <div><strong>ID:</strong> {job.id}</div>
                      <div><strong>Title:</strong> {job.job_title}</div>
                      <div><strong>Categories:</strong> {JSON.stringify(job.job_categories)}</div>
                      <div><strong>Location:</strong> {job.practice_location}</div>
                      <div><strong>City:</strong> {job.city}</div>
                      <div><strong>State:</strong> {job.state}</div>
                      <div><strong>Status:</strong> {job.status}</div>
                      <div><strong>Payment Status:</strong> {job.payment_status}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Filtered Speech Pathology Jobs</h3>
                <div className="space-y-2">
                  {debugInfo.filteredJobs.map((job: any) => (
                    <div key={job.id} className="p-2 border rounded text-sm bg-green-50">
                      <div><strong>ID:</strong> {job.id}</div>
                      <div><strong>Title:</strong> {job.title}</div>
                      <div><strong>Categories:</strong> {JSON.stringify(job.categories)}</div>
                      <div><strong>Location:</strong> {job.location}</div>
                      <div><strong>City:</strong> {job.city}</div>
                      <div><strong>State:</strong> {job.state}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 