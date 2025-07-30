import { notFound } from "next/navigation"
import { Metadata } from "next"
import BackButton from "@/components/BackButton"
import ApplyJobModalClient from "@/components/ApplyJobModalClient"

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
  if (!job) return {}
  
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="max-w-6xl mx-auto py-12 px-4">
        <BackButton />
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Main text and headings */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold mb-2">{job.job_title}</h1>
            <div className="text-lg text-gray-700 dark:text-gray-300 mb-2">{job.company_name}</div>
            <div className="prose prose-lg dark:prose-invert whitespace-pre-line">{job.job_details}</div>
          </div>
          {/* Right: Key details */}
          <aside className="w-full md:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-6 flex flex-col items-center">
              <img src={job.company_logo_url || "/placeholder.svg"} alt={`${job.company_name} logo`} className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-zinc-700 mb-4" />
              <div className="text-gray-900 dark:text-white font-semibold text-lg mb-2">{job.company_name}</div>
              <div className="text-gray-500 text-sm mb-2">{job.location_display}</div>
              <div className="flex flex-col gap-2 w-full text-sm">
                <div><span className="font-medium">Type:</span> {job.job_type}</div>
                <div><span className="font-medium">Level:</span> {job.experience_level}</div>
                {job.salary_range && <div><span className="font-medium">Salary:</span> {job.salary_range}</div>}
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <div className="flex flex-col gap-2 text-sm">
                <div><span className="font-medium">Email:</span> {job.contact_email}</div>
                <div><span className="font-medium">Phone:</span> {job.contact_phone}</div>
                {job.company_website && <div><span className="font-medium">Website:</span> <a href={job.company_website} className="text-violet-700 hover:underline" target="_blank" rel="noopener noreferrer">{job.company_website}</a></div>}
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Practice Location</h3>
              <div className="text-gray-700 dark:text-gray-300">{job.practice_location}</div>
            </div>
            <ApplyJobModalClient job={job} fullWidth={true} />
          </aside>
        </div>
      </main>
    </>
  )
} 