"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function TestLocationsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const updateJobLocations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/jobs/update-locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Test Location Filtering</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Update Existing Jobs</h2>
          <p className="text-gray-600 mb-4">
            This will update existing jobs to ensure they have proper city and state fields for location filtering.
          </p>
          <Button 
            onClick={updateJobLocations} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Update Job Locations"}
          </Button>
        </div>

        {result && (
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Results:</h3>
            <pre className="text-sm overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-4">Test Location Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/locations/nsw/physiotherapy" 
              className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <h3 className="font-semibold">NSW Physiotherapy Jobs</h3>
              <p className="text-sm text-gray-600">Test state + category filtering</p>
            </a>
            <a 
              href="/locations/nsw/sydney/physiotherapy" 
              className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <h3 className="font-semibold">Sydney Physiotherapy Jobs</h3>
              <p className="text-sm text-gray-600">Test city + state + category filtering</p>
            </a>
            <a 
              href="/locations/vic/melbourne/psychology" 
              className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <h3 className="font-semibold">Melbourne Psychology Jobs</h3>
              <p className="text-sm text-gray-600">Test different location and category</p>
            </a>
            <a 
              href="/locations/qld/occupational-therapy" 
              className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <h3 className="font-semibold">QLD Occupational Therapy Jobs</h3>
              <p className="text-sm text-gray-600">Test state + different category</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 