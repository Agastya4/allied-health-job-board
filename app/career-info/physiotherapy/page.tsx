"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  GraduationCap, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Users, 
  Clock,
  ArrowRight,
  CheckCircle
} from "lucide-react"

export default function PhysiotherapyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Physiotherapy Careers in Australia
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover rewarding opportunities in physiotherapy - a dynamic allied health profession focused on 
            physical rehabilitation, movement science, and improving patient quality of life across Australia.
          </p>
          <Link href="/jobs/occupation/physiotherapy">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
              <Briefcase className="h-5 w-5 mr-2" />
              View Physiotherapy Jobs
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* What is Physiotherapy */}
        <Card className="mb-12 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-gray-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Heart className="h-6 w-6 text-green-600" />
              What is Physiotherapy?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Physiotherapy is a healthcare profession that focuses on the assessment, diagnosis, treatment, and 
              prevention of physical impairments, disabilities, and pain. Physiotherapists use evidence-based 
              techniques to help patients recover from injuries, manage chronic conditions, and improve their 
              overall physical function and quality of life.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Core Responsibilities
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Physical assessment and diagnosis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Treatment planning and implementation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Exercise prescription and rehabilitation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Manual therapy and hands-on treatment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Patient education and prevention</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Sports Physiotherapy
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Neurological Rehabilitation
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Pediatric Physiotherapy
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Geriatric Care
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Cardiorespiratory
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Women's Health
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Path & Qualifications */}
        <Card className="mb-12 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-gray-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-green-600" />
              Career Path & Qualifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Educational Requirements
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Bachelor's degree in Physiotherapy (4 years)</li>
                  <li>• Master's degree in Physiotherapy (2 years)</li>
                  <li>• Registration with AHPRA (Australian Health Practitioner Regulation Agency)</li>
                  <li>• Continuing Professional Development (CPD) requirements</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Career Progression
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Graduate Physiotherapist</li>
                  <li>• Senior Physiotherapist</li>
                  <li>• Clinical Specialist</li>
                  <li>• Practice Manager/Owner</li>
                  <li>• Academic/Researcher</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Settings & Salary */}
        <Card className="mb-12 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-gray-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-green-600" />
              Work Settings & Salary Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Work Environments
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Private physiotherapy practices</li>
                  <li>• Public and private hospitals</li>
                  <li>• Sports clubs and facilities</li>
                  <li>• Community health centers</li>
                  <li>• Aged care facilities</li>
                  <li>• Rehabilitation centers</li>
                  <li>• Corporate health programs</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Salary Ranges (Australia)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Graduate</span>
                    <span className="font-semibold text-gray-900 dark:text-white">$60,000 - $75,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Mid-level (3-5 years)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">$75,000 - $95,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Senior (5+ years)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">$95,000 - $120,000+</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Market & Opportunities */}
        <Card className="mb-12 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-gray-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="h-6 w-6 text-violet-600" />
              Job Market & Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              The physiotherapy job market in Australia is experiencing strong growth, driven by an aging population, 
              increased focus on preventive healthcare, and growing demand for rehabilitation services. Physiotherapists 
              are in high demand across all states and territories, with particularly strong opportunities in regional 
              and rural areas.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                <MapPin className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Geographic Demand</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  High demand in regional and rural areas
                </p>
              </div>
              <div className="text-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                <Clock className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Growth Projection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  15% growth expected over next 5 years
                </p>
              </div>
              <div className="text-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                <DollarSign className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Salary Growth</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Competitive salaries with annual increases
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-violet-600 text-white border-violet-600">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Start Your Physiotherapy Career?
              </h2>
              <p className="text-violet-100 mb-6 max-w-2xl mx-auto">
                Explore current physiotherapy job opportunities across Australia. Find positions that match your 
                experience level, location preferences, and career goals.
              </p>
              <Link href="/jobs/occupation/physiotherapy">
                <Button className="bg-white text-violet-600 hover:bg-violet-50 px-8 py-3 text-lg">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Browse Physiotherapy Jobs
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 