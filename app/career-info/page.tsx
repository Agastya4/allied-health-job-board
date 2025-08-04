"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { SEO } from "@/components/seo"

const alliedHealthProfessions = [
  { name: "Audiology", slug: "audiology", description: "Hearing and balance disorders" },
  { name: "Dietetics & Nutrition", slug: "dietetics-nutrition", description: "Nutrition and dietary health" },
  { name: "Exercise Physiology", slug: "exercise-physiology", description: "Physical activity and rehabilitation" },
  { name: "Occupational Therapy", slug: "occupational-therapy", description: "Daily living skills and independence" },
  { name: "Optometry", slug: "optometry", description: "Eye care and vision health" },
  { name: "Pharmacy", slug: "pharmacy", description: "Medication and pharmaceutical care" },
  { name: "Physiotherapy", slug: "physiotherapy", description: "Physical rehabilitation and movement" },
  { name: "Podiatry", slug: "podiatry", description: "Foot and lower limb health" },
  { name: "Psychology", slug: "psychology", description: "Mental health and behavioral therapy" },
  { name: "Radiography", slug: "radiography", description: "Medical imaging and diagnostics" },
  { name: "Social Work", slug: "social-work", description: "Social support and community services" },
  { name: "Speech Pathology", slug: "speech-pathology", description: "Communication and swallowing disorders" },
]

export default function CareerInfoPage() {
  return (
    <>
      <SEO 
        title="Allied Health Careers - AlliedHealthJobs.au"
        description="Explore Rewarding Allied Health Careers in Australia. Learn About Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Professions."
        keywords={[
          'Allied Health Careers',
          'Healthcare Careers Australia',
          'Physiotherapy Careers',
          'Occupational Therapy Careers',
          'Speech Pathology Careers',
          'Healthcare Professions',
          'Allied Health Jobs'
        ]}
        url="/career-info"
        type="website"
      />
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="max-w-7xl mx-auto py-12 px-4">
          {/* Simple Allied Health Description */}
          <Card className="mb-12 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-gray-200 dark:border-zinc-800">
            <CardContent className="p-8">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Allied health professionals work alongside doctors and nurses to provide specialized healthcare services. 
                They focus on prevention, diagnosis, treatment, and rehabilitation across various medical specialties. 
                These professionals play a crucial role in patient care, recovery, and maintaining quality of life. 
                From hospitals and clinics to community health centers and private practices, allied health careers 
                offer diverse work environments with endless career growth possibilities.
              </p>
            </CardContent>
          </Card>

          {/* Allied Health Professions A-Z */}
          <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-gray-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Search className="h-6 w-6 text-violet-600" />
                Allied Health Professions A-Z
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Explore detailed information about each allied health profession, including career paths, 
                qualifications, and job opportunities.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {alliedHealthProfessions.map((profession) => (
                  <Link key={profession.slug} href={`/career-info/${profession.slug}`}>
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {profession.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                          {profession.description}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white"
                        >
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
} 