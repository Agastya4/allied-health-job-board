import OccupationJobPageClient from "./OccupationJobPageClient"
import { Metadata } from "next"

const occupationData = {
  "physiotherapy": {
    name: "Physiotherapy",
    description: "Find physiotherapy jobs across Australia. Browse physiotherapist positions in hospitals, clinics, and private practices.",
    keywords: ["physiotherapy jobs", "physiotherapist jobs", "physical therapy jobs", "rehabilitation jobs", "allied health physiotherapy"]
  },
  "occupational-therapy": {
    name: "Occupational Therapy", 
    description: "Discover occupational therapy jobs in Australia. Find OT positions helping patients with daily living skills and independence.",
    keywords: ["occupational therapy jobs", "OT jobs", "occupational therapist jobs", "rehabilitation jobs", "allied health OT"]
  },
  "speech-pathology": {
    name: "Speech Pathology",
    description: "Browse speech pathology jobs across Australia. Find speech therapist positions in healthcare and education settings.",
    keywords: ["speech pathology jobs", "speech therapy jobs", "speech therapist jobs", "communication disorders", "allied health speech"]
  },
  "psychology": {
    name: "Psychology",
    description: "Find psychology jobs in Australia. Browse psychologist positions in mental health, clinical, and research settings.",
    keywords: ["psychology jobs", "psychologist jobs", "mental health jobs", "clinical psychology", "allied health psychology"]
  },
  "dietetics-nutrition": {
    name: "Dietetics & Nutrition",
    description: "Discover dietetics and nutrition jobs across Australia. Find dietitian positions in healthcare and wellness.",
    keywords: ["dietetics jobs", "nutrition jobs", "dietitian jobs", "nutritionist jobs", "allied health nutrition"]
  },
  "social-work": {
    name: "Social Work",
    description: "Browse social work jobs in Australia. Find social worker positions in community services and healthcare.",
    keywords: ["social work jobs", "social worker jobs", "community services", "welfare jobs", "allied health social work"]
  },
  "podiatry": {
    name: "Podiatry",
    description: "Find podiatry jobs across Australia. Browse podiatrist positions specializing in foot and lower limb health.",
    keywords: ["podiatry jobs", "podiatrist jobs", "foot health jobs", "lower limb specialist", "allied health podiatry"]
  },
  "audiology": {
    name: "Audiology",
    description: "Discover audiology jobs in Australia. Find audiologist positions in hearing and balance disorders.",
    keywords: ["audiology jobs", "audiologist jobs", "hearing specialist jobs", "balance disorders", "allied health audiology"]
  },
  "exercise-physiology": {
    name: "Exercise Physiology",
    description: "Browse exercise physiology jobs across Australia. Find exercise physiologist positions in fitness and rehabilitation.",
    keywords: ["exercise physiology jobs", "exercise physiologist jobs", "fitness jobs", "rehabilitation jobs", "allied health exercise"]
  },
  "optometry": {
    name: "Optometry",
    description: "Find optometry jobs in Australia. Browse optometrist positions in eye care and vision health.",
    keywords: ["optometry jobs", "optometrist jobs", "eye care jobs", "vision health", "allied health optometry"]
  },
  "pharmacy": {
    name: "Pharmacy",
    description: "Discover pharmacy jobs across Australia. Find pharmacist positions in medication and pharmaceutical care.",
    keywords: ["pharmacy jobs", "pharmacist jobs", "medication jobs", "pharmaceutical care", "allied health pharmacy"]
  },
  "radiography": {
    name: "Radiography",
    description: "Browse radiography jobs in Australia. Find radiographer positions in medical imaging and diagnostics.",
    keywords: ["radiography jobs", "radiographer jobs", "medical imaging jobs", "diagnostic imaging", "allied health radiography"]
  }
}

export async function generateMetadata({ params }: { params: Promise<{ occupation: string }> }): Promise<Metadata> {
  const { occupation } = await params
  const data = occupationData[occupation as keyof typeof occupationData]
  
  if (!data) {
    return {
      title: `${occupation} Jobs - AlliedHealthJobs.au`,
      description: `Find ${occupation} jobs across Australia. Browse allied health positions in this specialized field.`,
    }
  }

  const title = `${data.name} Jobs Australia - Find ${data.name} Positions`
  const description = data.description
  const keywords = data.keywords

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://alliedhealthjobs.au/jobs/occupation/${occupation}`,
      siteName: 'AlliedHealthJobs.au',
      images: [
        {
          url: '/Logo.png',
          width: 1200,
          height: 630,
          alt: `${data.name} Jobs`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/Logo.png'],
    },
    alternates: {
      canonical: `https://alliedhealthjobs.au/jobs/occupation/${occupation}`,
    },
  }
}

export default async function OccupationJobPage({ params }: { params: Promise<{ occupation: string }> }) {
  const { occupation } = await params
  return <OccupationJobPageClient occupation={occupation} />
} 