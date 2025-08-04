import ProfessionPageClient from "./ProfessionPageClient"
import { Metadata } from "next"

const professionData = {
  "physiotherapy": {
    name: "Physiotherapy",
    title: "Physiotherapy Careers in Australia",
    description: "Discover Rewarding Opportunities in Physiotherapy - A Dynamic Allied Health Profession Focused on Physical Rehabilitation, Movement Science, and Improving Patient Quality of Life Across Australia.",
    keywords: ["Physiotherapy Careers", "Physiotherapist Jobs", "Physical Therapy Careers", "Rehabilitation Jobs", "Allied Health Physiotherapy"]
  },
  "occupational-therapy": {
    name: "Occupational Therapy",
    title: "Occupational Therapy Careers in Australia", 
    description: "Explore Rewarding Careers in Occupational Therapy - Helping People Achieve Independence and Improve Their Quality of Life Through Meaningful Activities and Therapeutic Interventions.",
    keywords: ["Occupational Therapy Careers", "OT Jobs", "Occupational Therapist Careers", "Rehabilitation Jobs", "Allied Health OT"]
  },
  "speech-pathology": {
    name: "Speech Pathology",
    title: "Speech Pathology Careers in Australia",
    description: "Discover Rewarding Careers in Speech Pathology - Helping People Communicate Effectively and Overcome Swallowing Disorders Across All Age Groups.",
    keywords: ["Speech Pathology Careers", "Speech Therapy Jobs", "Speech Therapist Careers", "Communication Disorders", "Allied Health Speech"]
  },
  "psychology": {
    name: "Psychology",
    title: "Psychology Careers in Australia",
    description: "Explore Diverse Career Opportunities in Psychology - From Clinical Practice to Research, Helping Individuals and Communities Achieve Mental Health and Wellbeing.",
    keywords: ["Psychology Careers", "Psychologist Jobs", "Mental Health Careers", "Clinical Psychology", "Allied Health Psychology"]
  },
  "dietetics-nutrition": {
    name: "Dietetics & Nutrition",
    title: "Dietetics & Nutrition Careers in Australia",
    description: "Discover Rewarding Careers in Dietetics and Nutrition - Helping People Achieve Optimal Health Through Evidence-Based Nutrition Advice and Dietary Interventions.",
    keywords: ["Dietetics Careers", "Nutrition Jobs", "Dietitian Careers", "Nutritionist Jobs", "Allied Health Nutrition"]
  },
  "social-work": {
    name: "Social Work",
    title: "Social Work Careers in Australia",
    description: "Explore Meaningful Careers in Social Work - Supporting Individuals, Families, and Communities to Overcome Challenges and Achieve Social Justice.",
    keywords: ["Social Work Careers", "Social Worker Jobs", "Community Services", "Welfare Jobs", "Allied Health Social Work"]
  },
  "podiatry": {
    name: "Podiatry",
    title: "Podiatry Careers in Australia",
    description: "Discover Rewarding Careers in Podiatry - Specializing in Foot and Lower Limb Health, Helping Patients Maintain Mobility and Quality of Life.",
    keywords: ["Podiatry Careers", "Podiatrist Jobs", "Foot Health Jobs", "Lower Limb Specialist", "Allied Health Podiatry"]
  },
  "audiology": {
    name: "Audiology",
    title: "Audiology Careers in Australia",
    description: "Explore Rewarding Careers in Audiology - Helping People with Hearing and Balance Disorders Achieve Better Communication and Quality of Life.",
    keywords: ["Audiology Careers", "Audiologist Jobs", "Hearing Specialist Jobs", "Balance Disorders", "Allied Health Audiology"]
  },
  "exercise-physiology": {
    name: "Exercise Physiology",
    title: "Exercise Physiology Careers in Australia",
    description: "Discover Rewarding Careers in Exercise Physiology - Using Exercise as Medicine to Help People with Chronic Conditions and Injuries.",
    keywords: ["Exercise Physiology Careers", "Exercise Physiologist Jobs", "Fitness Jobs", "Rehabilitation Jobs", "Allied Health Exercise"]
  },
  "optometry": {
    name: "Optometry",
    title: "Optometry Careers in Australia",
    description: "Explore Rewarding Careers in Optometry - Providing Comprehensive Eye Care and Vision Health Services to Patients of All Ages.",
    keywords: ["Optometry Careers", "Optometrist Jobs", "Eye Care Jobs", "Vision Health", "Allied Health Optometry"]
  },
  "pharmacy": {
    name: "Pharmacy",
    title: "Pharmacy Careers in Australia",
    description: "Discover Rewarding Careers in Pharmacy - Providing Medication Expertise and Healthcare Services in Diverse Settings Across Australia.",
    keywords: ["Pharmacy Careers", "Pharmacist Jobs", "Medication Jobs", "Pharmaceutical Care", "Allied Health Pharmacy"]
  },
  "radiography": {
    name: "Radiography",
    title: "Radiography Careers in Australia",
    description: "Explore Rewarding Careers in Radiography - Providing Essential Medical Imaging Services for Diagnosis and Treatment Across Healthcare Settings.",
    keywords: ["Radiography Careers", "Radiographer Jobs", "Medical Imaging Jobs", "Diagnostic Imaging", "Allied Health Radiography"]
  }
}

export async function generateMetadata({ params }: { params: Promise<{ profession: string }> }): Promise<Metadata> {
  const { profession } = await params
  const data = professionData[profession as keyof typeof professionData]
  
  if (!data) {
    return {
      title: `${profession.charAt(0).toUpperCase() + profession.slice(1)} Careers - AlliedHealthJobs.au`,
      description: `Explore ${profession.charAt(0).toUpperCase() + profession.slice(1)} Careers in Australia. Learn About This Allied Health Profession and Job Opportunities.`,
    }
  }

  const title = data.title
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
      url: `https://alliedhealthjobs.au/career-info/${profession}`,
      siteName: 'AlliedHealthJobs.au',
      images: [
        {
          url: '/Logo.png',
          width: 1200,
          height: 630,
          alt: `${data.name} Careers`,
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
      canonical: `https://alliedhealthjobs.au/career-info/${profession}`,
    },
  }
}

export default async function ProfessionPage({ params }: { params: Promise<{ profession: string }> }) {
  const { profession } = await params
  return <ProfessionPageClient profession={profession} />
} 