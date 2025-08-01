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
        description="Expert career advice, industry insights, and professional development resources for allied health professionals in Australia."
        keywords={[
          'allied health blog',
          'healthcare career advice',
          'physiotherapy blog',
          'occupational therapy blog',
          'speech pathology blog',
          'healthcare professional development',
          'allied health articles',
          'healthcare career guides'
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