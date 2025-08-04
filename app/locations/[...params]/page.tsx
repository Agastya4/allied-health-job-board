import { JobCard } from "@/components/job-card"
import { SEO } from "@/components/seo"
import { getJobsForLocationPage } from "@/lib/job-sorter"
import { STATES, CITIES, JOB_CATEGORIES } from "../seo-links"
import { getJobs } from "@/lib/database"
import { JobCardWrapper } from "@/components/job-card-wrapper"
import { Metadata } from "next"
import { notFound } from "next/navigation"

interface LocationPageProps {
  params: Promise<{
    params: string[]
  }>
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const segments = resolvedParams.params
  const state = segments[0] || ""
  const city = segments[1] || ""
  const category = segments[2] || ""
  
  // Validate parameters
  const stateInfo = STATES.find(s => s.abbr.toLowerCase() === state)
  if (!stateInfo) {
    return {
      title: 'Page Not Found - AlliedHealthJobs.au',
      robots: { index: false, follow: true },
    }
  }
  
  const cityInfo = city ? CITIES[stateInfo?.abbr as keyof typeof CITIES]?.find(c => 
    c.toLowerCase().replace(/\s+/g, '-') === city
  ) : null
  
  if (city && !cityInfo) {
    return {
      title: 'Page Not Found - AlliedHealthJobs.au',
      robots: { index: false, follow: true },
    }
  }
  
  const categoryInfo = category ? JOB_CATEGORIES.find(c => c.value === category) : null
  
  if (category && !categoryInfo) {
    return {
      title: 'Page Not Found - AlliedHealthJobs.au',
      robots: { index: false, follow: true },
    }
  }
  
  // Get all jobs from database
  const jobs = await getJobs({})
  
  // Filter jobs for this location/category
  let filteredJobs: any[] = []
  
  if (category) {
    // Category-specific location page
    filteredJobs = getJobsForLocationPage(jobs, state, city, category)
  } else if (city) {
    // City-specific page
    filteredJobs = getJobsForLocationPage(jobs, state, city)
  } else {
    // State-specific page
    filteredJobs = getJobsForLocationPage(jobs, state)
  }
  
  // Generate page title and description
  let title = ""
  let description = ""
  
  if (category && city) {
    title = `${categoryInfo?.label} Jobs in ${cityInfo}, ${stateInfo?.abbr}`
    description = `Find ${categoryInfo?.label.toLowerCase()} Jobs in ${cityInfo}, ${stateInfo?.name}. Browse the Latest Opportunities and Apply Today.`
  } else if (category) {
    title = `${categoryInfo?.label} Jobs in ${stateInfo?.name}`
    description = `Find ${categoryInfo?.label.toLowerCase()} Jobs in ${stateInfo?.name}. Browse the Latest Opportunities and Apply Today.`
  } else if (city) {
    title = `Allied Health Jobs in ${cityInfo}, ${stateInfo?.abbr}`
    description = `Find Allied Health Jobs in ${cityInfo}, ${stateInfo?.name}. Browse Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions.`
  } else {
    title = `Allied Health Jobs in ${stateInfo?.name}`
    description = `Find Allied Health Jobs in ${stateInfo?.name}. Browse Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions.`
  }

  return {
    title,
    description,
    keywords: [
      'Allied Health Jobs',
      'Healthcare Jobs',
      'Physiotherapy Jobs',
      'Occupational Therapy Jobs',
      'Speech Pathology Jobs',
      'Healthcare Careers',
      state,
      city || '',
      category || ''
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://alliedhealthjobs.au/locations/${state}${city ? `/${city}` : ''}${category ? `/${category}` : ''}`,
      siteName: 'AlliedHealthJobs.au',
      images: [
        {
          url: '/Logo.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_AU',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/Logo.png'],
      creator: '@alliedhealthjobs',
    },
    alternates: {
      canonical: `https://alliedhealthjobs.au/locations/${state}${city ? `/${city}` : ''}${category ? `/${category}` : ''}`,
    },
  }
}

export default async function LocationPage({ params }: LocationPageProps) {
  // Parse URL parameters
  const resolvedParams = await params
  const segments = resolvedParams.params
  const state = segments[0] || ""
  const city = segments[1] || ""
  const category = segments[2] || ""
  
  // Validate parameters and return 404 for invalid combinations
  const stateInfo = STATES.find(s => s.abbr.toLowerCase() === state)
  if (!stateInfo) {
    notFound()
  }
  
  const cityInfo = city ? CITIES[stateInfo?.abbr as keyof typeof CITIES]?.find(c => 
    c.toLowerCase().replace(/\s+/g, '-') === city
  ) : null
  
  if (city && !cityInfo) {
    notFound()
  }
  
  const categoryInfo = category ? JOB_CATEGORIES.find(c => c.value === category) : null
  
  if (category && !categoryInfo) {
    notFound()
  }
  
  // Get all jobs from database
  const jobs = await getJobs({})
  
  // Filter jobs for this location/category
  let filteredJobs: any[] = []
  
  if (category) {
    // Category-specific location page
    filteredJobs = getJobsForLocationPage(jobs, state, city, category)
  } else if (city) {
    // City-specific page
    filteredJobs = getJobsForLocationPage(jobs, state, city)
  } else {
    // State-specific page
    filteredJobs = getJobsForLocationPage(jobs, state)
  }
  
  // Generate page title and description
  let title = ""
  let description = ""
  
  if (category && city) {
    title = `${categoryInfo?.label} Jobs in ${cityInfo}, ${stateInfo?.abbr}`
    description = `Find ${categoryInfo?.label.toLowerCase()} Jobs in ${cityInfo}, ${stateInfo?.name}. Browse the Latest Opportunities and Apply Today.`
  } else if (category) {
    title = `${categoryInfo?.label} Jobs in ${stateInfo?.name}`
    description = `Find ${categoryInfo?.label.toLowerCase()} Jobs in ${stateInfo?.name}. Browse the Latest Opportunities and Apply Today.`
  } else if (city) {
    title = `Allied Health Jobs in ${cityInfo}, ${stateInfo?.abbr}`
    description = `Find Allied Health Jobs in ${cityInfo}, ${stateInfo?.name}. Browse Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions.`
  } else {
    title = `Allied Health Jobs in ${stateInfo?.name}`
    description = `Find Allied Health Jobs in ${stateInfo?.name}. Browse Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions.`
  }
  
  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={[
          'Allied Health Jobs',
          'Healthcare Jobs',
          'Physiotherapy Jobs',
          'Occupational Therapy Jobs',
          'Speech Pathology Jobs',
          'Healthcare Careers',
          state,
          city || '',
          category || ''
        ].filter(Boolean)}
        url={`/locations/${state}${city ? `/${city}` : ''}${category ? `/${category}` : ''}`}
        type="website"
      />
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>
        
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-zinc-800 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                No Jobs Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                Currently no jobs available for this location and category.
              </p>
              <div className="space-y-4">
                <p className="text-gray-500 dark:text-gray-500">
                  Try browsing:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Other Locations</h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li><a href="/locations/nsw/sydney" className="hover:text-green-600 dark:hover:text-green-400">Sydney Jobs</a></li>
                      <li><a href="/locations/vic/melbourne" className="hover:text-green-600 dark:hover:text-green-400">Melbourne Jobs</a></li>
                      <li><a href="/locations/qld/brisbane" className="hover:text-green-600 dark:hover:text-green-400">Brisbane Jobs</a></li>
                      <li><a href="/locations/wa/perth" className="hover:text-green-600 dark:hover:text-green-400">Perth Jobs</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Job Categories</h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li><a href="/jobs/occupation/physiotherapy" className="hover:text-green-600 dark:hover:text-green-400">Physiotherapy Jobs</a></li>
                      <li><a href="/jobs/occupation/occupational-therapy" className="hover:text-green-600 dark:hover:text-green-400">Occupational Therapy Jobs</a></li>
                      <li><a href="/jobs/occupation/speech-pathology" className="hover:text-green-600 dark:hover:text-green-400">Speech Pathology Jobs</a></li>
                      <li><a href="/jobs/occupation/psychology" className="hover:text-green-600 dark:hover:text-green-400">Psychology Jobs</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredJobs.map(job => (
              <JobCardWrapper
                key={job.id}
                job={{
                  ...job,
                  is_new: false,
                  company_logo_url: job.company_logo_url || "",
                  salary_range: job.salary_range ?? null,
                  posted_ago: null,
                  is_bookmarked: false,
                }}
              />
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} in this location
          </p>
        </div>
      </div>
    </>
  )
} 