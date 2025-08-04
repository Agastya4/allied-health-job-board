"use client"

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Calendar, Clock, User, BookOpen } from "lucide-react";
import { SEO } from "@/components/seo";
import { BlogContent } from "@/components/blog-content";
import { BlogCard } from "@/components/blog-card";
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/blog-data";
import { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Blog Post Not Found - AlliedHealthJobs.au",
      description: "The requested blog post could not be found.",
    }
  }

  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt
  const keywords = post.seoKeywords || post.tags

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://alliedhealthjobs.au/blog/${post.slug}`,
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
      canonical: `https://alliedhealthjobs.au/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    notFound();
  }
  
  const relatedPosts = getRelatedPosts(post, 3);
  
  return (
    <>
      <SEO 
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        keywords={post.seoKeywords || post.tags}
        url={`/blog/${post.slug}`}
        type="article"
        articleData={{
          title: post.title,
          description: post.excerpt,
          author: post.author,
          publishedTime: post.publishedAt,
          section: post.category,
          tags: post.tags
        }}
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-2">
            <BlogContent post={post} />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Share Section */}
            <Card className="bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share This Article
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    navigator.share?.({
                      title: post.title,
                      text: post.excerpt,
                      url: window.location.href
                    }).catch(() => {
                      navigator.clipboard.writeText(window.location.href);
                    });
                  }}
                >
                  Share Article
                </Button>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Help other allied health professionals discover this valuable resource.
                </div>
              </CardContent>
            </Card>
            
            {/* Article Stats */}
            <Card className="bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  Article Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Author:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{post.author}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Published:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(post.publishedAt).toLocaleDateString('en-AU', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Read Time:</span>
                  <span className="text-gray-900 dark:text-white">{post.readTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Word Count:</span>
                  <span className="text-gray-900 dark:text-white">{post.content.split(/\s+/).length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Category:</span>
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            {/* Tags */}
            {post.tags.length > 0 && (
              <Card className="bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        )}
        
        {/* CTA Section */}
        <Card className="mt-16 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200 dark:border-violet-800">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Advance Your Career?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Explore thousands of allied health job opportunities across Australia and find your next career move.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs">
                <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                  Browse Jobs
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" className="border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white">
                  More Articles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 