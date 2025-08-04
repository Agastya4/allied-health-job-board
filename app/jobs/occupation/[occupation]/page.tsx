import OccupationJobPageClient from "./OccupationJobPageClient"
import { Metadata } from "next"

const occupationData = {
  "physiotherapy": {
    name: "Physiotherapy",
    description: "Find Physiotherapy Jobs Across Australia. Browse Physiotherapist Positions in Hospitals, Clinics, and Private Practices.",
    keywords: ["Physiotherapy Jobs", "Physiotherapist Jobs", "Physical Therapy Jobs", "Rehabilitation Jobs", "Allied Health Physiotherapy"]
  },
  "occupational-therapy": {
    name: "Occupational Therapy", 
    description: "Discover Occupational Therapy Jobs in Australia. Find OT Positions Helping Patients with Daily Living Skills and Independence.",
    keywords: ["Occupational Therapy Jobs", "OT Jobs", "Occupational Therapist Jobs", "Rehabilitation Jobs", "Allied Health OT"]
  },
  "speech-pathology": {
    name: "Speech Pathology",
    description: "Browse Speech Pathology Jobs Across Australia. Find Speech Therapist Positions in Healthcare and Education Settings.",
    keywords: ["Speech Pathology Jobs", "Speech Therapy Jobs", "Speech Therapist Jobs", "Communication Disorders", "Allied Health Speech"]
  },
  "psychology": {
    name: "Psychology",
    description: "Find Psychology Jobs in Australia. Browse Psychologist Positions in Mental Health, Clinical, and Research Settings.",
    keywords: ["Psychology Jobs", "Psychologist Jobs", "Mental Health Jobs", "Clinical Psychology", "Allied Health Psychology"]
  },
  "dietetics-nutrition": {
    name: "Dietetics & Nutrition",
    description: "Discover Dietetics and Nutrition Jobs Across Australia. Find Dietitian Positions in Healthcare and Wellness.",
    keywords: ["Dietetics Jobs", "Nutrition Jobs", "Dietitian Jobs", "Nutritionist Jobs", "Allied Health Nutrition"]
  },
  "social-work": {
    name: "Social Work",
    description: "Browse Social Work Jobs in Australia. Find Social Worker Positions in Community Services and Healthcare.",
    keywords: ["Social Work Jobs", "Social Worker Jobs", "Community Services", "Welfare Jobs", "Allied Health Social Work"]
  },
  "podiatry": {
    name: "Podiatry",
    description: "Find Podiatry Jobs Across Australia. Browse Podiatrist Positions Specializing in Foot and Lower Limb Health.",
    keywords: ["Podiatry Jobs", "Podiatrist Jobs", "Foot Health Jobs", "Lower Limb Specialist", "Allied Health Podiatry"]
  },
  "audiology": {
    name: "Audiology",
    description: "Discover Audiology Jobs in Australia. Find Audiologist Positions in Hearing and Balance Disorders.",
    keywords: ["Audiology Jobs", "Audiologist Jobs", "Hearing Specialist Jobs", "Balance Disorders", "Allied Health Audiology"]
  },
  "exercise-physiology": {
    name: "Exercise Physiology",
    description: "Browse Exercise Physiology Jobs Across Australia. Find Exercise Physiologist Positions in Fitness and Rehabilitation.",
    keywords: ["Exercise Physiology Jobs", "Exercise Physiologist Jobs", "Fitness Jobs", "Rehabilitation Jobs", "Allied Health Exercise"]
  },
  "optometry": {
    name: "Optometry",
    description: "Find Optometry Jobs in Australia. Browse Optometrist Positions in Eye Care and Vision Health.",
    keywords: ["Optometry Jobs", "Optometrist Jobs", "Eye Care Jobs", "Vision Health", "Allied Health Optometry"]
  },
  "pharmacy": {
    name: "Pharmacy",
    description: "Discover Pharmacy Jobs Across Australia. Find Pharmacist Positions in Medication and Pharmaceutical Care.",
    keywords: ["Pharmacy Jobs", "Pharmacist Jobs", "Medication Jobs", "Pharmaceutical Care", "Allied Health Pharmacy"]
  },
  "radiography": {
    name: "Radiography",
    description: "Browse Radiography Jobs in Australia. Find Radiographer Positions in Medical Imaging and Diagnostics.",
    keywords: ["Radiography Jobs", "Radiographer Jobs", "Medical Imaging Jobs", "Diagnostic Imaging", "Allied Health Radiography"]
  }
}

export async function generateMetadata({ params }: { params: Promise<{ occupation: string }> }): Promise<Metadata> {
  const { occupation } = await params
  const data = occupationData[occupation as keyof typeof occupationData]
  
  if (!data) {
    return {
      title: `${occupation.charAt(0).toUpperCase() + occupation.slice(1)} Jobs - AlliedHealthJobs.au`,
      description: `Find ${occupation.charAt(0).toUpperCase() + occupation.slice(1)} Jobs Across Australia. Browse Allied Health Positions in This Specialized Field.`,
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
      canonical: `https://alliedhealthjobs.au/jobs/occupation/${occupation}`,
    },
  }
}

export default async function OccupationJobPage({ params }: { params: Promise<{ occupation: string }> }) {
  const { occupation } = await params
  return <OccupationJobPageClient occupation={occupation} />
} 