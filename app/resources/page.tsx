"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X, Plus } from "lucide-react";

const ADMIN_EMAIL = "patelagastya1@gmail.com";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  author: string;
  publishedAt: string;
  readTime: string;
}

export default function ResourcesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Blog post form state
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverFile: null as File | null,
    coverPreview: null as string | null,
  });

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      setForm(prev => ({ 
        ...prev, 
        coverFile: file,
        coverPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);

    try {
      // Simulate image upload (in real app, upload to cloud storage)
      const coverUrl = form.coverPreview || "/placeholder.jpg";
      
      // Create new blog post
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        coverUrl,
        author: user?.email || "Admin",
        publishedAt: new Date().toISOString(),
        readTime: calculateReadTime(form.content),
      };

      // Add to posts list
      setPosts(prev => [newPost, ...prev]);

      // Reset form
      setForm({
        title: "",
        excerpt: "",
        content: "",
        coverFile: null,
        coverPreview: null,
      });

      setShowForm(false);

      toast({
        title: "Blog post published!",
        description: "Your article has been successfully published.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const removeCover = () => {
    setForm(prev => ({ 
      ...prev, 
      coverFile: null, 
      coverPreview: null 
    }));
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resources</h1>
        
        {/* Admin controls */}
        {user?.email === ADMIN_EMAIL && (
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {showForm ? "Cancel" : "New Blog Post"}
            </Button>
          </div>
        )}
      </div>

      {/* Admin blog post form */}
      {user?.email === ADMIN_EMAIL && showForm && (
        <Card className="mb-8 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white">
              Create New Blog Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePost} className="space-y-6">
              {/* Cover Image */}
              <div className="space-y-2">
                <Label htmlFor="cover" className="text-gray-900 dark:text-white">
                  Cover Image
                </Label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      id="cover"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="cover"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                    >
                      <Upload className="h-4 w-4" />
                      Choose Image
                    </label>
                  </div>
                  {form.coverPreview && (
                    <div className="relative">
                      <img 
                        src={form.coverPreview} 
                        alt="Cover preview" 
                        className="w-32 h-20 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeCover}
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Recommended size: 1200x630px. Max file size: 5MB.
                </p>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-900 dark:text-white">
                  Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="Enter the blog post title..."
                  required
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-gray-900 dark:text-white">
                  Excerpt *
                </Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleFormChange}
                  placeholder="Brief description of the article..."
                  required
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-gray-900 dark:text-white">
                  Content *
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleFormChange}
                  placeholder="Write your blog post content here..."
                  required
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                  rows={12}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Word count: {form.content.split(/\s+/).filter(word => word.length > 0).length}
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={isPosting}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  {isPosting ? "Publishing..." : "Publish Post"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  disabled={isPosting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Blog posts grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No blog posts yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.email === ADMIN_EMAIL 
              ? "Create your first blog post using the form above."
              : "Check back soon for helpful resources and articles."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map(post => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition cursor-pointer">
              <img src={post.coverUrl} alt={post.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="font-semibold text-lg mb-1 text-gray-900 dark:text-white line-clamp-2">
                  {post.title}
                </div>
                <div className="text-gray-500 text-sm mb-2">{post.readTime}</div>
                <div className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                  {post.excerpt}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}