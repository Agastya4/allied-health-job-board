"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { PlusCircle, Upload, MapPin, LayoutDashboard, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmployerJobListing } from "@/components/employer-job-listing"
import { JobPostingForm } from "@/components/job-posting-form"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"
import Head from "next/head"
import { SEO } from "@/components/seo"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Employer Dashboard - AlliedHealthJobs.au",
  description: "Manage Your Allied Health Job Listings, Practice Details, and Recruitment Campaigns. Post Jobs and Find Qualified Healthcare Professionals.",
  keywords: [
    'Employer Dashboard',
    'Job Management',
    'Recruitment Dashboard',
    'Hire Healthcare Professionals',
    'Allied Health Recruitment'
  ],
  openGraph: {
    title: "Employer Dashboard - AlliedHealthJobs.au",
    description: "Manage Your Allied Health Job Listings, Practice Details, and Recruitment Campaigns. Post Jobs and Find Qualified Healthcare Professionals.",
    url: "https://alliedhealthjobs.au/employer",
    siteName: "AlliedHealthJobs.au",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "Employer Dashboard",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Employer Dashboard - AlliedHealthJobs.au",
    description: "Manage Your Allied Health Job Listings, Practice Details, and Recruitment Campaigns. Post Jobs and Find Qualified Healthcare Professionals.",
    images: ["/Logo.png"],
    creator: "@alliedhealthjobs",
  },
  alternates: {
    canonical: "https://alliedhealthjobs.au/employer",
  },
}

interface PracticeDetails {
  practiceName: string;
  streetAddress: string;
  suburb: string;
  postcode: string;
  state: string;
  phoneNumber: string;
  website: string;
  logoUrl: string;
}

export default function EmployerDashboardPage() {
  const [showJobForm, setShowJobForm] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const [employerJobs, setEmployerJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Practice details state
  const [practiceDetails, setPracticeDetails] = useState<PracticeDetails>({
    practiceName: "",
    streetAddress: "",
    suburb: "",
    postcode: "",
    state: "",
    phoneNumber: "",
    website: "",
    logoUrl: ""
  })

  // Load practice details on component mount
  useEffect(() => {
    if (user) {
      loadPracticeDetails()
    }
  }, [user])

  const loadPracticeDetails = async () => {
    try {
      const response = await fetch("/api/employer/practice-details", {
        credentials: "include"
      })
      const data = await response.json()
      
      if (data.success && data.practiceDetails) {
        setPracticeDetails({
          practiceName: data.practiceDetails.practice_name || "",
          streetAddress: data.practiceDetails.street_address || "",
          suburb: data.practiceDetails.suburb || "",
          postcode: data.practiceDetails.postcode || "",
          state: data.practiceDetails.state || "",
          phoneNumber: data.practiceDetails.phone_number || "",
          website: data.practiceDetails.website || "",
          logoUrl: data.practiceDetails.logo_url || ""
        })
      }
    } catch (error) {
      console.error("Failed to load practice details:", error)
    }
  }

  const savePracticeDetails = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/employer/practice-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          practiceName: practiceDetails.practiceName,
          streetAddress: practiceDetails.streetAddress,
          suburb: practiceDetails.suburb,
          postcode: practiceDetails.postcode,
          state: practiceDetails.state,
          phoneNumber: practiceDetails.phoneNumber,
          website: practiceDetails.website,
          logoUrl: practiceDetails.logoUrl
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Practice details saved successfully!",
        })
      } else {
        throw new Error(data.error || "Failed to save practice details")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save practice details",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const fetchMyJobs = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/jobs/my-jobs", { credentials: "include" })
        const data = await response.json()
        setEmployerJobs(data.jobs || [])
      } catch (error) {
        setEmployerJobs([])
      } finally {
        setLoading(false)
      }
    }
    fetchMyJobs()
  }, [showJobForm]) // refetch after posting a job

  const handleLogoUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }
      setPracticeDetails(prev => ({ ...prev, logoUrl: data.url }))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;
    try {
      const response = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to delete job.",
          variant: "destructive"
        })
        return;
      }
      setEmployerJobs((jobs) => jobs.filter((job) => job.id !== jobId));
      toast({
        title: "Success",
        description: "Job deleted successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive"
      })
    }
  };

  const handlePracticeDetailChange = (field: keyof PracticeDetails, value: string) => {
    setPracticeDetails(prev => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <SEO 
        title="Employer Dashboard - AlliedHealthJobs.au"
        description="Manage Your Allied Health Job Listings, Practice Details, and Recruitment Campaigns. Post Jobs and Find Qualified Healthcare Professionals."
        keywords={[
          'Employer Dashboard',
          'Job Management',
          'Recruitment Dashboard',
          'Hire Healthcare Professionals',
          'Allied Health Recruitment'
        ]}
        url="/employer"
        type="website"
      />
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Sidebar removed. Main content now full width. */}
        <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
          {/* User bar at top right */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-4 bg-gradient-to-r from-gray-100/80 via-white/80 to-gray-100/80 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 rounded-xl px-6 py-3 shadow-lg min-w-[340px]">
              <div className="w-12 h-12 bg-gray-300 dark:bg-zinc-700 rounded-full flex items-center justify-center text-xl font-semibold shadow">
                <span className="text-gray-700 dark:text-gray-300">{user ? user.name.charAt(0).toUpperCase() : "?"}</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-base font-bold text-gray-900 dark:text-white truncate">{user ? user.name : "Not signed in"}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{user ? user.email : ""}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white h-9 w-9"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Post a New Job</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Create a new job listing to attract qualified allied health professionals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2"
                  onClick={() => setShowJobForm(true)}
                >
                  <PlusCircle className="h-5 w-5" />
                  Post Job
                </Button>
              </CardContent>
            </Card>

            {/* Job Listings - now outside of a Card, full width */}
            {loading ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading your job listings...</div>
            ) : employerJobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  No Job Listings Yet. Post your first job to start attracting qualified Allied health professionals.
                </p>
                <Button
                  className="bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2"
                  onClick={() => setShowJobForm(true)}
                >
                  <PlusCircle className="h-5 w-5" />
                  Post Your First Job
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {employerJobs.map((job) => (
                  <EmployerJobListing key={job.id} job={job} onDelete={handleDeleteJob} />
                ))}
              </div>
            )}

            <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Practice Details</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Manage your practice information and branding. These details will be auto-filled in your job postings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label htmlFor="logo-upload" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                    Logo Upload (optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center border border-gray-300 dark:border-zinc-700">
                      {practiceDetails.logoUrl ? (
                        <img
                          src={practiceDetails.logoUrl}
                          alt="Logo preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 dark:bg-zinc-700 rounded"></div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-2"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4" />
                      {uploading ? 'Uploading...' : 'Upload Logo'}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleLogoUpload(file)
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">PNG, JPG, up to 5MB</p>
                </div>

                <div>
                  <label htmlFor="practice-name" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                    Practice Name
                  </label>
                  <Input
                    id="practice-name"
                    placeholder="e.g., Elite Physio Clinic"
                    value={practiceDetails.practiceName}
                    onChange={(e) => handlePracticeDetailChange("practiceName", e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="street-address"
                    className="text-sm font-medium text-gray-900 dark:text-white mb-2 block"
                  >
                    Street Address
                  </label>
                  <Input
                    id="street-address"
                    placeholder="e.g., 123 Main St"
                    value={practiceDetails.streetAddress}
                    onChange={(e) => handlePracticeDetailChange("streetAddress", e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="suburb" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                      Suburb
                    </label>
                    <Input
                      id="suburb"
                      placeholder="e.g., Sydney"
                      value={practiceDetails.suburb}
                      onChange={(e) => handlePracticeDetailChange("suburb", e.target.value)}
                      className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="postcode" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                      Postcode
                    </label>
                    <Input
                      id="postcode"
                      placeholder="e.g., 2000"
                      value={practiceDetails.postcode}
                      onChange={(e) => handlePracticeDetailChange("postcode", e.target.value)}
                      className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="state-employer"
                    className="text-sm font-medium text-gray-900 dark:text-white mb-2 block"
                  >
                    State
                  </label>
                  <Select value={practiceDetails.state} onValueChange={(value) => handlePracticeDetailChange("state", value)}>
                    <SelectTrigger
                      id="state-employer"
                      className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                    >
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white">
                      <SelectItem
                        value="nsw"
                        className="focus:bg-violet-50 dark:focus:bg-transparent focus:text-violet-900 dark:focus:text-white focus:ring-2 focus:ring-violet-600 focus:outline-none"
                      >
                        NSW
                      </SelectItem>
                      <SelectItem
                        value="vic"
                        className="focus:bg-violet-50 dark:focus:bg-transparent focus:text-violet-900 dark:focus:text-white focus:ring-2 focus:ring-violet-600 focus:outline-none"
                      >
                        VIC
                      </SelectItem>
                      <SelectItem
                        value="qld"
                        className="focus:bg-violet-50 dark:focus:bg-transparent focus:text-violet-900 dark:focus:text-white focus:ring-2 focus:ring-violet-600 focus:outline-none"
                      >
                        QLD
                      </SelectItem>
                      <SelectItem
                        value="sa"
                        className="focus:bg-violet-50 dark:focus:bg-transparent focus:text-violet-900 dark:focus:text-white focus:ring-2 focus:ring-violet-600 focus:outline-none"
                      >
                        SA
                      </SelectItem>
                      <SelectItem
                        value="wa"
                        className="focus:bg-violet-50 dark:focus:bg-transparent focus:text-violet-900 dark:focus:text-white focus:ring-2 focus:ring-violet-600 focus:outline-none"
                      >
                        WA
                      </SelectItem>
                      <SelectItem
                        value="tas"
                        className="focus:bg-violet-50 dark:focus:bg-transparent focus:text-violet-900 dark:focus:text-white focus:ring-2 focus:ring-violet-600 focus:outline-none"
                      >
                        TAS
                      </SelectItem>
                      <SelectItem
                        value="act"
                        className="focus:bg-violet-50 dark:focus:bg-transparent focus:text-violet-900 dark:focus:text-white focus:ring-2 focus:ring-violet-600 focus:outline-none"
                      >
                        ACT
                      </SelectItem>
                      <SelectItem
                        value="nt"
                        className="focus:bg-violet-50 dark:focus:bg-transparent focus:text-violet-900 dark:focus:text-white focus:ring-2 focus:ring-violet-600 focus:outline-none"
                      >
                        NT
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="phone-number" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                    Phone Number
                  </label>
                  <Input
                    id="phone-number"
                    placeholder="e.g., 0412 345 678"
                    value={practiceDetails.phoneNumber}
                    onChange={(e) => handlePracticeDetailChange("phoneNumber", e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                    Website (optional)
                  </label>
                  <Input
                    id="website"
                    placeholder="e.g., www.yourpractice.com.au"
                    value={practiceDetails.website}
                    onChange={(e) => handlePracticeDetailChange("website", e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>

                <Button 
                  className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white"
                  onClick={savePracticeDetails}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Details'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {showJobForm && <JobPostingForm onClose={() => setShowJobForm(false)} />}
      </div>
    </>
  )
}
