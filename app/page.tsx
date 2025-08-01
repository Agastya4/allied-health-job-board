"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { JobCard } from "@/components/job-card"
import { SEO } from "@/components/seo"
import { Typewriter } from "@/components/typewriter"
import { InternalLinks } from "@/components/internal-links"
import Link from "next/link"
import { useJobs } from "@/hooks/use-jobs"

export default function LandingPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  
  // Use the search parameter in the useJobs hook
  const { jobs, loading } = useJobs({ 
    search: debouncedSearch || undefined 
  })

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [search])

  // Get latest jobs (first 15, sorted by date)
  const latestJobs = jobs.slice(0, 15)

  return (
    <>
      <SEO
        title="AlliedHealthJobs.au - Find Allied Health Jobs in Australia"
        description="Find the best allied health jobs in Australia. Browse physiotherapy, occupational therapy, speech pathology, and other healthcare positions. Post jobs and connect with qualified professionals."
        keywords={[
          'allied health jobs Australia',
          'physiotherapy jobs Australia',
          'occupational therapy jobs Australia',
          'speech pathology jobs Australia',
          'healthcare jobs Australia',
          'allied health careers',
          'healthcare recruitment',
          'medical jobs Australia'
        ]}
        url="/"
        type="website"
      />
      <div className="min-h-screen w-full relative">
        {/* Main Content Section */}
        <div className="flex items-center justify-center px-4 py-12 md:py-20 relative z-10">
          <div className="w-full flex flex-col items-center justify-center max-w-4xl mx-auto">
            <div className="mb-6 md:mb-8 w-full flex justify-center">
              <Link href="/resources">
                <Button variant="outline" className="rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium shadow-sm border-violet-300 dark:border-violet-600 bg-white dark:bg-zinc-900 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:border-violet-400 dark:hover:border-violet-500 transition-all duration-300 ease-in-out transform hover:scale-105">
                  Resources & Guides
                </Button>
              </Link>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-center mb-4 md:mb-6 tracking-tight w-full">
              Find Your Perfect<br />
              <span className="text-violet-600 dark:text-violet-400">Healthcare Match</span>
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-center text-gray-600 dark:text-gray-300 mb-8 md:mb-12 max-w-3xl leading-relaxed w-full px-4 min-h-[1.5em]">
              <Typewriter 
                text="From entry-level positions to senior roles, we help professionals at every stage find their next opportunity."
                speed={30}
                delay={500}
                className="text-base md:text-lg lg:text-xl text-center text-gray-600 dark:text-gray-300"
              />
            </p>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-lg justify-center items-center px-4">
              <Link href="/jobs" className="flex-1 w-full">
                <Button className="w-full py-3 md:py-4 text-base md:text-lg font-semibold bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                  Find Jobs
                </Button>
              </Link>
              <Link href="/post-job" className="flex-1 w-full">
                <Button variant="outline" className="w-full py-3 md:py-4 text-base md:text-lg font-semibold border-2 border-violet-600 dark:border-violet-400 bg-transparent text-violet-600 dark:text-violet-400 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-400 dark:hover:text-white rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                  Post a Job
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Master Search and Latest Jobs Section */}
        <div className="w-full max-w-4xl mx-auto px-4 pb-8 relative z-10">
          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for any job, company, location, or keyword... (e.g., physiotherapy blacktown)"
              className="w-full rounded-lg border-2 border-violet-200 dark:border-violet-700 bg-white dark:bg-zinc-900 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {debouncedSearch ? `Search Results for "${debouncedSearch}"` : "Latest Jobs"}
            </h2>
            {loading ? (
              <div className="text-gray-600 dark:text-gray-400 py-8 text-center">Loading jobs...</div>
            ) : latestJobs.length === 0 ? (
              <div className="text-gray-600 dark:text-gray-400 py-8 text-center">
                {debouncedSearch ? `No jobs found matching "${debouncedSearch}"` : "No jobs found."}
              </div>
            ) : (
              <div className="grid gap-3 md:gap-4">
                {latestJobs.map(job => (
                  <div key={job.id} onClick={() => router.push(`/jobs/${job.id}-${(job.job_title + '-' + (job.location_display || '')).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)} className="cursor-pointer">
                    <JobCard
                      job={{
                        ...job,
                        is_new: false,
                        company_logo_url: job.company_logo_url || "",
                        salary_range: job.salary_range ?? null,
                        posted_ago: job.posted_ago ?? null,
                        is_bookmarked: job.is_bookmarked ?? false,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-10 bg-transparent">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Why Choose AlliedHealthJobs.au?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-zinc-800">
              <div className="text-violet-600 dark:text-violet-400 text-3xl mb-4">🎯</div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Specialized Focus</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Dedicated exclusively to allied health professionals, ensuring relevant opportunities and industry-specific expertise.
              </p>
            </div>
            
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-zinc-800">
              <div className="text-violet-600 dark:text-violet-400 text-3xl mb-4">🚀</div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Advanced Search</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Powerful search capabilities to find jobs by location, specialty, experience level, and more with instant results.
              </p>
            </div>
            
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-zinc-800">
              <div className="text-violet-600 dark:text-violet-400 text-3xl mb-4">💼</div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quality Employers</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with reputable healthcare organizations and private practices across Australia.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table Section */}
        <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20 pb-20 md:pb-20 relative z-10 bg-transparent">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Why Choose AlliedHealthJobs.au Over Other Job Boards?
          </h3>
          
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-zinc-800 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-zinc-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">AlliedHealthJobs.au</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-500 dark:text-gray-400">Other Job Boards</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-zinc-800">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Specialized Focus</td>
                  <td className="py-3 px-4 text-center text-green-600 dark:text-green-400">✅ Allied Health Only</td>
                  <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">❌ General Jobs</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-zinc-800">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Advanced Search</td>
                  <td className="py-3 px-4 text-center text-green-600 dark:text-green-400">✅ Multi-field Search</td>
                  <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">❌ Basic Filters</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-zinc-800">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Location Matching</td>
                  <td className="py-3 px-4 text-center text-green-600 dark:text-green-400">✅ Smart Auto-sorting</td>
                  <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">❌ Manual Categorization</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-zinc-800">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Industry Expertise</td>
                  <td className="py-3 px-4 text-center text-green-600 dark:text-green-400">✅ Healthcare Specialists</td>
                  <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">❌ General Recruiters</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Job Quality</td>
                  <td className="py-3 px-4 text-center text-green-600 dark:text-green-400">✅ Verified Employers</td>
                  <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">❌ Mixed Quality</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Internal Links Section - Moved to bottom */}
        <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20 pb-20 md:pb-20 relative z-10 bg-transparent">
          <InternalLinks />
        </div>
      </div>
    </>
  )
}

