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
import { getOldestBlogPosts } from "@/lib/blog-data"

export default function LandingPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  
  // Use the search parameter in the useJobs hook
  const { jobs, loading } = useJobs({ 
    search: debouncedSearch || undefined 
  })

  // Get oldest blog posts
  const oldestBlogPosts = getOldestBlogPosts(3)

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
        {/* Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 via-transparent to-transparent dark:from-zinc-800 dark:via-transparent dark:to-transparent">
          <div className="absolute inset-0 opacity-50">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(156, 163, 175, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(156, 163, 175, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
            }}></div>
          </div>
        </div>
        
        {/* Main Content Section */}
        <div className="flex items-center justify-center px-4 py-12 md:py-20 relative z-20">
          <div className="w-full flex flex-col items-center justify-center max-w-4xl mx-auto">
            <div className="mb-6 md:mb-8 w-full flex justify-center">
              <Link href="/blog">
                <Button variant="outline" className="rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium shadow-sm border-green-300 dark:border-green-600 bg-white dark:bg-zinc-900 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-400 dark:hover:border-green-500 transition-all duration-300 ease-in-out transform hover:scale-105">
                  Blog
                </Button>
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-center mb-4 md:mb-6 tracking-tight w-full relative z-10">
              Find Your Perfect<br />
              <GradientTextAnimation>
                Healthcare Match
              </GradientTextAnimation>
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl text-center text-gray-600 dark:text-gray-300 mb-8 md:mb-12 max-w-3xl leading-relaxed w-full px-4 min-h-[1.5em] relative z-10">
              <Typewriter 
                text="From entry-level positions to senior roles, we help professionals at every stage find their next opportunity."
                speed={30}
                delay={500}
                className="text-base md:text-lg lg:text-xl text-center text-gray-600 dark:text-gray-300"
              />
            </p>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-lg justify-center items-center px-4 relative z-10">
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
         <div className="w-full max-w-6xl mx-auto px-4 pb-8 relative z-10">
          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for any job, company, location, or keyword... (e.g., physiotherapy blacktown)"
              className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
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

        {/* Job Seeker Categories Section */}
        <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-10 bg-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side Content */}
            <div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                We help you <span className="underline decoration-blue-400 decoration-2 underline-offset-4">find the right job</span>
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                We believe that you deserve a job search experience that is human and personal. We go beyond simple keyword searches.
              </p>
              <Link href="/jobs" className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-lg group">
                Ready to build your Joblist?
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            
            {/* Right Side - Job Seeker Categories Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 - Unemployed */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-700 p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                  <div className="text-2xl">🔍</div>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">Unemployed</p>
              </div>
              
              {/* Card 2 - Recent Grad */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-700 p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                  <div className="text-2xl">🎓</div>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">Recent Grad</p>
              </div>
              
              {/* Card 3 - Open to Remote */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-700 p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                  <div className="text-2xl">🌐</div>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">Open to Remote</p>
              </div>
              
              {/* Card 4 - Something Else */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-700 p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                  <div className="text-2xl">🧩</div>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">Something Else</p>
              </div>
            </div>
          </div>
        </div>

        {/* Joblist Building Process Section */}
        <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-10 bg-transparent">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Start building your <span className="underline decoration-yellow-400 decoration-2 underline-offset-4">Joblist</span> today
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Smartphone Mockup */}
            <div className="flex justify-center">
              <div className="w-80 h-[28rem] bg-white dark:bg-zinc-900 rounded-3xl border-4 border-gray-200 dark:border-zinc-700 p-4 shadow-xl">
                <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 rounded-2xl flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Joblist</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center">Smartphone Mockup Placeholder</div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Three Step Process */}
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-700 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Form</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">Mockup</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-orange-500 font-semibold text-sm mb-1">STEP 1</div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Answer Questions</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Answer a few questions about your situation and job preferences.</p>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-700 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">List</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">Mockup</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-orange-500 font-semibold text-sm mb-1">STEP 2</div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Get Matches</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Browse personalized results based on our analysis of millions of jobs.</p>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-700 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Save</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">Mockup</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-orange-500 font-semibold text-sm mb-1">STEP 3</div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Save Favorites</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Save jobs to your personalized list and apply when you're ready.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image Section - Replace "For Job Seekers and Employers" */}
        <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-10 bg-transparent">
          <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-zinc-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side Content */}
              <div>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Shareable
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  Access your joblist from anywhere and share it (if you want to). We can give you a public URL that you can share directly with friends and family.
                </p>
                <Link href="/jobs" className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold text-lg group">
                  Ready to build your Joblist?
                  <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
              
              {/* Right Side Visual (Share Modal Preview) */}
              <div className="flex justify-center">
                <div className="w-80 h-64 bg-gray-200 dark:bg-zinc-700 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-gray-500 dark:text-gray-400">Share Modal Placeholder</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Replace with your inspiration image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Section - Replace "What Makes AlliedHealthJobs.au Different" */}
        <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-10 bg-transparent">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Learn more on the <span className="underline decoration-2 underline-offset-4">Joblist Blog</span>
            </h3>
          </div>
          
          {/* Three Blog Post Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {oldestBlogPosts.map((post, index) => (
              <div key={index} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden hover:shadow-xl transition-shadow">
                <Link href={`/blog/${post.slug}`}>
                  <div className="h-48 bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link href={`/blog/${post.slug}`} className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium text-sm inline-flex items-center group">
                      Read more 
                      <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* View All Articles Button */}
          <div className="text-center">
            <Link href="/blog">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-2xl font-semibold text-lg transition-colors">
                View All Articles 
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>

        {/* Internal Links Section - Moved to bottom */}
        <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20 pb-20 md:pb-20 relative z-10 bg-transparent">
          <InternalLinks 
            showLocationLinks={false}
            showCategoryLinks={false}
            showBlogLinks={false}
          />
        </div>
      </div>
    </>
  )
}

