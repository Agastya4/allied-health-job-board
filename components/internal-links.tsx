'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InternalLinksProps {
  currentPage?: string
  showLocationLinks?: boolean
  showCategoryLinks?: boolean
  showBlogLinks?: boolean
}

export function InternalLinks({ 
  currentPage, 
  showLocationLinks = true, 
  showCategoryLinks = true, 
  showBlogLinks = true 
}: InternalLinksProps) {
  const popularLocations = [
    { name: 'Sydney', url: '/locations/nsw/sydney' },
    { name: 'Melbourne', url: '/locations/vic/melbourne' },
    { name: 'Brisbane', url: '/locations/qld/brisbane' },
    { name: 'Perth', url: '/locations/wa/perth' },
    { name: 'Adelaide', url: '/locations/sa/adelaide' },
    { name: 'Canberra', url: '/locations/act/canberra' },
  ]

  const popularCategories = [
    { name: 'Physiotherapy', url: '/jobs/occupation/physiotherapy' },
    { name: 'Occupational Therapy', url: '/jobs/occupation/occupational-therapy' },
    { name: 'Speech Pathology', url: '/jobs/occupation/speech-pathology' },
    { name: 'Psychology', url: '/jobs/occupation/psychology' },
    { name: 'Podiatry', url: '/jobs/occupation/podiatry' },
    { name: 'Dietetics & Nutrition', url: '/jobs/occupation/dietetics-nutrition' },
  ]

  const popularBlogPosts = [
    { title: 'How to Write a Winning Allied Health Resume', url: '/blog/how-to-write-winning-allied-health-resume-2025' },
    { title: 'Allied Health Salary Guide Australia 2025', url: '/blog/allied-health-salary-guide-australia-2025' },
    { title: 'Top 10 Allied Health Jobs in High Demand', url: '/blog/top-10-allied-health-jobs-high-demand-2025' },
    { title: 'Physiotherapy Career Guide Australia', url: '/blog/physiotherapy-career-guide-australia-2025' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {showLocationLinks && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Popular Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {popularLocations.map((location) => (
                <Link
                  key={location.url}
                  href={location.url}
                  className="block text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:underline"
                >
                  {location.name} Jobs
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showCategoryLinks && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Job Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {popularCategories.map((category) => (
                <Link
                  key={category.url}
                  href={category.url}
                  className="block text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:underline"
                >
                  {category.name} Jobs
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showBlogLinks && (
        <Card>
          <CardHeader>
                            <CardTitle className="text-lg">Latest Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {popularBlogPosts.map((post) => (
                <Link
                  key={post.url}
                  href={post.url}
                  className="block text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:underline text-sm"
                >
                  {post.title}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 