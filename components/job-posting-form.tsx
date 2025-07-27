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
import { MultiSelect } from "@/components/multi-select"
import { useJobs } from "@/hooks/use-jobs"
import { Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { PaymentForm } from "@/components/payment-form"

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
    jobCategories: [] as string[],
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
  const [showPayment, setShowPayment] = useState(false)
  const [createdJobId, setCreatedJobId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      const response = await fetch("/api/employer/practice-details", {
        credentials: "include"
      })
      const data = await response.json()
      
      if (data.success && data.practiceDetails) {
        const details: PracticeDetails = data.practiceDetails
        
        // Auto-fill form with practice details
        setFormData(prev => ({
          ...prev,
          practiceEmail: user?.email || "",
          companyName: details.practice_name || "",
          contactPhone: details.phone_number || "",
          contactEmail: user?.email || "",
          companyWebsite: details.website || "",
        }))
        
        // Set logo if available
        if (details.logo_url) {
          setLogoUrl(details.logo_url)
        }
        
        // Set location if available
        if (details.suburb && details.state) {
          const locationDisplay = `${details.suburb}, ${details.state.toUpperCase()}`
          setFormData(prev => ({
            ...prev,
            practiceLocation: locationDisplay,
            locationDisplay: locationDisplay,
            city: details.suburb.toLowerCase().replace(/\s+/g, '-'),
            state: details.state.toLowerCase(),
          }))
        }
      }
    } catch (error) {
      console.error("Failed to load practice details:", error)
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

  const handleLocationChange = (value: string, lat?: number, lng?: number) => {
    // Extract city and state from the full address
    let city = ""
    let state = ""
    
    // Split the address into parts
    const parts = value.split(",").map(s => s.trim())
    
    // State abbreviations and full names with mapping to abbreviations
    const stateAbbreviations = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"]
    const stateNames = ["NEW SOUTH WALES", "VICTORIA", "QUEENSLAND", "SOUTH AUSTRALIA", "WESTERN AUSTRALIA", "TASMANIA", "AUSTRALIAN CAPITAL TERRITORY", "NORTHERN TERRITORY"]
    
    // Map full state names to abbreviations
    const stateMap: Record<string, string> = {
      "NEW SOUTH WALES": "nsw",
      "NSW": "nsw",
      "VICTORIA": "vic", 
      "VIC": "vic",
      "QUEENSLAND": "qld",
      "QLD": "qld",
      "SOUTH AUSTRALIA": "sa",
      "SA": "sa",
      "WESTERN AUSTRALIA": "wa",
      "WA": "wa",
      "TASMANIA": "tas",
      "TAS": "tas",
      "AUSTRALIAN CAPITAL TERRITORY": "act",
      "ACT": "act",
      "NORTHERN TERRITORY": "nt",
      "NT": "nt"
    }
    
    // Find the state (look for abbreviation or full name)
    let stateIndex = -1
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i].toUpperCase()
      if (stateAbbreviations.includes(part) || stateNames.includes(part)) {
        state = part
        stateIndex = i
        break
      }
    }
    
    // If state found, extract city from the part before it
    if (stateIndex > 0) {
      city = parts[stateIndex - 1]
    } else if (stateIndex === 0 && parts.length > 1) {
      // State is first, city is second
      city = parts[1]
    } else if (!state && parts.length >= 2) {
      // No state found, try to infer from last two parts
      const lastPart = parts[parts.length - 1].toUpperCase()
      const secondLastPart = parts[parts.length - 2].toUpperCase()
      
      // Check if last part is a state abbreviation
      if (stateAbbreviations.includes(lastPart)) {
        state = lastPart
        city = parts[parts.length - 2]
      } else if (stateAbbreviations.includes(secondLastPart)) {
        state = secondLastPart
        city = parts[parts.length - 1]
      } else {
        // Fallback: assume last part is state, second to last is city
        state = parts[parts.length - 1]
        city = parts[parts.length - 2]
      }
    } else if (!state && parts.length === 1) {
      // Only one part, treat as city
      city = parts[0]
      state = ""
    }
    
    // Clean up city and state
    city = city.replace(/^(street|road|way|drive|avenue|boulevard|place|lane|court|terrace|close|crescent|parade|highway|freeway|motorway)\s+/i, "").trim()
    
    // Normalize state to abbreviation (always lowercase)
    const normalizedState = stateMap[state.toUpperCase()] || state.toLowerCase()
    
    console.log("Location parsing:", {
      original: value,
      parts: parts,
      extractedCity: city,
      extractedState: state,
      normalizedState: normalizedState
    })
    
    setFormData((prev) => ({
      ...prev,
      practiceLocation: value,
      locationDisplay: value,
      locationLat: lat || 0,
      locationLng: lng || 0,
      city: city.toLowerCase().replace(/\s+/g, '-'),
      state: normalizedState,
    }))
  }

  const handleLogoUpload = async (file: File) => {
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

      setLogoUrl(data.url)
      setLogoFile(file)
    } catch (error) {
      console.error("Logo upload failed:", error)
      toast({
        title: "Error",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      })
    }
  }

  const normalizeString = (str: string) => str.trim().toLowerCase().replace(/\s+/g, '-');
  const normalizeCategories = (categories: string[]) => categories.map(normalizeString);

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.practiceEmail) newErrors.practiceEmail = "Practice email is required"
    if (!formData.jobTitle) newErrors.jobTitle = "Job title is required"
    if (!formData.practiceLocation) newErrors.practiceLocation = "Practice location is required"
    if (!formData.city) newErrors.city = "City is required (select a valid location)"
    if (!formData.state) newErrors.state = "State is required (select a valid location)"
    if (!formData.jobType) newErrors.jobType = "Job type is required"
    if (formData.jobCategories.length === 0) newErrors.jobCategories = "At least one job category is required"
    if (!formData.experienceLevel) newErrors.experienceLevel = "Experience level is required"
    if (!formData.jobDetails) newErrors.jobDetails = "Job details are required"
    if (!formData.companyName) newErrors.companyName = "Company name is required"
    if (!formData.contactPhone) newErrors.contactPhone = "Contact phone is required"
    if (!formData.contactEmail) newErrors.contactEmail = "Contact email is required"
    if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the terms and conditions"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      const normalizedCity = normalizeString(formData.city)
      const normalizedState = normalizeString(formData.state)
      const normalizedCategories = normalizeCategories(formData.jobCategories)
      
      // Create job with pending payment status
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
        job_categories: normalizedCategories,
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
      
      const job = await createJob(jobData)
      setCreatedJobId(job.id)
      setShowPayment(true)
      
    } catch (error) {
      console.error("Failed to create job:", error)
      toast({
        title: "Failed to post job.",
        description: "Please try again.",
        variant: "destructive",
        duration: 4000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      if (paymentIntentId === "free") {
        // No payment required, job is already created
        toast({
          title: "Job posted successfully!",
          description: "Your job listing is now live.",
          duration: 4000,
        })
        onClose()
        return
      }

      // Confirm payment with backend
      const response = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          paymentIntentId,
          jobId: createdJobId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to confirm payment")
      }

      toast({
        title: "Payment successful!",
        description: "Your job listing is now live.",
        duration: 4000,
      })
      onClose()
    } catch (error) {
      console.error("Payment confirmation error:", error)
      toast({
        title: "Payment confirmation failed.",
        description: "Please contact support.",
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
    setShowPayment(false)
    setCreatedJobId(null)
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

  // Show payment form if payment is required
  if (showPayment) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
        <PaymentForm
          amount={100} // $1.00 in cents
          currency="aud"
          jobTitle={formData.jobTitle}
          jobId={createdJobId?.toString() || ''}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          onCancel={handlePaymentCancel}
        />
      </div>
    )
  }

  // Show loading state while checking authentication and loading practice details
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
        <Card className="w-full max-w-md bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <CardHeader className="border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">Post a New Job</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Fill out the details below to create your job listing
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto scrollbar-thin max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Practice Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Practice Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="practiceEmail" className="text-gray-900 dark:text-white">
                    Practice Email *
                  </Label>
                  <Input
                    id="practiceEmail"
                    type="email"
                    value={formData.practiceEmail}
                    onChange={(e) => handleInputChange("practiceEmail", e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
                    placeholder="practice@example.com"
                  />
                  {errors.practiceEmail && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.practiceEmail}</p>}
                </div>

                <div>
                  <Label htmlFor="companyName" className="text-gray-900 dark:text-white">
                    Company Name *
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
                    placeholder="Your Practice Name"
                  />
                  {errors.companyName && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.companyName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="practiceLocation" className="text-gray-900 dark:text-white">
                  Practice Location *
                </Label>
                <LocationAutocomplete
                  value={formData.practiceLocation}
                  onChange={handleLocationChange}
                  placeholder="Start typing your location..."
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
                />
                {errors.practiceLocation && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.practiceLocation}</p>}
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Job Details</h3>

              <div>
                <Label htmlFor="jobTitle" className="text-gray-900 dark:text-white">
                  Job Title *
                </Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
                  placeholder="e.g., Senior Physiotherapist"
                />
                {errors.jobTitle && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.jobTitle}</p>}
              </div>

              <div>
                <Label htmlFor="jobDetails" className="text-gray-900 dark:text-white">
                  Job Details *
                </Label>
                <Textarea
                  id="jobDetails"
                  value={formData.jobDetails}
                  onChange={(e) => handleInputChange("jobDetails", e.target.value)}
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 min-h-[120px]"
                  placeholder="Describe the role, responsibilities, and benefits..."
                />
                {errors.jobDetails && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.jobDetails}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobType" className="text-gray-900 dark:text-white">
                    Job Type *
                  </Label>
                  <Select value={jobTypeValue} onValueChange={(value) => handleInputChange("jobType", value)}>
                    <SelectTrigger className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700">
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
                  <Label htmlFor="experienceLevel" className="text-gray-900 dark:text-white">
                    Experience Level *
                  </Label>
                  <Select
                    value={experienceLevelValue}
                    onValueChange={(value) => handleInputChange("experienceLevel", value)}
                  >
                    <SelectTrigger className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700">
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
                <Label className="text-gray-900 dark:text-white">Job Categories *</Label>
                <MultiSelect
                  options={jobCategories}
                  value={formData.jobCategories}
                  onChange={(value) => handleInputChange("jobCategories", value)}
                  placeholder="Select job categories"
                />
                {errors.jobCategories && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.jobCategories}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workSetting" className="text-gray-900 dark:text-white">
                    Work Setting
                  </Label>
                  <Select
                    value={workSettingValue}
                    onValueChange={(value) => handleInputChange("workSetting", value)}
                  >
                    <SelectTrigger className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700">
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
                  <Label htmlFor="salaryRange" className="text-gray-900 dark:text-white">
                    Salary Range
                  </Label>
                  <Select
                    value={salaryRangeValue}
                    onValueChange={(value) => handleInputChange("salaryRange", value)}
                  >
                    <SelectTrigger className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700">
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
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPhone" className="text-gray-900 dark:text-white">
                    Contact Phone *
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
                    placeholder="0412 345 678"
                  />
                  {errors.contactPhone && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.contactPhone}</p>}
                </div>

                <div>
                  <Label htmlFor="contactEmail" className="text-gray-900 dark:text-white">
                    Contact Email *
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
                    placeholder="contact@example.com"
                  />
                  {errors.contactEmail && <p className="text-red-500 text-sm mt-1" aria-live="polite">{errors.contactEmail}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="companyWebsite" className="text-gray-900 dark:text-white">
                  Company Website
                </Label>
                <Input
                  id="companyWebsite"
                  type="url"
                  value={formData.companyWebsite}
                  onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
                  placeholder="https://www.yourpractice.com.au"
                />
              </div>
            </div>

            {/* Company Logo */}
            <div className="space-y-4">
              <div>
                <label htmlFor="logo-upload" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                  Company Logo (optional)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center border border-gray-300 dark:border-zinc-700">
                    {logoUrl ? (
                      <img
                        src={logoUrl || "/placeholder.svg"}
                        alt="Logo preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 dark:bg-zinc-700 rounded"></div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Logo
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
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange("acceptTerms", checked)}
                />
                <Label htmlFor="acceptTerms" className="text-sm text-gray-900 dark:text-white leading-relaxed">
                  I accept the terms and conditions and privacy policy. I understand that job postings are subject to
                  review and approval. *
                </Label>
              </div>
              {errors.acceptTerms && <p className="text-red-500 text-sm" aria-live="polite">{errors.acceptTerms}</p>}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-zinc-800">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting Job..." : "Post Job"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
