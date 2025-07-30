"use client"
import Link from "next/link"
import { useState } from "react"
import { STATES, CITIES, JOB_CATEGORIES } from "./seo-links"
import { SEO } from "@/components/seo"

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
        description="Find allied health jobs by location across Australia. Browse physiotherapy, occupational therapy, speech pathology, and other healthcare positions by state and city."
        keywords={[
          'allied health jobs by location',
          'healthcare jobs by city',
          'physiotherapy jobs by location',
          'occupational therapy jobs by location',
          'speech pathology jobs by location',
          'healthcare jobs Australia',
          'allied health jobs by state'
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