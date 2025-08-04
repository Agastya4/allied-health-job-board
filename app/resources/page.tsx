"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Users, GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import { SEO } from "@/components/seo";

const resourceCategories = [
  {
    title: "Career Guides",
    description: "Comprehensive guides for allied health professionals",
    icon: BookOpen,
    link: "/blog",
    color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
  },
  {
    title: "Resume Templates",
    description: "Professional templates for healthcare resumes",
    icon: FileText,
    link: "/blog",
    color: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
  },
  {
    title: "Interview Tips",
    description: "Expert advice for healthcare job interviews",
    icon: Users,
    link: "/blog",
    color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
  },
  {
    title: "Professional Development",
    description: "Continuing education and skill development",
    icon: GraduationCap,
    link: "/blog",
    color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
  },
  {
    title: "Salary Guides",
    description: "Industry salary insights and negotiation tips",
    icon: Briefcase,
    link: "/blog",
    color: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
  }
];

export default function ResourcesPage() {
  return (
    <>
      <SEO 
        title="Resources & Guides - AlliedHealthJobs.au"
        description="Access Helpful Resources, Career Guides, and Professional Development Articles for Allied Health Professionals in Australia."
        keywords={[
          'Allied Health Resources',
          'Healthcare Career Guides',
          'Physiotherapy Resources',
          'Occupational Therapy Guides',
          'Speech Pathology Resources',
          'Healthcare Professional Development',
          'Allied Health Articles',
          'Healthcare Career Advice'
        ]}
        url="/resources"
        type="website"
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Resources & Guides
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Expert resources to help allied health professionals advance their careers, develop skills, and stay updated with industry trends.
          </p>
        </div>

        {/* Resource Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {resourceCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.title} href={category.link}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${category.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                          {category.description}
                        </p>
                        <div className="flex items-center text-violet-600 dark:text-violet-400 text-sm font-medium">
                          Explore Resources
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Featured Blog Section */}
        <Card className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200 dark:border-violet-800">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Latest Career Insights
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Stay updated with the latest trends, tips, and advice from industry experts in our comprehensive blog.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog">
                <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read Our Blog
                </Button>
              </Link>
              <Link href="/jobs">
                <Button variant="outline" className="border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Signup */}
        <Card className="mt-12 bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Get Career Updates
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest job opportunities, career advice, and industry insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}