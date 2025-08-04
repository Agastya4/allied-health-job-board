"use client"
import Link from "next/link"
import { useState } from "react"
import { STATES, CITIES, JOB_CATEGORIES } from "./seo-links"
import { SEO } from "@/components/seo"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Browse Jobs by Location - AlliedHealthJobs.au",
  description: "Find Allied Health Jobs by Location Across Australia. Browse Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions by State and City.",
  keywords: [
    'Allied Health Jobs by Location',
    'Healthcare Jobs by City',
    'Physiotherapy Jobs by Location',
    'Occupational Therapy Jobs by Location',
    'Speech Pathology Jobs by Location',
    'Healthcare Jobs Australia',
    'Allied Health Jobs by State'
  ],
  openGraph: {
    title: "Browse Jobs by Location - AlliedHealthJobs.au",
    description: "Find Allied Health Jobs by Location Across Australia. Browse Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions by State and City.",
    url: "https://alliedhealthjobs.au/locations",
    siteName: "AlliedHealthJobs.au",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "Browse Jobs by Location",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Jobs by Location - AlliedHealthJobs.au",
    description: "Find Allied Health Jobs by Location Across Australia. Browse Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions by State and City.",
    images: ["/Logo.png"],
    creator: "@alliedhealthjobs",
  },
  alternates: {
    canonical: "https://alliedhealthjobs.au/locations",
  },
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Generate all SEO links
const seoLinks: { href: string; label: string }[] = []
for (const state of STATES) {
  for (const city of CITIES[state.abbr as keyof typeof CITIES]) {
    for (const cat of JOB_CATEGORIES) {
      seoLinks.push({
        href: `/locations/${state.abbr.toLowerCase()}/${slugify(city)}/${cat.value}`,
        label: `${cat.label} jobs in ${city}, ${state.abbr}`,
      })
    }
  }
}

// Generate all SEO links for state+category (no city)
const stateCategoryLinks: { href: string; label: string }[] = []
for (const state of STATES) {
  for (const cat of JOB_CATEGORIES) {
    stateCategoryLinks.push({
      href: `/locations/${state.abbr.toLowerCase()}/${cat.value}`,
      label: `${cat.label} jobs in ${state.name} (${state.abbr})`,
    })
  }
}

export default function LocationsPage() {
  return (
    <>
      <SEO 
        title="Browse Jobs by Location - AlliedHealthJobs.au"
        description="Find Allied Health Jobs by Location Across Australia. Browse Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions by State and City."
        keywords={[
          'Allied Health Jobs by Location',
          'Healthcare Jobs by City',
          'Physiotherapy Jobs by Location',
          'Occupational Therapy Jobs by Location',
          'Speech Pathology Jobs by Location',
          'Healthcare Jobs Australia',
          'Allied Health Jobs by State'
        ]}
        url="/locations"
        type="website"
      />
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Browse Jobs by Location</h1>
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Browse Jobs by Category and Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {seoLinks.map(link => (
              <a key={link.href} href={link.href} className="block text-violet-700 hover:underline text-base">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Browse Jobs by Category and State</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stateCategoryLinks.map(link => (
              <a key={link.href} href={link.href} className="block text-violet-700 hover:underline text-base">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
} 