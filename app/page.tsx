"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Main Content Section */}
      <div className="flex items-center justify-center px-4 py-12 md:py-20">
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

          <p className="text-base md:text-lg lg:text-xl text-center text-gray-600 dark:text-gray-300 mb-8 md:mb-12 max-w-3xl leading-relaxed w-full px-4">
            From entry-level positions to senior roles, we help professionals at every stage find their next opportunity.
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

      {/* Why Choose Us Section - UNDER the main content */}
      <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-900 dark:text-white">
          Why Choose AlliedHealthJobs.au?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Job Seekers Container - Left */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-zinc-800">
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                For Job Seekers
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Find your dream role in allied health
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-600 dark:text-violet-400 text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">Specialized Allied Health Focus</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Jobs specifically curated for physiotherapists, occupational therapists, speech pathologists, and other allied health professionals.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-600 dark:text-violet-400 text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">Advanced Search & Filters</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Find jobs by location, specialty, experience level, and work setting with our powerful search tools.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-600 dark:text-violet-400 text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">Career Resources & Guidance</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Access comprehensive career advice, resume tips, and industry insights to advance your career.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-600 dark:text-violet-400 text-sm font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">Direct Application Process</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Apply directly to employers with our streamlined application system and track your applications.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employers Container - Right */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-zinc-800">
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                For Employers
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Connect with top allied health talent
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-600 dark:text-violet-400 text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">Targeted Allied Health Audience</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Reach qualified professionals specifically in physiotherapy, occupational therapy, speech pathology, and related fields.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-600 dark:text-violet-400 text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">Easy Job Posting Process</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Simple, step-by-step job posting with templates and guidance to create compelling job listings.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-600 dark:text-violet-400 text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">Quality Candidate Applications</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Receive applications from qualified, pre-screened candidates who are actively seeking opportunities in allied health.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-600 dark:text-violet-400 text-sm font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">Affordable & Transparent Pricing</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Competitive pricing with no hidden fees. Pay only for successful job postings that reach your target audience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
