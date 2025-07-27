"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { MapPin, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface LocationSuggestion {
  display_name: string
  lat: string
  lon: string
  place_id: number
  address?: {
    city?: string
    town?: string
    suburb?: string
    state?: string
    country?: string
    road?: string
    house_number?: string
    postcode?: string
  }
}

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string, lat?: number, lng?: number) => void
  placeholder?: string
  className?: string
}

// Cache for search results
const searchCache = new Map<string, LocationSuggestion[]>()

// Rate limiting to prevent too many API calls
let lastApiCall = 0
const API_CALL_DELAY = 100 // Minimum 100ms between API calls

// Popular Australian cities for instant suggestions
const popularCities: LocationSuggestion[] = [
  { display_name: "Sydney, NSW", lat: "-33.8688", lon: "151.2093", place_id: 1 },
  { display_name: "Melbourne, VIC", lat: "-37.8136", lon: "144.9631", place_id: 2 },
  { display_name: "Brisbane, QLD", lat: "-27.4698", lon: "153.0251", place_id: 3 },
  { display_name: "Perth, WA", lat: "-31.9505", lon: "115.8605", place_id: 4 },
  { display_name: "Adelaide, SA", lat: "-34.9285", lon: "138.6007", place_id: 5 },
  { display_name: "Gold Coast, QLD", lat: "-28.0167", lon: "153.4000", place_id: 6 },
  { display_name: "Newcastle, NSW", lat: "-32.9283", lon: "151.7817", place_id: 7 },
  { display_name: "Canberra, ACT", lat: "-35.2809", lon: "149.1300", place_id: 8 },
  { display_name: "Sunshine Coast, QLD", lat: "-26.6500", lon: "153.0667", place_id: 9 },
  { display_name: "Wollongong, NSW", lat: "-34.4331", lon: "150.8831", place_id: 10 },
  { display_name: "Hobart, TAS", lat: "-42.8821", lon: "147.3272", place_id: 11 },
  { display_name: "Geelong, VIC", lat: "-38.1499", lon: "144.3617", place_id: 12 },
  { display_name: "Townsville, QLD", lat: "-19.2590", lon: "146.8169", place_id: 13 },
  { display_name: "Cairns, QLD", lat: "-16.9186", lon: "145.7781", place_id: 14 },
  { display_name: "Toowoomba, QLD", lat: "-27.5667", lon: "151.9500", place_id: 15 },
]

export function LocationAutocomplete({ value, onChange, placeholder = "Search cities...", className }: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const searchLocations = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    // Check cache first
    const cacheKey = query.toLowerCase().trim()
    if (searchCache.has(cacheKey)) {
      setSuggestions(searchCache.get(cacheKey)!)
      return
    }

    // Rate limiting
    const now = Date.now()
    if (now - lastApiCall < API_CALL_DELAY) {
      return
    }
    lastApiCall = now

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    setError(null)

    try {
      // Search for any type of location in Australia (not just cities)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ", Australia"
        )}&countrycodes=au&limit=15&addressdetails=1`,
        {
          signal: abortControllerRef.current.signal,
          headers: {
            'Accept': 'application/json',
          }
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Filter and format results
      const filteredResults = data
        .filter((item: any) => {
          // Only include Australian locations
          return item.address?.country === 'Australia' || 
                 item.display_name.includes('Australia')
        })
        .map((item: any) => ({
          display_name: formatDisplayName(item),
          lat: item.lat,
          lon: item.lon,
          place_id: item.place_id,
          address: item.address
        }))
        .slice(0, 10) // Limit to 10 results

      // Cache the results
      searchCache.set(cacheKey, filteredResults)
      setSuggestions(filteredResults)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, ignore
        return
      }
      console.error('Location search error:', err)
      setError('Failed to search locations')
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const formatDisplayName = (item: any): string => {
    const address = item.address || {}
    
    // Try to create a clean display name
    const parts = []
    
    if (address.city) parts.push(address.city)
    else if (address.town) parts.push(address.town)
    else if (address.suburb) parts.push(address.suburb)
    
    if (address.state) parts.push(address.state)
    
    if (parts.length > 0) {
      return parts.join(', ')
    }
    
    // Fallback to the original display name but clean it up
    return item.display_name
      .split(',')
      .slice(0, 2) // Take first two parts
      .map((part: string) => part.trim())
      .join(', ')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    
    // Clear suggestions if input is empty
    if (!query.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      onChange('') // Clear the filter
      return
    }

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Debounce the search
    debounceRef.current = setTimeout(() => {
      searchLocations(query)
    }, 300)

    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    onChange(suggestion.display_name)
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleFocus = () => {
    setShowSuggestions(true)
    // Show popular cities when focused and no input
    if (!value.trim()) {
      setSuggestions(popularCities)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-full">
      <div className="relative w-full">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          autoComplete="off"
          aria-label="City search"
          className={cn(
            "pr-10 w-full",
            className
          )}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <MapPin className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              type="button"
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 focus:bg-gray-100 dark:focus:bg-zinc-700 focus:outline-none text-sm text-gray-900 dark:text-white"
              onClick={() => handleSuggestionClick(suggestion)}
              tabIndex={0}
            >
              <div className="flex items-center">
                <MapPin className="h-3 w-3 text-gray-400 mr-2 flex-shrink-0" />
                <span className="truncate">{suggestion.display_name}</span>
              </div>
            </button>
          ))}
          {error && (
            <div className="px-4 py-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
