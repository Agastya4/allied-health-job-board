"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Briefcase, DollarSign, TrendingUp, Users, Award, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { JobCard } from "@/components/job-card"
import { JobCardWrapper } from "@/components/job-card-wrapper"
import { SEO } from "@/components/seo"
import { useJobs } from "@/hooks/use-jobs"
import { InternalLinks } from "@/components/internal-links"

export default function LandingPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  
  const { jobs, loading } = useJobs({ 
    search: debouncedSearch || undefined 
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(search.trim())}`)
    }
  }

  const latestJobs = jobs.slice(0, 6)

  return (
    <>
      <SEO
        title="Allied Health Jobs Australia - Find Healthcare Careers"
        description="Discover allied health jobs across Australia. Browse physiotherapy, occupational therapy, speech pathology, and other healthcare positions. Apply to top employers today."
        keywords={[
          'allied health jobs',
          'healthcare jobs australia',
          'physiotherapy jobs',
          'occupational therapy jobs',
          'speech pathology jobs',
          'healthcare careers',
          'medical jobs',
          'rehabilitation jobs'
        ]}
        url="/"
        type="website"
      />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-violet-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-violet-200 dark:bg-violet-800 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse delay-2000"></div>
        
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Find Your Perfect
            <span className="text-violet-600 dark:text-violet-400 block">Healthcare Match</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover allied health opportunities across Australia. From physiotherapy to speech pathology, 
            find your next career move with top healthcare employers.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search jobs, locations, or specialties..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-12 text-lg bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
                />
              </div>
              <Button 
                type="submit" 
                className="h-12 px-8 bg-violet-600 hover:bg-violet-700 text-white"
              >
                Search Jobs
              </Button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{jobs.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Employers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">8</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">States</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Jobs Section */}
      <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-10 bg-transparent">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Opportunities
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse the most recent job postings from top healthcare employers
          </p>
        </div>

        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-zinc-800">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading latest jobs...</p>
            </div>
          ) : latestJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                No jobs found. Try adjusting your search criteria.
              </p>
              <Button 
                onClick={() => router.push('/jobs')} 
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Browse All Jobs
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 md:gap-4">
              {latestJobs.map(job => (
                <JobCardWrapper
                  key={job.id}
                  job={{
                    ...job,
                    is_new: false,
                    company_logo_url: job.company_logo_url || "",
                    salary_range: job.salary_range ?? null,
                    posted_ago: job.posted_ago ?? null,
                    is_bookmarked: job.is_bookmarked ?? false,
                  }}
                />
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

      {/* Internal Links Section */}
      <InternalLinks />
    </>
  )
}

