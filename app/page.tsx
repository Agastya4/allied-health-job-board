"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { JobCard } from "@/components/job-card"
import { JobCardWrapper } from "@/components/job-card-wrapper"
import { SEO } from "@/components/seo"
import { Typewriter } from "@/components/typewriter"
import { InternalLinks } from "@/components/internal-links"
import { GradientTextAnimation } from "@/components/gradient-text-animation"
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
        description="Find the Best Allied Health Jobs in Australia. Browse Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions. Post Jobs and Connect with Qualified Professionals."
        keywords={[
          'Allied Health Jobs Australia',
          'Physiotherapy Jobs Australia',
          'Occupational Therapy Jobs Australia',
          'Speech Pathology Jobs Australia',
          'Healthcare Jobs Australia',
          'Allied Health Careers',
          'Healthcare Recruitment',
          'Medical Jobs Australia'
        ]}
        url="/"
        type="website"
      />
      <div className="min-h-screen w-full relative">
        {/* Main Content Section */}
        <div className="flex items-center justify-center px-4 py-12 md:py-20">
          <div className="w-full flex flex-col items-center justify-center max-w-4xl mx-auto">
            <div className="mb-6 md:mb-8 w-full flex justify-center">
              <Link href="/resources">
                <Button variant="outline" className="rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium shadow-sm border-green-300 dark:border-green-600 bg-white dark:bg-zinc-900 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-400 dark:hover:border-green-500 transition-all duration-300 ease-in-out transform hover:scale-105">
                  Resources & Guides
                </Button>
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-center mb-4 md:mb-6 tracking-tight w-full">
              Find Your Perfect<br />
              <GradientTextAnimation>
                Healthcare Match
              </GradientTextAnimation>
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
                <Button className="w-full py-3 md:py-4 text-base md:text-lg font-semibold bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                  Find Jobs
                </Button>
              </Link>
              <Link href="/post-job" className="flex-1 w-full">
                <Button variant="outline" className="w-full py-3 md:py-4 text-base md:text-lg font-semibold border-2 border-green-600 dark:border-green-400 bg-transparent text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-400 dark:hover:text-white rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
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
              className="w-full rounded-lg border-2 border-green-200 dark:border-green-700 bg-white dark:bg-zinc-900 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
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
              <div className="grid gap-2 md:gap-3">
                {latestJobs.map(job => (
                  <div key={job.id} onClick={() => router.push(`/jobs/${job.id}-${(job.job_title + '-' + (job.location_display || '')).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)} className="cursor-pointer">
                    <JobCardWrapper
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* For Job Seekers */}
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-zinc-800">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">For Job Seekers</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Find your dream role in allied health</p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Specialised Focus in Allied Health</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Jobs specifically curated for physiotherapists, occupational therapists, speech pathologists, and other allied health professionals.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Advanced Search and Filters</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Find jobs by location, specialty, experience level, and work setting with powerful search tools.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Career Resources and Guidance</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Access comprehensive career advice, resume tips, and industry insights to advance your career.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Simplified Application Process</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Apply directly to employers with a streamlined application system and track applications.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">5</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Locum, Temp-Casual & Permanent Jobs</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Find flexible work arrangements including locum, temporary, casual, and permanent positions.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">6</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Nationwide Coverage</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Access job opportunities across all Australian states and territories.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* For Employers */}
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-zinc-800">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">For Employers</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Connect with top allied health talent</p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Highly Targeted Audience</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Attracting qualified allied health professionals only - physiotherapists, occupational therapists, speech pathologists, and related fields.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">National Reach Across Australia</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Connect with candidates from all states and territories across Australia.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Ideal for Urgent & Hard-to-Fill Roles</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Perfect for finding qualified candidates quickly for specialized positions and urgent hiring needs.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">You Pay Less ($50), But Your Ad is Seen by More of the Right People</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Affordable pricing with maximum exposure to your target audience of allied health professionals.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">5</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Professional Ad Format with Logo & Contact Details</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Ads appear in a clean, professional format with options to include logo, organisation info, and contact details.</p>
                  </div>
                </div>
              </div>
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
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Specialization</td>
                  <td className="py-3 px-4 text-center text-green-600 dark:text-green-400">✓ Allied Health Focus</td>
                  <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">General healthcare or all industries</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-zinc-800">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Job Posting Cost</td>
                  <td className="py-3 px-4 text-center text-green-600 dark:text-green-400">$50</td>
                  <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">$100-300+</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-zinc-800">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Target Audience</td>
                  <td className="py-3 px-4 text-center text-green-600 dark:text-green-400">Qualified Allied Health Professionals</td>
                  <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">Mixed audience, less targeted</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-zinc-800">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Application Quality</td>
                  <td className="py-3 px-4 text-center text-green-600 dark:text-green-400">High - Pre-screened Candidates</td>
                  <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">Variable quality</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-zinc-800">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Ad Format</td>
                  <td className="py-3 px-4 text-center text-green-600 dark:text-green-400">Professional with Logo & Details</td>
                  <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">Basic format</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-zinc-800">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Career Resources</td>
                  <td className="py-3 px-4 text-center text-green-600 dark:text-green-400">Comprehensive Blog & Guides</td>
                  <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">Limited resources</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Job Types</td>
                  <td className="py-3 px-4 text-center text-green-600 dark:text-green-400">Locum, Temp, Casual, Permanent</td>
                  <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">Limited options</td>
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

