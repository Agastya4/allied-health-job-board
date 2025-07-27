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

export async function generateMetadata({ params }: { params: { jobidslug: string } }): Promise<Metadata> {
  const job = await getJob(params.jobidslug)
  if (!job) return {}
  return {
    title: `${job.job_title} at ${job.company_name} | ${job.location_display}`,
    description: job.job_details?.slice(0, 160) || `Job opening for ${job.job_title} at ${job.company_name} in ${job.location_display}`,
    openGraph: {
      title: `${job.job_title} at ${job.company_name}`,
      description: job.job_details?.slice(0, 160),
    },
  }
}

export default async function JobDetailPage({ params }: { params: { jobidslug: string } }) {
  const job = await getJob(params.jobidslug)
  if (!job) return notFound()
  // Remove requirements extraction logic
  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <BackButton />
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Main text and headings */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold mb-2">{job.job_title}</h1>
          <div className="text-lg text-gray-700 dark:text-gray-300 mb-2">{job.company_name}</div>
          <div className="prose prose-lg dark:prose-invert whitespace-pre-line">{job.job_details}</div>
          {/* Remove practice location from here */}
        </div>
        {/* Right: Key details */}
        <aside className="w-full md:w-80 flex-shrink-0 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-6 flex flex-col items-center">
            <img src={job.company_logo_url || "/placeholder.svg"} alt="{job.company_name} logo" className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-zinc-700 mb-4" />
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
  )
} 