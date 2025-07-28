import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to get occupation name from job categories
export function getOccupationName(jobCategories: string[] = []): string {
  const occupationMap: Record<string, string> = {
    'physiotherapy': 'Physiotherapy',
    'occupational-therapy': 'Occupational Therapy',
    'speech-pathology': 'Speech Pathology',
    'psychology': 'Psychology',
    'dietetics-nutrition': 'Dietetics & Nutrition',
    'social-work': 'Social Work',
    'podiatry': 'Podiatry',
    'audiology': 'Audiology',
    'exercise-physiology': 'Exercise Physiology',
    'optometry': 'Optometry',
    'pharmacy': 'Pharmacy',
    'radiography': 'Radiography'
  }
  
  // Find the first occupation category
  for (const category of jobCategories) {
    if (occupationMap[category]) {
      return occupationMap[category]
    }
  }
  
  return 'Allied Health' // Default fallback
}

// Helper function to get occupation slug from display name
export function getOccupationSlug(displayName: string): string {
  const reverseOccupationMap: Record<string, string> = {
    'Physiotherapy': 'physiotherapy',
    'Occupational Therapy': 'occupational-therapy',
    'Speech Pathology': 'speech-pathology',
    'Psychology': 'psychology',
    'Dietetics & Nutrition': 'dietetics-nutrition',
    'Social Work': 'social-work',
    'Podiatry': 'podiatry',
    'Audiology': 'audiology',
    'Exercise Physiology': 'exercise-physiology',
    'Optometry': 'optometry',
    'Pharmacy': 'pharmacy',
    'Radiography': 'radiography'
  }
  
  return reverseOccupationMap[displayName] || displayName.toLowerCase().replace(/\s+/g, '-')
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^a-z0-9-]/g, '')      // Remove all non-alphanumeric chars except -
    .replace(/-+/g, '-')             // Replace multiple - with single -
    .replace(/^-+|-+$/g, '');        // Trim - from start and end
}
