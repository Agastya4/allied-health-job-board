// Australian states
export const STATES = [
  { abbr: "NSW", name: "New South Wales" },
  { abbr: "VIC", name: "Victoria" },
  { abbr: "QLD", name: "Queensland" },
  { abbr: "SA", name: "South Australia" },
  { abbr: "WA", name: "Western Australia" },
  { abbr: "TAS", name: "Tasmania" },
  { abbr: "ACT", name: "Australian Capital Territory" },
  { abbr: "NT", name: "Northern Territory" },
]

// Major cities per state (expand as needed)
export const CITIES = {
  NSW: ["Sydney", "Newcastle", "Wollongong", "Central Coast", "Coffs Harbour", "Wagga Wagga"],
  VIC: ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Shepparton"],
  QLD: ["Brisbane", "Gold Coast", "Cairns", "Townsville", "Sunshine Coast", "Toowoomba"],
  SA: ["Adelaide", "Mount Gambier", "Whyalla"],
  WA: ["Perth", "Bunbury", "Geraldton", "Albany"],
  TAS: ["Hobart", "Launceston", "Devonport", "Burnie"],
  ACT: ["Canberra"],
  NT: ["Darwin", "Alice Springs"],
}

// Job categories (from job-posting-form.tsx)
export const JOB_CATEGORIES = [
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