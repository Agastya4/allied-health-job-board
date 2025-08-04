import { notFound } from "next/navigation"
import { Metadata } from "next"
import BackButton from "@/components/BackButton"
import ApplyJobModalClient from "@/components/ApplyJobModalClient"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, DollarSign, Briefcase, GraduationCap, Mail, Phone, Building, Laptop, Clock, Globe, Calendar, Users, Award } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getOccupationName } from "@/lib/utils"

async function getJob(jobidslug: string) {
  const id = parseInt(jobidslug.split('-')[0], 10)
  if (isNaN(id)) return null
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/jobs/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  const data = await res.json()
  return data.job
}

export async function generateMetadata({ params }: { params: Promise<{ jobidslug: string }> }): Promise<Metadata> {
  const { jobidslug } = await params
  const job = await getJob(jobidslug)
  if (!job) {
    return {
      title: 'Page Not Found - AlliedHealthJobs.au',
      robots: { index: false, follow: true },
    }
  }
  
  const title = `${job.job_title} at ${job.company_name} | ${job.location_display}`
  const description = job.job_details?.slice(0, 160) || `Job opening for ${job.job_title} at ${job.company_name} in ${job.location_display}. Apply now for this allied health position.`
  const keywords = [
    job.job_title.toLowerCase(),
    job.company_name.toLowerCase(),
    job.location_display.toLowerCase(),
    'allied health jobs',
    'healthcare jobs',
    job.job_type?.toLowerCase(),
    job.experience_level?.toLowerCase()
  ].filter(Boolean)

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://alliedhealthjobs.au/jobs/${jobidslug}`,
      siteName: 'AlliedHealthJobs.au',
      images: [
        {
          url: job.company_logo_url || '/Logo.png',
          width: 1200,
          height: 630,
          alt: `${job.company_name} logo`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [job.company_logo_url || '/Logo.png'],
    },
    alternates: {
      canonical: `https://alliedhealthjobs.au/jobs/${jobidslug}`,
    },
  }
}

export default async function JobDetailPage({ params }: { params: Promise<{ jobidslug: string }> }) {
  const { jobidslug } = await params
  const job = await getJob(jobidslug)
  if (!job) return notFound()

  // Generate structured data for the job
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.job_title,
    "description": job.job_details,
    "datePosted": job.created_at,
    "validThrough": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    "employmentType": job.job_type,
    "experienceLevel": job.experience_level,
    "qualifications": job.job_details,
    "responsibilities": job.job_details,
    "salaryCurrency": "AUD",
    "salaryRange": job.salary_range,
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location_display,
        "addressCountry": "AU"
      }
    },
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company_name,
      "logo": job.company_logo_url || "https://alliedhealthjobs.au/Logo.png",
      "url": job.company_website || "https://alliedhealthjobs.au"
    },
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "Australia"
    }
  }

  // Format job details with better structure
  const formatJobDetails = (details: string) => {
    if (!details) return ''
    
    // Split by common section headers and format them
    const sections = details.split(/(?=^(?:Requirements|Responsibilities|Benefits|About Us|Qualifications|Skills|Duties|Overview|Description):)/im)
    
    return sections.map((section, index) => {
      const lines = section.trim().split('\n')
      const firstLine = lines[0]
      const isHeader = /^(?:Requirements|Responsibilities|Benefits|About Us|Qualifications|Skills|Duties|Overview|Description):/i.test(firstLine)
      
      if (isHeader && lines.length > 1) {
        const header = firstLine
        const content = lines.slice(1).join('\n')
        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {header.replace(':', '')}
            </h3>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {content.split('\n').map((line, lineIndex) => (
                <p key={lineIndex} className="mb-2">{line}</p>
              ))}
            </div>
          </div>
        )
      } else {
        return (
          <div key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {section.split('\n').map((line, lineIndex) => (
              <p key={lineIndex} className="mb-2">{line}</p>
            ))}
          </div>
        )
      }
    })
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <BackButton />
          
          <div className="mt-8">
            {/* Header Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 dark:border-zinc-700">
                    <Image
                      src={job.company_logo_url || "/placeholder.svg"}
                      alt={`${job.company_name} logo`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Job Title and Company Info */}
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {job.job_title}
                      </h1>
                      <div className="flex items-center gap-2 mb-4">
                        <Building className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{job.company_name}</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location_display}</span>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <ApplyJobModalClient job={job} fullWidth={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - 2/3 Left, 1/3 Right Layout */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Job Description - 2/3 width */}
              <div className="lg:w-2/3">
                {/* Job Details */}
                <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 h-fit">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                      Job Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-lg dark:prose-invert max-w-none break-words">
                      {formatJobDetails(job.job_details)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Three containers - 1/3 width */}
              <div className="lg:w-1/3 space-y-6">
                {/* Top Right Block - Medium Height */}
                <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Job Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {job.salary_range && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Salary</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{job.salary_range}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                        <Briefcase className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Job Type</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{job.job_type}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Experience Level</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{job.experience_level}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Middle Right Block - Taller */}
                <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Additional Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {job.work_setting && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                          <Building className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Work Setting</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{job.work_setting}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                        <Award className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Category</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getOccupationName(job.job_categories)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                        <Calendar className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Posted</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(job.created_at).toLocaleDateString('en-AU', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bottom Right Block - Small */}
                <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                  <CardContent className="p-6">
                    <ApplyJobModalClient job={job} fullWidth={true} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 