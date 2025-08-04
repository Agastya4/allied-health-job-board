import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search, MapPin, Briefcase } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Page Not Found - AlliedHealthJobs.au',
  description: 'The page you are looking for could not be found. Browse our allied health jobs or return to the homepage.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://alliedhealthjobs.au/404',
  },
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-green-600 dark:text-green-400 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            The page you are looking for could not be found. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/jobs">
            <Button className="w-full h-16 text-lg" size="lg">
              <Search className="mr-2 h-5 w-5" />
              Browse All Jobs
            </Button>
          </Link>
          
          <Link href="/locations">
            <Button variant="outline" className="w-full h-16 text-lg" size="lg">
              <MapPin className="mr-2 h-5 w-5" />
              Browse by Location
            </Button>
          </Link>
          
          <Link href="/career-info">
            <Button variant="outline" className="w-full h-16 text-lg" size="lg">
              <Briefcase className="mr-2 h-5 w-5" />
              Career Information
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="w-full h-16 text-lg" size="lg">
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-zinc-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Popular Pages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Job Categories</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/jobs/occupation/physiotherapy" className="hover:text-green-600 dark:hover:text-green-400">Physiotherapy Jobs</Link></li>
                <li><Link href="/jobs/occupation/occupational-therapy" className="hover:text-green-600 dark:hover:text-green-400">Occupational Therapy Jobs</Link></li>
                <li><Link href="/jobs/occupation/speech-pathology" className="hover:text-green-600 dark:hover:text-green-400">Speech Pathology Jobs</Link></li>
                <li><Link href="/jobs/occupation/psychology" className="hover:text-green-600 dark:hover:text-green-400">Psychology Jobs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Popular Locations</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/locations/nsw/sydney" className="hover:text-green-600 dark:hover:text-green-400">Sydney Jobs</Link></li>
                <li><Link href="/locations/vic/melbourne" className="hover:text-green-600 dark:hover:text-green-400">Melbourne Jobs</Link></li>
                <li><Link href="/locations/qld/brisbane" className="hover:text-green-600 dark:hover:text-green-400">Brisbane Jobs</Link></li>
                <li><Link href="/locations/wa/perth" className="hover:text-green-600 dark:hover:text-green-400">Perth Jobs</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 