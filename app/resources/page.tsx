"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

const ADMIN_EMAIL = "patelagastya1@gmail.com";

const placeholderPosts = [
  {
    id: 1,
    title: "Cut These 15 Words from Your Allied Health Resume (They're Killing Your Chances)",
    excerpt: "Overused phrases like 'excellent communication skills' and 'team player' can actually hurt your resume. Learn which words to cut and what to say instead.",
    coverUrl: "/placeholder.jpg",
    readTime: "12 min read",
  },
  {
    id: 2,
    title: "The 5-Second Rule: What Hiring Managers Actually Look for in Allied Health CVs",
    excerpt: "Recruiters spend just seconds scanning your CV. Discover what catches their attention first and how to make your application stand out.",
    coverUrl: "/placeholder.jpg",
    readTime: "10 min read",
  },
  {
    id: 3,
    title: "LinkedIn Mistakes That Are Costing Allied Health Professionals Job Opportunities",
    excerpt: "Common profile errors, poor networking habits, and missed visibility opportunities can cost you jobs. Fix these LinkedIn mistakes today.",
    coverUrl: "/placeholder.jpg",
    readTime: "15 min read",
  },
  {
    id: 4,
    title: "How to Beat Tall Poppy Syndrome in Australian Allied Health Workplaces",
    excerpt: "Practical strategies for dealing with workplace jealousy when you excel or get promoted in allied health settings.",
    coverUrl: "/placeholder.jpg",
    readTime: "14 min read",
  },
  {
    id: 5,
    title: "8 Things You Didn't Know Could Get You Fired as an Allied Health Professional",
    excerpt: "Lesser-known termination risks like social media posts, boundary violations, and documentation errors you need to avoid.",
    coverUrl: "/placeholder.jpg",
    readTime: "13 min read",
  },
  {
    id: 6,
    title: "The Politics of Allied Health: Navigating Workplace Hierarchies Without Losing Your Soul",
    excerpt: "Handle difficult colleagues, manage up effectively, and build strategic relationships in complex healthcare environments.",
    coverUrl: "/placeholder.jpg",
    readTime: "16 min read",
  },
  {
    id: 7,
    title: "How to Beat FOBO: The Fear of Becoming Obsolete in Allied Health",
    excerpt: "Address technology anxiety, upskilling strategies, and staying relevant in evolving healthcare.",
    coverUrl: "/placeholder.jpg",
    readTime: "11 min read",
  },
  {
    id: 8,
    title: "Imposter Syndrome is Ruining Your Allied Health Career (Here's How to Fix It)",
    excerpt: "Practical techniques for building confidence and owning your expertise as an allied health professional.",
    coverUrl: "/placeholder.jpg",
    readTime: "12 min read",
  },
  {
    id: 9,
    title: "The Salary Conversation: What to Say When Asked About Money (Script Included)",
    excerpt: "Word-for-word responses for salary questions during interviews and performance reviews in allied health.",
    coverUrl: "/placeholder.jpg",
    readTime: "9 min read",
  },
  {
    id: 10,
    title: "Side Hustles for Allied Health Professionals: 7 Ways to Boost Your Income",
    excerpt: "Legitimate opportunities like telehealth consulting, training delivery, and freelance assessments to increase your earnings.",
    coverUrl: "/placeholder.jpg",
    readTime: "14 min read",
  },
  {
    id: 11,
    title: "The Complete Guide to Physiotherapy Career Progression in Australia (2025)",
    excerpt: "Comprehensive roadmap from graduate to senior physiotherapist, including specializations, certifications, and salary expectations.",
    coverUrl: "/placeholder.jpg",
    readTime: "25 min read",
  },
  {
    id: 12,
    title: "Occupational Therapy Salary Guide: What You Should Be Earning in 2025",
    excerpt: "Detailed breakdown of OT salaries by experience level, location, and specialization across Australia.",
    coverUrl: "/placeholder.jpg",
    readTime: "18 min read",
  },
  {
    id: 13,
    title: "Speech Pathology Career Path: From Graduate to Clinical Specialist",
    excerpt: "Complete career development guide for speech pathologists, including specializations, certifications, and advancement strategies.",
    coverUrl: "/placeholder.jpg",
    readTime: "22 min read",
  },
  {
    id: 14,
    title: "Psychology in Allied Health: Building a Successful Private Practice",
    excerpt: "Step-by-step guide to establishing and growing a psychology practice, from business planning to client acquisition.",
    coverUrl: "/placeholder.jpg",
    readTime: "28 min read",
  },
  {
    id: 15,
    title: "Dietetics and Nutrition: The Ultimate Career Development Guide",
    excerpt: "Comprehensive guide to advancing your career in dietetics, from clinical roles to private practice and consulting.",
    coverUrl: "/placeholder.jpg",
    readTime: "20 min read",
  },
  {
    id: 16,
    title: "Social Work in Healthcare: Navigating Complex Systems and Building Impact",
    excerpt: "Deep dive into healthcare social work, including hospital settings, community health, and mental health specializations.",
    coverUrl: "/placeholder.jpg",
    readTime: "24 min read",
  },
  {
    id: 17,
    title: "Podiatry Career Guide: From General Practice to Sports Specialization",
    excerpt: "Complete career roadmap for podiatrists, covering clinical practice, sports podiatry, and business development.",
    coverUrl: "/placeholder.jpg",
    readTime: "19 min read",
  },
  {
    id: 18,
    title: "Audiology Career Development: From Clinical Practice to Research",
    excerpt: "Comprehensive guide to audiology careers, including clinical practice, research opportunities, and industry leadership.",
    coverUrl: "/placeholder.jpg",
    readTime: "21 min read",
  },
  {
    id: 19,
    title: "Exercise Physiology: Building a Career in Preventive Healthcare",
    excerpt: "Complete guide to exercise physiology careers, from clinical practice to corporate wellness and research.",
    coverUrl: "/placeholder.jpg",
    readTime: "23 min read",
  },
  {
    id: 20,
    title: "Optometry Career Path: From Clinical Practice to Specialized Care",
    excerpt: "Comprehensive career development guide for optometrists, including specializations and business opportunities.",
    coverUrl: "/placeholder.jpg",
    readTime: "17 min read",
  },
  {
    id: 21,
    title: "Pharmacy in Allied Health: Beyond Dispensing to Patient Care",
    excerpt: "Exploring the expanding role of pharmacists in allied health, from clinical pharmacy to specialized services.",
    coverUrl: "/placeholder.jpg",
    readTime: "20 min read",
  },
  {
    id: 22,
    title: "Radiography Career Guide: From Diagnostic Imaging to Advanced Practice",
    excerpt: "Complete career development guide for radiographers, including specializations and advanced practice opportunities.",
    coverUrl: "/placeholder.jpg",
    readTime: "19 min read",
  },
  {
    id: 23,
    title: "The Future of Allied Health: Technology Trends That Will Shape Your Career",
    excerpt: "Comprehensive analysis of emerging technologies in allied health and how they will impact different professions.",
    coverUrl: "/placeholder.jpg",
    readTime: "26 min read",
  },
  {
    id: 24,
    title: "Mental Health in Allied Health: Supporting Colleagues and Patients",
    excerpt: "Essential guide to mental health awareness and support in allied health workplaces and patient care.",
    coverUrl: "/placeholder.jpg",
    readTime: "16 min read",
  },
  {
    id: 25,
    title: "Continuing Professional Development: A Complete Guide for Allied Health Professionals",
    excerpt: "Comprehensive guide to CPD requirements, opportunities, and strategies for career advancement across all allied health professions.",
    coverUrl: "/placeholder.jpg",
    readTime: "22 min read",
  },
];

export default function ResourcesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState(placeholderPosts);

  // Filter posts by search
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  // Blog post form state (admin only)
  const [form, setForm] = useState<{ title: string; excerpt: string; cover: File | null; article: string }>({ title: "", excerpt: "", cover: null, article: "" });
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(f => ({ ...f, cover: file }));
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement blob upload and post creation
    alert("Blog post creation not implemented in this placeholder.");
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">Resources</h1>
        <Input
          type="text"
          placeholder="Search by heading..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-80"
        />
      </div>

      {/* Admin blog post form */}
      {user?.email === ADMIN_EMAIL && (
        <form onSubmit={handlePost} className="mb-12 bg-white dark:bg-zinc-900 rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Post a New Blog Article</h2>
          <div>
            <label className="block mb-1 font-medium">Cover Image</label>
            <input type="file" accept="image/*" onChange={handleCoverChange} />
            {coverPreview && <img src={coverPreview} alt="Cover preview" className="mt-2 w-64 h-40 object-cover rounded" />}
          </div>
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <Input name="title" value={form.title} onChange={handleFormChange} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Excerpt</label>
            <Input name="excerpt" value={form.excerpt} onChange={handleFormChange} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Article</label>
            <textarea name="article" value={form.article} onChange={handleFormChange} required className="w-full min-h-[120px] p-2 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white" />
          </div>
          <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">Post Article</Button>
        </form>
      )}

      {/* Blog post grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPosts.map(post => (
          <Link key={post.id} href={`/resources/${post.id}`} passHref legacyBehavior>
            <a className="block">
              <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition">
                <img src={post.coverUrl} alt={post.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <div className="font-semibold text-lg mb-1">{post.title}</div>
                  <div className="text-gray-500 text-sm mb-2">{post.readTime}</div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">{post.excerpt}</div>
                </div>
              </Card>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}