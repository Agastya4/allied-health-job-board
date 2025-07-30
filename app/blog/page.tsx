"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Calendar, Clock, User } from "lucide-react";
import { SEO } from "@/components/seo";
import { BlogCard } from "@/components/blog-card";
import { getAllBlogPosts, getBlogPostsByCategory } from "@/lib/blog-data";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Get all blog posts
  const allPosts = getAllBlogPosts();
  
  // Filter posts based on search and category
  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = ["all", ...Array.from(new Set(allPosts.map(post => post.category)))];
  
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Allied Health Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Expert insights, career guidance, and professional development resources for allied health professionals across Australia.
          </p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap bg-violet-600 hover:bg-violet-700 text-white"
                >
                  {category === "all" ? "All Categories" : category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Results Count */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredPosts.length} of {allPosts.length} articles
          </div>
        </div>
        
        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or category filter.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
        
        {/* Newsletter Signup */}
        <Card className="mt-16 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200 dark:border-violet-800">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Stay Updated with Career Insights
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Get the latest allied health career advice, job market trends, and professional development tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
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