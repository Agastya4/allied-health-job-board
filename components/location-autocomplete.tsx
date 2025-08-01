"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string, lat?: number, lng?: number) => void
  placeholder?: string
  className?: string
}

// Cache for search results
const searchCache = new Map<string, any[]>()

export function LocationAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Search locations...",
  className = ""
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY || "YOUR_GEOAPIFY_API_KEY_HERE";
  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([])
      return
    }

    const cacheKey = query.toLowerCase()
    if (searchCache.has(cacheKey)) {
      setSuggestions(searchCache.get(cacheKey) || [])
      return
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    setIsLoading(true)
    setError(null)

    try {
      // Use Geoapify Places API for location search
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&filter=countrycode:au&limit=10&apiKey=${GEOAPIFY_API_KEY}`,
        {
          signal: abortControllerRef.current.signal,
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch locations')
      }

      const data = await response.json()
      // Geoapify returns features array
      const formattedResults = (data.features || [])
        .filter((item: any) => {
          // Only include cities, towns, villages, suburbs, localities in Australia
          const type = item.properties.result_type
          return (
            (type === 'city' || type === 'town' || type === 'village' || type === 'suburb' || type === 'locality' || type === 'hamlet')
          )
        })
        .map((item: any) => ({
          display_name: formatDisplayNameGeoapify(item),
          lat: item.geometry.coordinates[1],
          lon: item.geometry.coordinates[0],
          place_id: item.properties.place_id,
          address: {
            city: item.properties.city || item.properties.name || '',
            state: item.properties.state || '',
            country: item.properties.country || '',
          },
        }))
        .sort((a: any, b: any) => a.display_name.localeCompare(b.display_name))
        .slice(0, 10)

      searchCache.set(cacheKey, formattedResults)
      setSuggestions(formattedResults)
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return // Request was cancelled
      }
      console.error('Location search error:', error)
      setError('Failed to load locations. Please try again.')
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Helper for Geoapify formatting
  const formatDisplayNameGeoapify = (item: any): string => {
    const city = item.properties.city || item.properties.name || ''
    const state = item.properties.state || ''
    return city && state ? `${city}, ${state}` : city || state || ''
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    onChange(query)
    
    // Clear suggestions if input is empty
    if (!query.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Show suggestions immediately for mobile
    setShowSuggestions(true)
    
    // Debounce the search
    const timeoutId = setTimeout(() => {
      searchLocations(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  const handleSuggestionClick = (suggestion: any) => {
    onChange(suggestion.display_name, parseFloat(suggestion.lat), parseFloat(suggestion.lon))
    setShowSuggestions(false)
    setSuggestions([])
    inputRef.current?.blur()
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    if (value.trim()) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    setIsFocused(false)
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false)
    }, 200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`pl-10 pr-4 h-12 md:h-10 text-base md:text-sm ${className}`}
        />
      </div>

      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute z-[9999] w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {isLoading && (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              Searching...
            </div>
          )}
          
          {!isLoading && suggestions.length === 0 && value.trim() && (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No locations found
            </div>
          )}
          
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              type="button"
              className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-700 focus:bg-gray-100 dark:focus:bg-zinc-700 focus:outline-none text-sm text-gray-900 dark:text-white touch-manipulation active:bg-gray-200 dark:active:bg-zinc-600"
              onClick={() => handleSuggestionClick(suggestion)}
              onTouchEnd={(e) => {
                e.preventDefault()
                handleSuggestionClick(suggestion)
              }}
              tabIndex={0}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>{suggestion.display_name}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="absolute z-[9999] w-full mt-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
