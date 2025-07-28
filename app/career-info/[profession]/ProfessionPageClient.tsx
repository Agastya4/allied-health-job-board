"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  GraduationCap, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Users, 
  Clock,
  ArrowRight,
  CheckCircle,
  ArrowLeft
} from "lucide-react"
import { notFound } from "next/navigation"

const professionData = {
  "physiotherapy": {
    name: "Physiotherapy",
    title: "Physiotherapy Careers in Australia",
    description: "Discover rewarding opportunities in physiotherapy - a dynamic allied health profession focused on physical rehabilitation, movement science, and improving patient quality of life across Australia.",
    longDescription: "Physiotherapy is a healthcare profession that focuses on the assessment, diagnosis, treatment, and prevention of physical impairments, disabilities, and pain. Physiotherapists use evidence-based techniques to help patients recover from injuries, manage chronic conditions, and improve their overall physical function and quality of life.",
    responsibilities: [
      "Physical assessment and diagnosis",
      "Treatment planning and implementation", 
      "Exercise prescription and rehabilitation",
      "Manual therapy and hands-on treatment",
      "Patient education and prevention"
    ],
    specializations: [
      "Sports Physiotherapy", "Neurological Rehabilitation", "Pediatric Physiotherapy",
      "Geriatric Care", "Cardiorespiratory", "Women's Health"
    ],
    education: [
      "Bachelor's degree in Physiotherapy (4 years)",
      "Master's degree in Physiotherapy (2 years)", 
      "Registration with AHPRA (Australian Health Practitioner Regulation Agency)",
      "Continuing Professional Development (CPD) requirements"
    ],
    careerPath: [
      "Graduate Physiotherapist", "Senior Physiotherapist", "Clinical Specialist",
      "Practice Manager/Owner", "Academic/Researcher"
    ],
    workEnvironments: [
      "Private physiotherapy practices", "Public and private hospitals",
      "Sports clubs and facilities", "Community health centers",
      "Aged care facilities", "Rehabilitation centers", "Corporate health programs"
    ],
    salaryRanges: [
      { level: "Graduate", range: "$60,000 - $75,000" },
      { level: "Mid-level (3-5 years)", range: "$75,000 - $95,000" },
      { level: "Senior (5+ years)", range: "$95,000 - $120,000+" }
    ],
    jobMarket: "The physiotherapy job market in Australia is experiencing strong growth, driven by an aging population, increased focus on preventive healthcare, and growing demand for rehabilitation services. Physiotherapists are in high demand across all states and territories, with particularly strong opportunities in regional and rural areas."
  },
  "occupational-therapy": {
    name: "Occupational Therapy",
    title: "Occupational Therapy Careers in Australia", 
    description: "Explore rewarding careers in occupational therapy - helping people achieve independence and improve their quality of life through meaningful activities and therapeutic interventions.",
    longDescription: "Occupational therapy is a client-centered health profession that helps people of all ages participate in the activities of everyday life. Occupational therapists work with individuals who have physical, mental, or cognitive impairments to develop, recover, or maintain daily living and work skills.",
    responsibilities: [
      "Client assessment and evaluation",
      "Treatment planning and intervention",
      "Adaptive equipment prescription",
      "Environmental modifications",
      "Functional capacity evaluation"
    ],
    specializations: [
      "Pediatric Occupational Therapy", "Mental Health", "Physical Rehabilitation",
      "Geriatric Care", "Hand Therapy", "Neurological Rehabilitation"
    ],
    education: [
      "Bachelor's degree in Occupational Therapy (4 years)",
      "Master's degree in Occupational Therapy (2 years)",
      "Registration with AHPRA",
      "Continuing Professional Development (CPD) requirements"
    ],
    careerPath: [
      "Graduate Occupational Therapist", "Senior Occupational Therapist",
      "Clinical Specialist", "Practice Manager", "Academic/Researcher"
    ],
    workEnvironments: [
      "Hospitals and rehabilitation centers", "Private practices",
      "Community health services", "Schools and educational settings",
      "Mental health facilities", "Aged care facilities", "Workplace health"
    ],
    salaryRanges: [
      { level: "Graduate", range: "$55,000 - $70,000" },
      { level: "Mid-level (3-5 years)", range: "$70,000 - $90,000" },
      { level: "Senior (5+ years)", range: "$90,000 - $110,000+" }
    ],
    jobMarket: "Occupational therapy is experiencing strong growth in Australia, particularly in mental health, aged care, and pediatric services. There is high demand for OTs in regional areas and specialized fields like hand therapy and neurological rehabilitation."
  },
  "speech-pathology": {
    name: "Speech Pathology",
    title: "Speech Pathology Careers in Australia",
    description: "Discover rewarding careers in speech pathology - helping people communicate effectively and overcome swallowing disorders across all age groups.",
    longDescription: "Speech pathology is a healthcare profession that focuses on the assessment, diagnosis, and treatment of communication and swallowing disorders. Speech pathologists work with people of all ages who have difficulties with speech, language, voice, fluency, and swallowing.",
    responsibilities: [
      "Communication assessment and diagnosis",
      "Swallowing evaluation and treatment",
      "Speech and language therapy",
      "Voice therapy and rehabilitation",
      "AAC (Augmentative and Alternative Communication) support"
    ],
    specializations: [
      "Pediatric Speech Pathology", "Adult Neurogenic Communication",
      "Voice Disorders", "Swallowing Disorders", "Stuttering", "AAC"
    ],
    education: [
      "Bachelor's degree in Speech Pathology (4 years)",
      "Master's degree in Speech Pathology (2 years)",
      "Certification with Speech Pathology Australia",
      "Continuing Professional Development (CPD) requirements"
    ],
    careerPath: [
      "Graduate Speech Pathologist", "Senior Speech Pathologist",
      "Clinical Specialist", "Practice Manager", "Academic/Researcher"
    ],
    workEnvironments: [
      "Hospitals and medical centers", "Private practices",
      "Schools and educational settings", "Community health services",
      "Rehabilitation centers", "Aged care facilities", "Early intervention services"
    ],
    salaryRanges: [
      { level: "Graduate", range: "$55,000 - $70,000" },
      { level: "Mid-level (3-5 years)", range: "$70,000 - $90,000" },
      { level: "Senior (5+ years)", range: "$90,000 - $110,000+" }
    ],
    jobMarket: "Speech pathology is experiencing strong growth in Australia, particularly in pediatric services, aged care, and neurological rehabilitation. There is high demand for speech pathologists in regional areas and specialized fields like AAC and swallowing disorders."
  },
  "psychology": {
    name: "Psychology",
    title: "Psychology Careers in Australia",
    description: "Explore diverse career opportunities in psychology - from clinical practice to research, helping individuals and communities achieve mental health and wellbeing.",
    longDescription: "Psychology is the scientific study of human behavior and mental processes. Psychologists work in various settings to help people understand and overcome psychological challenges, improve mental health, and enhance overall wellbeing.",
    responsibilities: [
      "Psychological assessment and evaluation",
      "Individual and group therapy",
      "Research and data analysis",
      "Mental health intervention",
      "Behavioral modification programs"
    ],
    specializations: [
      "Clinical Psychology", "Counselling Psychology", "Educational Psychology",
      "Forensic Psychology", "Health Psychology", "Organizational Psychology"
    ],
    education: [
      "Bachelor's degree in Psychology (3 years)",
      "Honours degree in Psychology (1 year)",
      "Master's or Doctorate in Psychology (2-4 years)",
      "Registration with AHPRA",
      "Continuing Professional Development (CPD) requirements"
    ],
    careerPath: [
      "Graduate Psychologist", "Registered Psychologist",
      "Clinical Psychologist", "Senior Psychologist", "Practice Owner"
    ],
    workEnvironments: [
      "Private practices", "Hospitals and mental health facilities",
      "Schools and universities", "Corporate organizations",
      "Government agencies", "Research institutions", "Community services"
    ],
    salaryRanges: [
      { level: "Graduate", range: "$60,000 - $75,000" },
      { level: "Registered (3-5 years)", range: "$75,000 - $95,000" },
      { level: "Clinical (5+ years)", range: "$95,000 - $130,000+" }
    ],
    jobMarket: "Psychology is experiencing strong growth in Australia, particularly in mental health services, corporate wellbeing, and specialized areas like forensic and health psychology. There is high demand for psychologists across all sectors."
  },
  "dietetics-nutrition": {
    name: "Dietetics & Nutrition",
    title: "Dietetics & Nutrition Careers in Australia",
    description: "Discover rewarding careers in dietetics and nutrition - helping people achieve optimal health through evidence-based nutrition advice and dietary interventions.",
    longDescription: "Dietetics and nutrition is a healthcare profession that focuses on the science of food and nutrition and its impact on health. Dietitians and nutritionists help people make informed food choices and develop healthy eating habits.",
    responsibilities: [
      "Nutritional assessment and evaluation",
      "Dietary planning and counseling",
      "Medical nutrition therapy",
      "Nutrition education and prevention",
      "Food service management"
    ],
    specializations: [
      "Clinical Dietetics", "Community Nutrition", "Sports Nutrition",
      "Pediatric Nutrition", "Geriatric Nutrition", "Food Service Management"
    ],
    education: [
      "Bachelor's degree in Nutrition and Dietetics (4 years)",
      "Master's degree in Nutrition and Dietetics (2 years)",
      "Accreditation with Dietitians Association of Australia",
      "Continuing Professional Development (CPD) requirements"
    ],
    careerPath: [
      "Graduate Dietitian", "Senior Dietitian",
      "Clinical Specialist", "Practice Manager", "Academic/Researcher"
    ],
    workEnvironments: [
      "Hospitals and medical centers", "Private practices",
      "Community health services", "Sports organizations",
      "Food service industries", "Research institutions", "Government agencies"
    ],
    salaryRanges: [
      { level: "Graduate", range: "$55,000 - $70,000" },
      { level: "Mid-level (3-5 years)", range: "$70,000 - $90,000" },
      { level: "Senior (5+ years)", range: "$90,000 - $110,000+" }
    ],
    jobMarket: "Dietetics and nutrition is experiencing strong growth in Australia, particularly in clinical settings, sports nutrition, and community health. There is high demand for dietitians in regional areas and specialized fields."
  },
  "social-work": {
    name: "Social Work",
    title: "Social Work Careers in Australia",
    description: "Explore meaningful careers in social work - supporting individuals, families, and communities to overcome challenges and achieve social justice.",
    longDescription: "Social work is a profession dedicated to helping people solve and cope with problems in their everyday lives. Social workers work with individuals, families, groups, and communities to improve their wellbeing and social functioning.",
    responsibilities: [
      "Client assessment and case management",
      "Crisis intervention and support",
      "Advocacy and social justice",
      "Community development",
      "Policy development and research"
    ],
    specializations: [
      "Child and Family Social Work", "Mental Health Social Work",
      "Medical Social Work", "Community Development", "Policy and Research"
    ],
    education: [
      "Bachelor's degree in Social Work (4 years)",
      "Master's degree in Social Work (2 years)",
      "Accreditation with Australian Association of Social Workers",
      "Continuing Professional Development (CPD) requirements"
    ],
    careerPath: [
      "Graduate Social Worker", "Senior Social Worker",
      "Clinical Social Worker", "Team Leader", "Practice Manager"
    ],
    workEnvironments: [
      "Government departments", "Non-profit organizations",
      "Hospitals and health services", "Schools and educational settings",
      "Community centers", "Mental health facilities", "Correctional services"
    ],
    salaryRanges: [
      { level: "Graduate", range: "$55,000 - $70,000" },
      { level: "Mid-level (3-5 years)", range: "$70,000 - $90,000" },
      { level: "Senior (5+ years)", range: "$90,000 - $110,000+" }
    ],
    jobMarket: "Social work is experiencing strong growth in Australia, particularly in mental health, child protection, and community services. There is high demand for social workers in regional areas and specialized fields."
  },
  "podiatry": {
    name: "Podiatry",
    title: "Podiatry Careers in Australia",
    description: "Discover rewarding careers in podiatry - specializing in foot and lower limb health, helping patients maintain mobility and quality of life.",
    longDescription: "Podiatry is a healthcare profession that focuses on the assessment, diagnosis, treatment, and prevention of foot and lower limb disorders. Podiatrists help patients maintain mobility, reduce pain, and improve their quality of life.",
    responsibilities: [
      "Foot and lower limb assessment",
      "Treatment of foot conditions",
      "Orthotic prescription and fitting",
      "Wound care and management",
      "Preventive foot care"
    ],
    specializations: [
      "Sports Podiatry", "Diabetic Foot Care", "Pediatric Podiatry",
      "Geriatric Podiatry", "Surgical Podiatry", "Biomechanics"
    ],
    education: [
      "Bachelor's degree in Podiatry (4 years)",
      "Master's degree in Podiatry (2 years)",
      "Registration with AHPRA",
      "Continuing Professional Development (CPD) requirements"
    ],
    careerPath: [
      "Graduate Podiatrist", "Senior Podiatrist",
      "Clinical Specialist", "Practice Manager/Owner", "Academic/Researcher"
    ],
    workEnvironments: [
      "Private podiatry practices", "Hospitals and medical centers",
      "Sports clubs and facilities", "Community health services",
      "Aged care facilities", "Rehabilitation centers"
    ],
    salaryRanges: [
      { level: "Graduate", range: "$55,000 - $70,000" },
      { level: "Mid-level (3-5 years)", range: "$70,000 - $90,000" },
      { level: "Senior (5+ years)", range: "$90,000 - $110,000+" }
    ],
    jobMarket: "Podiatry is experiencing strong growth in Australia, particularly in sports medicine, diabetic foot care, and aged care. There is high demand for podiatrists in regional areas and specialized fields."
  },
  "audiology": {
    name: "Audiology",
    title: "Audiology Careers in Australia",
    description: "Explore rewarding careers in audiology - helping people with hearing and balance disorders achieve better communication and quality of life.",
    longDescription: "Audiology is a healthcare profession that focuses on the assessment, diagnosis, treatment, and prevention of hearing and balance disorders. Audiologists help people of all ages with hearing loss and related conditions.",
    responsibilities: [
      "Hearing assessment and evaluation",
      "Balance testing and treatment",
      "Hearing aid fitting and management",
      "Tinnitus assessment and treatment",
      "Hearing conservation programs"
    ],
    specializations: [
      "Pediatric Audiology", "Adult Audiology", "Cochlear Implants",
      "Balance Disorders", "Tinnitus Management", "Hearing Conservation"
    ],
    education: [
      "Bachelor's degree in Audiology (4 years)",
      "Master's degree in Audiology (2 years)",
      "Certification with Audiology Australia",
      "Continuing Professional Development (CPD) requirements"
    ],
    careerPath: [
      "Graduate Audiologist", "Senior Audiologist",
      "Clinical Specialist", "Practice Manager", "Academic/Researcher"
    ],
    workEnvironments: [
      "Private audiology practices", "Hospitals and medical centers",
      "Hearing aid clinics", "Schools and educational settings",
      "Community health services", "Industrial settings"
    ],
    salaryRanges: [
      { level: "Graduate", range: "$60,000 - $75,000" },
      { level: "Mid-level (3-5 years)", range: "$75,000 - $95,000" },
      { level: "Senior (5+ years)", range: "$95,000 - $120,000+" }
    ],
    jobMarket: "Audiology is experiencing strong growth in Australia, particularly in pediatric services, cochlear implants, and hearing aid technology. There is high demand for audiologists in regional areas and specialized fields."
  },
  "exercise-physiology": {
    name: "Exercise Physiology",
    title: "Exercise Physiology Careers in Australia",
    description: "Discover rewarding careers in exercise physiology - using exercise as medicine to help people with chronic conditions and injuries.",
    longDescription: "Exercise physiology is a healthcare profession that focuses on the use of exercise as a therapeutic intervention for people with chronic conditions, injuries, and disabilities. Exercise physiologists help clients improve their physical function and quality of life.",
    responsibilities: [
      "Exercise assessment and prescription",
      "Chronic disease management",
      "Injury rehabilitation programs",
      "Fitness and wellness coaching",
      "Health education and prevention"
    ],
    specializations: [
      "Cardiac Rehabilitation", "Pulmonary Rehabilitation", "Neurological Rehabilitation",
      "Sports Medicine", "Aged Care", "Workplace Health"
    ],
    education: [
      "Bachelor's degree in Exercise Physiology (4 years)",
      "Master's degree in Exercise Physiology (2 years)",
      "Accreditation with Exercise and Sports Science Australia",
      "Continuing Professional Development (CPD) requirements"
    ],
    careerPath: [
      "Graduate Exercise Physiologist", "Senior Exercise Physiologist",
      "Clinical Specialist", "Practice Manager", "Academic/Researcher"
    ],
    workEnvironments: [
      "Private practices", "Hospitals and rehabilitation centers",
      "Sports clubs and facilities", "Community health services",
      "Corporate wellness programs", "Aged care facilities"
    ],
    salaryRanges: [
      { level: "Graduate", range: "$55,000 - $70,000" },
      { level: "Mid-level (3-5 years)", range: "$70,000 - $90,000" },
      { level: "Senior (5+ years)", range: "$90,000 - $110,000+" }
    ],
    jobMarket: "Exercise physiology is experiencing strong growth in Australia, particularly in cardiac and pulmonary rehabilitation, sports medicine, and workplace health. There is high demand for exercise physiologists in regional areas."
  },
  "optometry": {
    name: "Optometry",
    title: "Optometry Careers in Australia",
    description: "Explore rewarding careers in optometry - providing comprehensive eye care and vision health services to patients of all ages.",
    longDescription: "Optometry is a healthcare profession that focuses on the examination, diagnosis, treatment, and management of eye and vision problems. Optometrists provide comprehensive eye care services and help patients maintain optimal vision health.",
    responsibilities: [
      "Comprehensive eye examinations",
      "Vision assessment and correction",
      "Contact lens fitting and management",
      "Ocular disease detection",
      "Vision therapy and rehabilitation"
    ],
    specializations: [
      "Pediatric Optometry", "Contact Lens Practice", "Low Vision",
      "Ocular Disease", "Vision Therapy", "Sports Vision"
    ],
    education: [
      "Bachelor's degree in Optometry (4 years)",
      "Master's degree in Optometry (2 years)",
      "Registration with AHPRA",
      "Continuing Professional Development (CPD) requirements"
    ],
    careerPath: [
      "Graduate Optometrist", "Senior Optometrist",
      "Clinical Specialist", "Practice Manager/Owner", "Academic/Researcher"
    ],
    workEnvironments: [
      "Private optometry practices", "Optical retail chains",
      "Hospitals and medical centers", "Community health services",
      "Research institutions", "Corporate organizations"
    ],
    salaryRanges: [
      { level: "Graduate", range: "$65,000 - $80,000" },
      { level: "Mid-level (3-5 years)", range: "$80,000 - $100,000" },
      { level: "Senior (5+ years)", range: "$100,000 - $130,000+" }
    ],
    jobMarket: "Optometry is experiencing strong growth in Australia, particularly in specialized areas like pediatric optometry, contact lens practice, and ocular disease management. There is high demand for optometrists in regional areas."
  },
  "pharmacy": {
    name: "Pharmacy",
    title: "Pharmacy Careers in Australia",
    description: "Discover rewarding careers in pharmacy - providing medication expertise and healthcare services in diverse settings across Australia.",
    longDescription: "Pharmacy is a healthcare profession that focuses on the safe and effective use of medications. Pharmacists provide medication expertise, patient care, and health services in various settings including community pharmacies, hospitals, and specialized practice areas.",
    responsibilities: [
      "Medication dispensing and counseling",
      "Clinical medication review",
      "Patient education and support",
      "Health screening and prevention",
      "Medication safety and quality assurance"
    ],
    specializations: [
      "Community Pharmacy", "Hospital Pharmacy", "Clinical Pharmacy",
      "Oncology Pharmacy", "Pediatric Pharmacy", "Geriatric Pharmacy"
    ],
    education: [
      "Bachelor's degree in Pharmacy (4 years)",
      "Master's degree in Pharmacy (2 years)",
      "Registration with AHPRA",
      "Continuing Professional Development (CPD) requirements"
    ],
    careerPath: [
      "Graduate Pharmacist", "Senior Pharmacist",
      "Clinical Specialist", "Pharmacy Manager", "Academic/Researcher"
    ],
    workEnvironments: [
      "Community pharmacies", "Hospitals and medical centers",
      "Pharmaceutical companies", "Government agencies",
      "Research institutions", "Aged care facilities"
    ],
    salaryRanges: [
      { level: "Graduate", range: "$60,000 - $75,000" },
      { level: "Mid-level (3-5 years)", range: "$75,000 - $95,000" },
      { level: "Senior (5+ years)", range: "$95,000 - $120,000+" }
    ],
    jobMarket: "Pharmacy is experiencing strong growth in Australia, particularly in clinical pharmacy, specialized practice areas, and medication management services. There is high demand for pharmacists in regional areas and specialized fields."
  },
  "radiography": {
    name: "Radiography",
    title: "Radiography Careers in Australia",
    description: "Explore rewarding careers in radiography - providing essential medical imaging services for diagnosis and treatment across healthcare settings.",
    longDescription: "Radiography is a healthcare profession that uses medical imaging technology to help diagnose and treat diseases and injuries. Radiographers operate imaging equipment and work closely with other healthcare professionals to provide high-quality diagnostic images.",
    responsibilities: [
      "Medical imaging procedures",
      "Patient care and safety",
      "Image quality assurance",
      "Radiation safety management",
      "Technical equipment operation"
    ],
    specializations: [
      "Diagnostic Radiography", "Computed Tomography (CT)", "Magnetic Resonance Imaging (MRI)",
      "Ultrasound", "Nuclear Medicine", "Interventional Radiography"
    ],
    education: [
      "Bachelor's degree in Medical Radiation Science (4 years)",
      "Master's degree in Medical Radiation Science (2 years)",
      "Registration with AHPRA",
      "Continuing Professional Development (CPD) requirements"
    ],
    careerPath: [
      "Graduate Radiographer", "Senior Radiographer",
      "Clinical Specialist", "Department Manager", "Academic/Researcher"
    ],
    workEnvironments: [
      "Hospitals and medical centers", "Private imaging clinics",
      "Specialized imaging centers", "Research institutions",
      "Mobile imaging services", "Educational institutions"
    ],
    salaryRanges: [
      { level: "Graduate", range: "$60,000 - $75,000" },
      { level: "Mid-level (3-5 years)", range: "$75,000 - $95,000" },
      { level: "Senior (5+ years)", range: "$95,000 - $120,000+" }
    ],
    jobMarket: "Radiography is experiencing strong growth in Australia, particularly in specialized imaging modalities like MRI, CT, and interventional procedures. There is high demand for radiographers in regional areas and specialized fields."
  }
}

interface ProfessionPageClientProps {
  profession: string
}

export default function ProfessionPageClient({ profession }: ProfessionPageClientProps) {
  const professionInfo = professionData[profession as keyof typeof professionData]
  
  if (!professionInfo) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/career-info">
            <Button variant="ghost" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Career Info
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {professionInfo.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            {professionInfo.description}
          </p>
          <Link href={`/jobs/occupation/${profession}`}>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 text-lg">
              <Briefcase className="h-5 w-5 mr-2" />
              View {professionInfo.name} Jobs
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* What is [Profession] */}
        <Card className="mb-12 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-gray-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Heart className="h-6 w-6 text-violet-600" />
              What is {professionInfo.name}?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {professionInfo.longDescription}
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Core Responsibilities
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  {professionInfo.responsibilities.map((responsibility: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-violet-600 mt-0.5 flex-shrink-0" />
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {professionInfo.specializations.map((specialization: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300">
                      {specialization}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Path & Qualifications */}
        <Card className="mb-12 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-gray-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-violet-600" />
              Career Path & Qualifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Educational Requirements
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  {professionInfo.education.map((requirement: string, index: number) => (
                    <li key={index}>• {requirement}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Career Progression
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  {professionInfo.careerPath.map((path: string, index: number) => (
                    <li key={index}>• {path}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Settings & Salary */}
        <Card className="mb-12 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-gray-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-violet-600" />
              Work Settings & Salary Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Work Environments
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  {professionInfo.workEnvironments.map((environment: string, index: number) => (
                    <li key={index}>• {environment}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Salary Ranges (Australia)
                </h3>
                <div className="space-y-3">
                  {professionInfo.salaryRanges.map((salary: { level: string; range: string }, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">{salary.level}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{salary.range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Market & Opportunities */}
        <Card className="mb-12 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-gray-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="h-6 w-6 text-violet-600" />
              Job Market & Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {professionInfo.jobMarket}
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                <MapPin className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Geographic Demand</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Opportunities across Australia
                </p>
              </div>
              <div className="text-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                <Clock className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Growth Projection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Strong growth expected
                </p>
              </div>
              <div className="text-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                <DollarSign className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Salary Growth</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Competitive salaries with increases
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-violet-600 text-white border-violet-600">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Start Your {professionInfo.name} Career?
              </h2>
              <p className="text-violet-100 mb-6 max-w-2xl mx-auto">
                Explore current {professionInfo.name.toLowerCase()} job opportunities across Australia. Find positions that match your 
                experience level, location preferences, and career goals.
              </p>
              <Link href={`/jobs/occupation/${profession}`}>
                <Button className="bg-white text-violet-600 hover:bg-violet-50 px-8 py-3 text-lg">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Browse {professionInfo.name} Jobs
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 