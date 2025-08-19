"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LocationAutocomplete } from "@/components/location-autocomplete"
import { useJobs } from "@/hooks/use-jobs"
import { Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { parseLocation } from "@/lib/location-matcher"
import { AustralianAddressAutocomplete } from "@/components/australian-address-autocomplete"

interface JobPostingFormProps {
  onClose: () => void
}

interface PracticeDetails {
  practice_name: string;
  street_address: string;
  suburb: string;
  postcode: string;
  state: string;
  phone_number: string;
  website: string;
  logo_url: string;
}

const jobTypes = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
  { value: "casual", label: "Casual" },
]

const jobCategories = [
  { value: "physiotherapy", label: "Physiotherapy" },
  { value: "occupational-therapy", label: "Occupational Therapy" },
  { value: "speech-pathology", label: "Speech Pathology" },
  { value: "psychology", label: "Psychology" },
  { value: "dietetics-nutrition", label: "Dietetics & Nutrition" },
  { value: "social-work", label: "Social Work" },
  { value: "podiatry", label: "Podiatry" },
  { value: "audiology", label: "Audiology" },
  { value: "exercise-physiology", label: "Exercise Physiology" },
  { value: "optometry", label: "Optometry" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "radiography", label: "Radiography" },
]

const experienceLevels = [
  { value: "graduate", label: "Graduate/New Graduate" },
  { value: "junior", label: "Junior (1-2 years)" },
  { value: "mid", label: "Mid Level (3-5 years)" },
  { value: "senior", label: "Senior (5+ years)" },
  { value: "lead", label: "Lead/Management" },
]

const workSettings = [
  { value: "private-practice", label: "Private Practice" },
  { value: "hospital", label: "Hospital" },
  { value: "community-health", label: "Community Health" },
  { value: "aged-care", label: "Aged Care" },
  { value: "disability-services", label: "Disability Services" },
  { value: "mental-health", label: "Mental Health" },
  { value: "paediatrics", label: "Paediatrics" },
  { value: "rehabilitation", label: "Rehabilitation" },
  { value: "home-care", label: "Home Care" },
]

const salaryRanges = [
  { value: "40000-50000", label: "$40,000 - $50,000" },
  { value: "50000-60000", label: "$50,000 - $60,000" },
  { value: "60000-70000", label: "$60,000 - $70,000" },
  { value: "70000-80000", label: "$70,000 - $80,000" },
  { value: "80000-90000", label: "$80,000 - $90,000" },
  { value: "90000-100000", label: "$90,000 - $100,000" },
  { value: "100000-120000", label: "$100,000 - $120,000" },
  { value: "120000+", label: "$120,000+" },
  { value: "hourly-50-70", label: "$50 - $70 per hour" },
  { value: "hourly-70-90", label: "$70 - $90 per hour" },
  { value: "hourly-90-110", label: "$90 - $110 per hour" },
  { value: "hourly-110+", label: "$110+ per hour" },
]

export function JobPostingForm({ onClose }: JobPostingFormProps) {
  const { createJob } = useJobs()
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    practiceEmail: "",
    jobTitle: "",
    practiceLocation: "",
    locationDisplay: "",
    locationLat: 0,
    locationLng: 0,
    city: "",
    state: "",
    jobType: "",
    jobCategories: "" as string, // Changed to string for single select
    experienceLevel: "",
    workSetting: "",
    salaryRange: "",
    jobDetails: "",
    companyName: "",
    contactPhone: "",
    contactEmail: "",
    companyWebsite: "",
    acceptTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoUrl, setLogoUrl] = useState<string>("")
  const [logoPreview, setLogoPreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const locationInputRef = useRef<HTMLInputElement>(null)

  // Refs for form fields to enable scrolling to errors
  const practiceEmailRef = useRef<HTMLInputElement>(null)
  const jobTitleRef = useRef<HTMLInputElement>(null)
  const practiceLocationRef = useRef<HTMLInputElement>(null)
  const jobTypeRef = useRef<HTMLButtonElement>(null)
  const jobCategoriesRef = useRef<HTMLButtonElement>(null)
  const experienceLevelRef = useRef<HTMLButtonElement>(null)
  const jobDetailsRef = useRef<HTMLTextAreaElement>(null)
  const companyNameRef = useRef<HTMLInputElement>(null)
  const contactPhoneRef = useRef<HTMLInputElement>(null)
  const contactEmailRef = useRef<HTMLInputElement>(null)
  const acceptTermsRef = useRef<HTMLButtonElement>(null)

  // Check authentication and load practice details
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to post a job.",
        variant: "destructive",
      })
      onClose()
      router.push("/sign-in")
      return
    }

    loadPracticeDetails()
  }, [user, onClose, router, toast])

  const loadPracticeDetails = async () => {
    try {
      console.log("Loading practice details for user:", user?.email)
      const response = await fetch("/api/employer/practice-details", {
        credentials: "include"
      })
      const data = await response.json()
      console.log("Practice details response:", data)
      
      if (data.success && data.practiceDetails) {
        const details: PracticeDetails = data.practiceDetails
        console.log("Practice details found:", details)
        
        // Auto-fill form with practice details
        const updatedFormData = {
          ...formData,
          practiceEmail: user?.email || "",
          companyName: details.practice_name || "",
          contactPhone: details.phone_number || "",
          contactEmail: user?.email || "",
          companyWebsite: details.website || "",
        }
        console.log("Setting form data to:", updatedFormData)
        setFormData(updatedFormData)
        
        // Set logo if available
        if (details.logo_url) {
          setLogoUrl(details.logo_url)
        }
        
        // Set location if available
        if (details.suburb && details.state) {
          const locationDisplay = `${details.suburb}, ${details.state.toUpperCase()}`
          handleLocationChange(locationDisplay)
        }
      } else {
        console.log("No practice details found, using default values")
        // Set at least the email if no practice details
        setFormData(prev => ({
          ...prev,
          practiceEmail: user?.email || "",
          contactEmail: user?.email || "",
        }))
      }
    } catch (error) {
      console.error("Failed to load practice details:", error)
      // Set at least the email on error
      setFormData(prev => ({
        ...prev,
        practiceEmail: user?.email || "",
        contactEmail: user?.email || "",
      }))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleLocationChange = (value: string, addressDetails?: any) => {
    // Parse the location input
    const locationMatch = parseLocation(value)
    
    // Extract city and state from the value if parser didn't find them
    let city = locationMatch.normalizedCity;
    let state = locationMatch.normalizedState;
    
    // If parser didn't extract city/state, try to extract from the value
    if (!city || !state) {
      if (value.includes(',')) {
        const parts = value.split(',').map(part => part.trim());
        if (parts.length >= 2) {
          city = city || parts[0].toLowerCase().replace(/\s+/g, '-');
          state = state || parts[1].toLowerCase().replace(/\s+/g, '-');
        } else {
          city = city || value.toLowerCase().replace(/\s+/g, '-');
        }
      } else {
        city = city || value.toLowerCase().replace(/\s+/g, '-');
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      practiceLocation: value,
      locationDisplay: value,
      city: city,
      state: state,
      locationLat: addressDetails?.latitude || 0,
      locationLng: addressDetails?.longitude || 0,
    }))
  }

  const handleLogoUpload = async (file: File) => {
    // Show local preview immediately
    const previewUrl = URL.createObjectURL(file)
    setLogoPreview(previewUrl)
    setLogoFile(file)
    
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      console.log("Uploading logo file:", file.name, file.size)
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      
      console.log("Upload response status:", response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Upload failed with status ${response.status}`)
      }
      
      const data = await response.json()
      console.log("Upload successful:", data)
      
      setLogoUrl(data.url)
      // Keep the preview for a moment, then clear it
      setTimeout(() => setLogoPreview(""), 1000)
      
      // Reset file input so the same file can be re-uploaded if needed
      if (fileInputRef.current) fileInputRef.current.value = ""
      
      toast({
        title: "Logo uploaded successfully",
        description: "Your company logo has been uploaded.",
        duration: 2000,
      })
      
    } catch (error) {
      console.error("Logo upload failed:", error)
      
      // Don't clear the preview on error - let user see what they selected
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload logo. Please try again.",
        variant: "destructive",
        duration: 4000,
      })
    }
  }

  // Helper function to normalize strings for database storage
  const normalizeString = (str: string) => {
    return str.trim().toLowerCase().replace(/\s+/g, '-')
  }

  const scrollToFirstError = () => {
    const errorFields = [
      { field: 'practiceEmail', ref: practiceEmailRef },
      { field: 'jobTitle', ref: jobTitleRef },
      { field: 'practiceLocation', ref: practiceLocationRef },
      { field: 'jobType', ref: jobTypeRef },
      { field: 'jobCategories', ref: jobCategoriesRef },
      { field: 'experienceLevel', ref: experienceLevelRef },
      { field: 'jobDetails', ref: jobDetailsRef },
      { field: 'companyName', ref: companyNameRef },
      { field: 'contactPhone', ref: contactPhoneRef },
      { field: 'contactEmail', ref: contactEmailRef },
      { field: 'acceptTerms', ref: acceptTermsRef },
    ]

    for (const { field, ref } of errorFields) {
      if (errors[field] && ref.current) {
        ref.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
        ref.current.focus()
        break
      }
    }
  }

  const validateForm = () => {
    console.log("=== Form Validation ===")
    console.log("Current form data:", formData)
    
    const newErrors: Record<string, string> = {}
    
    // Email validation
    if (!formData.practiceEmail) {
      newErrors.practiceEmail = "Practice email is required"
      console.log("❌ Missing: practiceEmail")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.practiceEmail)) {
      newErrors.practiceEmail = "Please enter a valid email address"
      console.log("❌ Invalid: practiceEmail format")
    }
    
    if (!formData.jobTitle) {
      newErrors.jobTitle = "Job title is required"
      console.log("❌ Missing: jobTitle")
    } else if (formData.jobTitle.trim().length < 3) {
      newErrors.jobTitle = "Job title must be at least 3 characters"
      console.log("❌ Invalid: jobTitle too short")
    }
    
    if (!formData.practiceLocation) {
      newErrors.practiceLocation = "Practice location is required"
      console.log("❌ Missing: practiceLocation")
    }
    
    if (!formData.jobType) {
      newErrors.jobType = "Job type is required"
      console.log("❌ Missing: jobType")
    }
    
    if (!formData.jobCategories) { // Changed to check if jobCategories is empty string
      newErrors.jobCategories = "At least one job category is required"
      console.log("❌ Missing: jobCategories")
    }
    
    if (!formData.experienceLevel) {
      newErrors.experienceLevel = "Experience level is required"
      console.log("❌ Missing: experienceLevel")
    }
    
    if (!formData.jobDetails) {
      newErrors.jobDetails = "Job details are required"
      console.log("❌ Missing: jobDetails")
    } else if (formData.jobDetails.trim().length < 50) {
      newErrors.jobDetails = "Job details must be at least 50 characters"
      console.log("❌ Invalid: jobDetails too short")
    }
    
    if (!formData.companyName) {
      newErrors.companyName = "Company name is required"
      console.log("❌ Missing: companyName")
    }
    
    if (!formData.contactPhone) {
      newErrors.contactPhone = "Contact phone is required"
      console.log("❌ Missing: contactPhone")
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.contactPhone)) {
      newErrors.contactPhone = "Please enter a valid phone number"
      console.log("❌ Invalid: contactPhone format")
    }
    
    if (!formData.contactEmail) {
      newErrors.contactEmail = "Contact email is required"
      console.log("❌ Missing: contactEmail")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address"
      console.log("❌ Invalid: contactEmail format")
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions"
      console.log("❌ Missing: acceptTerms")
    }
    
    console.log("Validation errors:", newErrors)
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      console.log("❌ Form validation failed with", Object.keys(newErrors).length, "errors")
      // Scroll to first error after a brief delay to ensure DOM is updated
      setTimeout(scrollToFirstError, 100)
      return false
    }
    
    console.log("✅ Form validation passed")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submission started")
    console.log("Form data:", formData)
    console.log("Form data keys:", Object.keys(formData))
    console.log("Form data values:", Object.values(formData))
    
    if (!validateForm()) {
      console.log("Form validation failed")
      return
    }
    
    console.log("Form validation passed, redirecting to Stripe checkout...")
    setIsSubmitting(true)
    
    try {
      const normalizedCity = normalizeString(formData.city || '')
      const normalizedState = normalizeString(formData.state || '')
      const normalizedCategories = normalizeString(formData.jobCategories) // Changed to normalizeString
      
      console.log("Normalized data:", { normalizedCity, normalizedState, normalizedCategories })
      
      // Prepare job data but don't create it yet
      const jobData = {
        practice_email: formData.practiceEmail,
        job_title: formData.jobTitle,
        practice_location: formData.practiceLocation,
        location_display: formData.locationDisplay,
        location_lat: formData.locationLat,
        location_lng: formData.locationLng,
        city: normalizedCity,
        state: normalizedState,
        job_type: formData.jobType,
        job_categories: normalizedCategories, // Changed to normalizedCategories
        experience_level: formData.experienceLevel,
        work_setting: formData.workSetting,
        salary_range: formData.salaryRange,
        job_details: formData.jobDetails,
        company_name: formData.companyName,
        contact_phone: formData.contactPhone,
        contact_email: formData.contactEmail,
        company_website: formData.companyWebsite,
        company_logo_url: logoUrl || "/placeholder.svg?height=40&width=40&text=Logo",
        payment_status: 'pending' as const,
      }
      
      console.log("Job data prepared:", jobData)
      console.log("Creating Stripe checkout session...")
      
      // Store job data temporarily and redirect to Stripe checkout
      await redirectToStripeCheckout(jobData, formData.jobTitle)
      
    } catch (error) {
      console.error("Failed to setup payment:", error)
      toast({
        title: "Payment setup failed.",
        description: "Please try again.",
        variant: "destructive",
        duration: 4000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const redirectToStripeCheckout = async (jobData: any, jobTitle: string) => {
    try {
      console.log("Creating checkout session for job:", { jobTitle })
      
      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          jobData, // Send the entire job data
          jobTitle,
          amount: 100, // This amount is hardcoded for now, will be dynamic later
          currency: 'aud'
        }),
      })

      const data = await response.json()
      console.log("Checkout session response:", { status: response.status, data })

      if (!response.ok) {
        if (data.requiresPayment === false) {
          // No payment required, create job directly
          const job = await createJob(jobData)
          console.log("Job created successfully (no payment required):", job)
          toast({
            title: "Job posted successfully!",
            description: "Your job listing is now live.",
            duration: 4000,
          })
          onClose()
          return
        }
        
        // Show detailed error message
        const errorMessage = data.details || data.error || "Failed to create checkout session"
        throw new Error(errorMessage)
      }

      if (data.requiresPayment === false) {
        // No payment required, create job directly
        const job = await createJob(jobData)
        console.log("Job created successfully (no payment required):", job)
        toast({
          title: "Job posted successfully!",
          description: "Your job listing is now live.",
          duration: 4000,
        })
        onClose()
        return
      }

      // Redirect to Stripe Checkout
      if (data.checkoutUrl) {
        console.log("Redirecting to Stripe Checkout:", data.checkoutUrl)
        // Store job data in sessionStorage for retrieval after payment
        sessionStorage.setItem('pendingJobData', JSON.stringify(jobData))
        window.location.href = data.checkoutUrl
      } else {
        throw new Error("No checkout URL received")
      }

    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast({
        title: "Payment setup failed.",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
        duration: 4000,
      })
    }
  }

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment failed.",
      description: error,
      variant: "destructive",
      duration: 4000,
    })
  }

  const handlePaymentCancel = () => {
    // Payment form popup is no longer used
  }

  // Defensive: ensure select values are valid
  const jobTypeOptions = jobTypes.map(j => j.value);
  const experienceLevelOptions = experienceLevels.map(e => e.value);
  const workSettingOptions = workSettings.map(w => w.value);
  const salaryRangeOptions = salaryRanges.map(s => s.value);

  const jobTypeValue = jobTypeOptions.includes(formData.jobType) ? formData.jobType : "";
  const experienceLevelValue = experienceLevelOptions.includes(formData.experienceLevel) ? formData.experienceLevel : "";
  const workSettingValue = workSettingOptions.includes(formData.workSetting) ? formData.workSetting : "";
  const salaryRangeValue = salaryRangeOptions.includes(formData.salaryRange) ? formData.salaryRange : "";

  // Show loading state while checking authentication and loading practice details
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
        <Card className="mobile-modal bg-white dark:bg-zinc-900 mobile-border">
          <CardContent className="mobile-card">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <Card className="mobile-modal-lg max-h-[90vh] overflow-hidden bg-white dark:bg-zinc-950 mobile-border">
        <CardHeader className="mobile-border mobile-card">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="mobile-text-2xl text-gray-900 dark:text-white">Post a New Job</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Fill out the details below to create your job listing
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="mobile-touch-target">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto scrollbar-thin max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="mobile-space-y mobile-card">
            {/* Practice Information */}
            <div className="mobile-space-y">
              <h3 className="mobile-text-lg font-semibold text-gray-900 dark:text-white">Practice Information</h3>

              <div className="mobile-grid-2 mobile-gap">
                <div>
                  <Label htmlFor="practiceEmail" className="mobile-form-label text-gray-900 dark:text-white">
                    Practice Email *
                  </Label>
                  <Input
                    ref={practiceEmailRef}
                    id="practiceEmail"
                    type="email"
                    value={formData.practiceEmail}
                    onChange={(e) => handleInputChange("practiceEmail", e.target.value)}
                    className={`mobile-form-input bg-white dark:bg-zinc-800 mobile-border ${errors.practiceEmail ? 'mobile-error' : ''}`}
                    placeholder="practice@example.com"
                  />
                  {errors.practiceEmail && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.practiceEmail}</p>}
                </div>

                <div>
                  <Label htmlFor="companyName" className="mobile-form-label text-gray-900 dark:text-white">
                    Company Name *
                  </Label>
                  <Input
                    ref={companyNameRef}
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className={`mobile-form-input bg-white dark:bg-zinc-800 mobile-border ${errors.companyName ? 'mobile-error' : ''}`}
                    placeholder="Your Practice Name"
                  />
                  {errors.companyName && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.companyName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="practiceLocation" className="mobile-form-label text-gray-900 dark:text-white">
                  Practice Location *
                </Label>
                <div className={errors.practiceLocation ? 'mobile-error mobile-rounded' : ''}>
                  <AustralianAddressAutocomplete
                    value={formData.practiceLocation}
                    onChange={handleLocationChange}
                    placeholder="Enter Australian address (e.g., 123 George Street, Sydney NSW 2000)"
                    className={`mobile-form-input bg-white dark:bg-zinc-800 mobile-border ${errors.practiceLocation ? 'mobile-error' : ''}`}
                  />
                </div>
                {errors.practiceLocation && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.practiceLocation}</p>}
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Enter a valid Australian address. The system will validate and format it correctly.
                </p>
              </div>
            </div>

            {/* Job Details */}
            <div className="mobile-space-y">
              <h3 className="mobile-text-lg font-semibold text-gray-900 dark:text-white">Job Details</h3>

              <div>
                <Label htmlFor="jobTitle" className="mobile-form-label text-gray-900 dark:text-white">
                  Job Title *
                </Label>
                <Input
                  ref={jobTitleRef}
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  className={`mobile-form-input bg-white dark:bg-zinc-800 mobile-border ${errors.jobTitle ? 'mobile-error' : ''}`}
                  placeholder="e.g., Senior Physiotherapist"
                />
                {errors.jobTitle && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.jobTitle}</p>}
              </div>

              <div>
                <Label htmlFor="jobDetails" className="mobile-form-label text-gray-900 dark:text-white">
                  Job Details *
                </Label>
                <Textarea
                  ref={jobDetailsRef}
                  id="jobDetails"
                  value={formData.jobDetails}
                  onChange={(e) => handleInputChange("jobDetails", e.target.value)}
                  className={`mobile-form-input bg-white dark:bg-zinc-800 mobile-border min-h-[120px] ${errors.jobDetails ? 'mobile-error' : ''}`}
                  placeholder="Describe the role, responsibilities, and benefits..."
                />
                {errors.jobDetails && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.jobDetails}</p>}
              </div>

              <div className="mobile-grid-2 mobile-gap">
                <div>
                  <Label htmlFor="jobType" className="mobile-form-label text-gray-900 dark:text-white">
                    Job Type *
                  </Label>
                  <Select value={jobTypeValue} onValueChange={(value) => handleInputChange("jobType", value)}>
                    <SelectTrigger 
                      ref={jobTypeRef}
                      className={`mobile-form-input bg-white dark:bg-zinc-800 mobile-border ${errors.jobType ? 'mobile-error' : ''}`}
                    >
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.jobType && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.jobType}</p>}
                </div>

                <div>
                  <Label htmlFor="experienceLevel" className="mobile-form-label text-gray-900 dark:text-white">
                    Experience Level *
                  </Label>
                  <Select
                    value={experienceLevelValue}
                    onValueChange={(value) => handleInputChange("experienceLevel", value)}
                  >
                    <SelectTrigger 
                      ref={experienceLevelRef}
                      className={`mobile-form-input bg-white dark:bg-zinc-800 mobile-border ${errors.experienceLevel ? 'mobile-error' : ''}`}
                    >
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.experienceLevel && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.experienceLevel}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="jobCategories" className="mobile-form-label text-gray-900 dark:text-white">
                  Job Categories *
                </Label>
                <Select
                  value={formData.jobCategories}
                  onValueChange={(value) => handleInputChange("jobCategories", value)}
                >
                  <SelectTrigger 
                    ref={jobCategoriesRef}
                    className={`mobile-form-input bg-white dark:bg-zinc-800 mobile-border ${errors.jobCategories ? 'mobile-error' : ''}`}
                  >
                    <SelectValue placeholder="Select job categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.jobCategories && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.jobCategories}</p>}
              </div>

              <div className="mobile-grid-2 mobile-gap">
                <div>
                  <Label htmlFor="workSetting" className="mobile-form-label text-gray-900 dark:text-white">
                    Work Setting
                  </Label>
                  <Select
                    value={workSettingValue}
                    onValueChange={(value) => handleInputChange("workSetting", value)}
                  >
                    <SelectTrigger className="mobile-form-input bg-white dark:bg-zinc-800 mobile-border">
                      <SelectValue placeholder="Select work setting" />
                    </SelectTrigger>
                    <SelectContent>
                      {workSettings.map((setting) => (
                        <SelectItem key={setting.value} value={setting.value}>
                          {setting.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="salaryRange" className="mobile-form-label text-gray-900 dark:text-white">
                    Salary Range
                  </Label>
                  <Select
                    value={salaryRangeValue}
                    onValueChange={(value) => handleInputChange("salaryRange", value)}
                  >
                    <SelectTrigger className="mobile-form-input bg-white dark:bg-zinc-800 mobile-border">
                      <SelectValue placeholder="Select salary range" />
                    </SelectTrigger>
                    <SelectContent>
                      {salaryRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mobile-space-y">
              <h3 className="mobile-text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>

              <div className="mobile-grid-2 mobile-gap">
                <div>
                  <Label htmlFor="contactPhone" className="mobile-form-label text-gray-900 dark:text-white">
                    Contact Phone *
                  </Label>
                  <Input
                    ref={contactPhoneRef}
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    className={`mobile-form-input bg-white dark:bg-zinc-800 mobile-border ${errors.contactPhone ? 'mobile-error' : ''}`}
                    placeholder="0412 345 678"
                  />
                  {errors.contactPhone && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.contactPhone}</p>}
                </div>

                <div>
                  <Label htmlFor="contactEmail" className="mobile-form-label text-gray-900 dark:text-white">
                    Contact Email *
                  </Label>
                  <Input
                    ref={contactEmailRef}
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    className={`mobile-form-input bg-white dark:bg-zinc-800 mobile-border ${errors.contactEmail ? 'mobile-error' : ''}`}
                    placeholder="contact@example.com"
                  />
                  {errors.contactEmail && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.contactEmail}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="companyWebsite" className="mobile-form-label text-gray-900 dark:text-white">
                  Company Website
                </Label>
                <Input
                  id="companyWebsite"
                  type="url"
                  value={formData.companyWebsite}
                  onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
                  className="mobile-form-input bg-white dark:bg-zinc-800 mobile-border"
                  placeholder="https://www.yourpractice.com.au"
                />
              </div>
            </div>

            {/* Company Logo */}
            <div className="mobile-space-y">
              <div>
                <label htmlFor="logo-upload" className="mobile-form-label text-gray-900 dark:text-white mb-2 block">
                  Company Logo (optional)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 mobile-rounded flex items-center justify-center mobile-border">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-cover mobile-rounded"
                      />
                    ) : (logoUrl ? (
                      <img
                        src={logoUrl || "/placeholder.svg"}
                        alt="Logo preview"
                        className="w-full h-full object-cover mobile-rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 dark:bg-zinc-700 mobile-rounded"></div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="mobile-button bg-white dark:bg-zinc-800 mobile-border text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                    {(logoPreview || logoUrl) && (
                      <Button
                        type="button"
                        variant="outline"
                        className="mobile-button bg-red-50 dark:bg-red-900/20 mobile-border text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center gap-2"
                        onClick={() => {
                          setLogoPreview("")
                          setLogoUrl("")
                          setLogoFile(null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ""
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                        Remove Logo
                      </Button>
                    )}
                  </div>
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
            </div>

            {/* Terms and Conditions */}
            <div className="mobile-space-y">
              <div className="flex items-start space-x-2">
                <Checkbox
                  ref={acceptTermsRef}
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange("acceptTerms", checked)}
                  className={errors.acceptTerms ? 'mobile-error' : ''}
                />
                <Label htmlFor="acceptTerms" className="text-sm text-gray-900 dark:text-white leading-relaxed">
                  I accept the terms and conditions and privacy policy. I understand that job postings are subject to
                  review and approval. *
                </Label>
              </div>
              {errors.acceptTerms && <p className="text-red-500 text-sm" aria-live="polite">{errors.acceptTerms}</p>}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 mobile-border-t">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent mobile-button">
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white mobile-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Post Job & Pay"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
