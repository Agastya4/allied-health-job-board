import { SEO } from '@/components/seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowRight } from 'lucide-react'

const blogPosts = [
  {
    id: '1',
    title: 'How to Write a Winning Allied Health Resume in 2024',
    excerpt: 'Learn the essential tips and tricks to create a resume that stands out in the competitive allied health job market.',
    author: 'AlliedHealthJobs Team',
    publishedAt: '2024-01-15',
    readTime: '5 min read',
    category: 'Career Advice',
    slug: 'how-to-write-winning-allied-health-resume-2024'
  },
  {
    id: '2', 
    title: 'Top 10 Allied Health Jobs in High Demand for 2024',
    excerpt: 'Discover which allied health professions are experiencing the highest growth and demand in Australia.',
    author: 'AlliedHealthJobs Team',
    publishedAt: '2024-01-10',
    readTime: '7 min read',
    category: 'Industry Trends',
    slug: 'top-10-allied-health-jobs-high-demand-2024'
  },
  {
    id: '3',
    title: 'Interview Tips for Allied Health Professionals',
    excerpt: 'Master the interview process with our comprehensive guide tailored specifically for allied health roles.',
    author: 'AlliedHealthJobs Team', 
    publishedAt: '2024-01-05',
    readTime: '6 min read',
    category: 'Career Advice',
    slug: 'interview-tips-allied-health-professionals'
  },
  {
    id: '4',
    title: 'Salary Guide: Allied Health Salaries in Australia 2024',
    excerpt: 'Get the latest salary information for physiotherapists, occupational therapists, and other allied health roles.',
    author: 'AlliedHealthJobs Team',
    publishedAt: '2024-01-01',
    readTime: '8 min read',
    category: 'Salary Guide',
    slug: 'salary-guide-allied-health-salaries-australia-2024'
  },
  {
    id: '5',
    title: 'Continuing Professional Development for Allied Health',
    excerpt: 'Stay ahead in your career with our guide to CPD requirements and opportunities in allied health.',
    author: 'AlliedHealthJobs Team',
    publishedAt: '2023-12-28',
    readTime: '4 min read',
    category: 'Professional Development',
    slug: 'continuing-professional-development-allied-health'
  },
  {
    id: '6',
    title: 'Work-Life Balance in Allied Health: Tips for Success',
    excerpt: 'Learn how to maintain a healthy work-life balance while excelling in your allied health career.',
    author: 'AlliedHealthJobs Team',
    publishedAt: '2023-12-25',
    readTime: '5 min read',
    category: 'Wellness',
    slug: 'work-life-balance-allied-health-tips-success'
  }
]

const categories = [
  'All',
  'Career Advice',
  'Industry Trends', 
  'Salary Guide',
  'Professional Development',
  'Wellness',
  'Job Search Tips'
]

export default function BlogPage() {
  return (
    <>
      <SEO 
        title="Allied Health Blog - Career Advice & Industry Insights"
        description="Stay updated with the latest allied health career advice, industry trends, salary guides, and professional development tips."
        keywords={[
          'allied health blog',
          'healthcare career advice',
          'physiotherapy career tips',
          'occupational therapy blog',
          'speech pathology career',
          'allied health salary guide',
          'healthcare professional development'
        ]}
        url="/blog"
        type="website"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Allied Health Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Expert insights, career advice, and industry trends for allied health professionals
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'All' ? 'default' : 'outline'}
                size="sm"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Featured Post */}
          <div className="mb-12">
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-violet-500 to-purple-600 p-8 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h2 className="text-2xl font-bold mb-2">Featured</h2>
                    <p className="text-violet-100">Most Popular</p>
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200 px-3 py-1 rounded-full text-xs font-medium">
                      Career Advice
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Jan 15, 2024</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>5 min read</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    How to Write a Winning Allied Health Resume in 2024
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Learn the essential tips and tricks to create a resume that stands out in the competitive allied health job market. From formatting to content, we cover everything you need to know.
                  </p>
                  <Link href="/blog/how-to-write-winning-allied-health-resume-2024">
                    <Button className="group">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200 px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="ghost" size="sm" className="group">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Stay Updated with Allied Health News
                </h3>
                <p className="text-violet-100 mb-6 max-w-2xl mx-auto">
                  Get the latest career advice, industry insights, and job opportunities delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <Button variant="secondary" className="whitespace-nowrap">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
} 