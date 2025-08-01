import { STATES, CITIES, JOB_CATEGORIES } from '@/app/locations/seo-links'

export interface LocationMatch {
  city: string
  state: string
  stateAbbr: string
  isMatched: boolean
  normalizedCity: string
  normalizedState: string
}

export interface LocationData {
  city: string
  state: string
  stateAbbr: string
  fullName: string
}

// Create a comprehensive location database
const LOCATION_DATABASE: LocationData[] = []

// Populate from STATES and CITIES
STATES.forEach(state => {
  const cities = CITIES[state.abbr as keyof typeof CITIES] || []
  cities.forEach(city => {
    LOCATION_DATABASE.push({
      city: city,
      state: state.name,
      stateAbbr: state.abbr,
      fullName: `${city}, ${state.abbr}`
    })
  })
})

// Add state-only entries
STATES.forEach(state => {
  LOCATION_DATABASE.push({
    city: '',
    state: state.name,
    stateAbbr: state.abbr,
    fullName: state.name
  })
})

// Normalize string for comparison
function normalizeString(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, '-')
}

// State name to abbreviation mapping
const STATE_MAPPING: Record<string, string> = {
  'new south wales': 'NSW',
  'victoria': 'VIC',
  'queensland': 'QLD',
  'south australia': 'SA',
  'western australia': 'WA',
  'tasmania': 'TAS',
  'australian capital territory': 'ACT',
  'northern territory': 'NT',
  'nsw': 'NSW',
  'vic': 'VIC',
  'qld': 'QLD',
  'sa': 'SA',
  'wa': 'WA',
  'tas': 'TAS',
  'act': 'ACT',
  'nt': 'NT'
}

// Extract city and state from full address string
function extractCityAndStateFromAddress(address: string): { city: string; state: string } {
  // Common patterns for Australian addresses
  const patterns = [
    // Pattern: "City, State Postcode" (e.g., "Sydney, NSW 2000")
    /([^,]+),\s*([A-Z]{2,3})\s+\d{4}/i,
    // Pattern: "City, State" (e.g., "Sydney, NSW")
    /([^,]+),\s*([A-Z]{2,3})/i,
    // Pattern: "City State Postcode" (e.g., "Sydney NSW 2000")
    /([^,]+)\s+([A-Z]{2,3})\s+\d{4}/i,
    // Pattern: "City State" (e.g., "Sydney NSW")
    /([^,]+)\s+([A-Z]{2,3})/i,
    // Pattern: "Street, City, State" (e.g., "123 George Street, Sydney, NSW")
    /[^,]+,\s*([^,]+),\s*([A-Z]{2,3})/i,
    // Pattern: "Street, City, State Postcode" (e.g., "123 George Street, Sydney, NSW 2000")
    /[^,]+,\s*([^,]+),\s*([A-Z]{2,3})\s+\d{4}/i,
  ]

  for (const pattern of patterns) {
    const match = address.match(pattern)
    if (match) {
      const city = match[1].trim()
      const state = match[2].trim()
      return { city, state }
    }
  }

  // Fallback: try to find state abbreviations in the address
  const stateAbbrs = Object.values(STATE_MAPPING).filter(abbr => abbr.length === 2 || abbr.length === 3)
  for (const abbr of stateAbbrs) {
    const stateIndex = address.toUpperCase().indexOf(abbr)
    if (stateIndex !== -1) {
      // Try to extract city before the state
      const beforeState = address.substring(0, stateIndex).trim()
      const parts = beforeState.split(/[,\s]+/).filter(part => part.length > 0)
      const city = parts[parts.length - 1] || ''
      return { city, state: abbr }
    }
  }

  return { city: '', state: '' }
}

// Parse location input and find matches
export function parseLocation(input: string): LocationMatch {
  const normalizedInput = normalizeString(input)
  
  // Try exact match first
  const exactMatch = LOCATION_DATABASE.find(location => 
    normalizeString(location.fullName) === normalizedInput ||
    normalizeString(`${location.city}, ${location.stateAbbr}`) === normalizedInput
  )
  
  if (exactMatch) {
    return {
      city: exactMatch.city,
      state: exactMatch.state,
      stateAbbr: exactMatch.stateAbbr,
      isMatched: true,
      normalizedCity: normalizeString(exactMatch.city),
      normalizedState: normalizeString(exactMatch.stateAbbr)
    }
  }
  
  // Try to extract city and state from full address
  const { city: extractedCity, state: extractedState } = extractCityAndStateFromAddress(input)
  
  if (extractedCity && extractedState) {
    // Find matching city and state
    const cityMatch = LOCATION_DATABASE.find(location => 
      normalizeString(location.city) === normalizeString(extractedCity) ||
      location.city.toLowerCase().includes(extractedCity.toLowerCase()) ||
      extractedCity.toLowerCase().includes(location.city.toLowerCase())
    )
    
    const stateAbbr = STATE_MAPPING[normalizeString(extractedState)] || extractedState.toUpperCase()
    
    if (cityMatch && stateAbbr) {
      return {
        city: cityMatch.city,
        state: cityMatch.state,
        stateAbbr: stateAbbr,
        isMatched: true,
        normalizedCity: normalizeString(cityMatch.city),
        normalizedState: normalizeString(stateAbbr)
      }
    }
  }
  
  // Try partial matching
  const parts = input.split(/[,\s]+/).map(part => part.trim()).filter(part => part.length > 0)
  
  if (parts.length >= 2) {
    const cityPart = parts[0]
    const statePart = parts[1]
    
    // Find matching city and state
    const cityMatch = LOCATION_DATABASE.find(location => 
      normalizeString(location.city) === normalizeString(cityPart) ||
      location.city.toLowerCase().includes(cityPart.toLowerCase())
    )
    
    const stateAbbr = STATE_MAPPING[normalizeString(statePart)] || statePart.toUpperCase()
    
    if (cityMatch && stateAbbr) {
      return {
        city: cityMatch.city,
        state: cityMatch.state,
        stateAbbr: stateAbbr,
        isMatched: true,
        normalizedCity: normalizeString(cityMatch.city),
        normalizedState: normalizeString(stateAbbr)
      }
    }
  }
  
  // Try state-only match
  const stateMatch = LOCATION_DATABASE.find(location => 
    normalizeString(location.state) === normalizedInput ||
    normalizeString(location.stateAbbr) === normalizedInput
  )
  
  if (stateMatch) {
    return {
      city: '',
      state: stateMatch.state,
      stateAbbr: stateMatch.stateAbbr,
      isMatched: true,
      normalizedCity: '',
      normalizedState: normalizeString(stateMatch.stateAbbr)
    }
  }
  
  // No match found - return original input as unmatched
  return {
    city: input,
    state: '',
    stateAbbr: '',
    isMatched: false,
    normalizedCity: normalizeString(input),
    normalizedState: ''
  }
}

// Get location suggestions for autocomplete
export function getLocationSuggestions(input: string): LocationData[] {
  if (!input || input.length < 2) return []
  
  const normalizedInput = normalizeString(input)
  
  return LOCATION_DATABASE.filter(location => 
    normalizeString(location.city).includes(normalizedInput) ||
    normalizeString(location.state).includes(normalizedInput) ||
    normalizeString(location.stateAbbr).includes(normalizedInput) ||
    normalizeString(location.fullName).includes(normalizedInput)
  ).slice(0, 10) // Limit to 10 suggestions
}

// Check if a location matches any of our defined locations
export function isLocationMatched(input: string): boolean {
  const match = parseLocation(input)
  return match.isMatched
}

// Get all available locations for reference
export function getAllLocations(): LocationData[] {
  return LOCATION_DATABASE
}

// Get locations by state
export function getLocationsByState(stateAbbr: string): LocationData[] {
  return LOCATION_DATABASE.filter(location => 
    location.stateAbbr === stateAbbr.toUpperCase()
  )
}

// Get all states
export function getAllStates(): { abbr: string; name: string }[] {
  return STATES
} 