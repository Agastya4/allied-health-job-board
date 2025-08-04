"use client"

import { SEO } from "@/components/seo";
import { BlogCard } from "@/components/blog-card";
import { getAllBlogPosts } from "@/lib/blog-data";

export default function BlogPage() {
  // Get all blog posts
  const allPosts = getAllBlogPosts();
  
  return (
    <>
      <SEO 
        title="Allied Health Blog - Career Guides & Resources"
        description="Expert Career Advice, Industry Insights, and Professional Development Resources for Allied Health Professionals in Australia."
        keywords={[
          'Allied Health Blog',
          'Healthcare Career Advice',
          'Physiotherapy Blog',
          'Occupational Therapy Blog',
          'Speech Pathology Blog',
          'Healthcare Professional Development',
          'Allied Health Articles',
          'Healthcare Career Guides'
        ]}
        url="/blog"
        type="website"
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
} 