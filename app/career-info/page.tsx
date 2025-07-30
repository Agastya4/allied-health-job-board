"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Users, Heart, GraduationCap, Briefcase } from "lucide-react"
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
        description="Explore rewarding allied health careers in Australia. Learn about physiotherapy, occupational therapy, speech pathology, and other healthcare professions."
        keywords={[
          'allied health careers',
          'healthcare careers Australia',
          'physiotherapy careers',
          'occupational therapy careers',
          'speech pathology careers',
          'healthcare professions',
          'allied health jobs'
        ]}
        url="/career-info"
        type="website"
      />
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="max-w-7xl mx-auto py-12 px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Allied Health Careers
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover rewarding careers in allied health - a diverse field dedicated to improving patient outcomes, 
              promoting wellness, and supporting healthcare teams across Australia.
            </p>
          </div>

          {/* What is Allied Health Section */}
          <Card className="mb-12 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-gray-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="h-6 w-6 text-violet-600" />
                What is Allied Health?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Comprehensive Healthcare Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Allied health professionals work alongside doctors and nurses to provide specialized healthcare services. 
                    They focus on prevention, diagnosis, treatment, and rehabilitation across various medical specialties. 
                    These professionals play a crucial role in patient care, recovery, and maintaining quality of life.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Diverse Career Opportunities
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    From hospitals and clinics to community health centers and private practices, allied health careers 
                    offer diverse work environments. Professionals can specialize in areas like pediatrics, geriatrics, 
                    sports medicine, mental health, and rehabilitation, providing endless career growth possibilities.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                  <Heart className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Patient-Centered Care</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Focus on improving patient outcomes and quality of life
                  </p>
                </div>
                <div className="text-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                  <GraduationCap className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Continuous Learning</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Ongoing professional development and specialization opportunities
                  </p>
                </div>
                <div className="text-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                  <Briefcase className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Team Collaboration</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Work within multidisciplinary healthcare teams
                  </p>
                </div>
              </div>
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

          {/* Career Benefits Section */}
          <Card className="mt-12 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-gray-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Why Choose Allied Health?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Job Security & Growth
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• High demand across Australia</li>
                    <li>• Competitive salaries and benefits</li>
                    <li>• Strong career progression opportunities</li>
                    <li>• Work-life balance options</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Professional Development
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Continuous learning opportunities</li>
                    <li>• Specialization pathways</li>
                    <li>• Professional associations</li>
                    <li>• Research and innovation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
} 