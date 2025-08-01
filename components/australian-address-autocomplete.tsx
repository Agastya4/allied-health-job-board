"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Check, MapPin, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AddressSuggestion {
  placeId: string
  description: string
  structuredFormatting: {
    main_text: string
    secondary_text: string
  }
}

interface AddressDetails {
  formattedAddress: string
  locality: string // City/Suburb
  administrativeAreaLevel1: string // State
  postalCode: string
  latitude: number
  longitude: number
}

interface AustralianAddressAutocompleteProps {
  value: string
  onChange: (value: string, details?: AddressDetails) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function AustralianAddressAutocomplete({
  value,
  onChange,
  placeholder = "Enter Australian address...",
  className = "",
  disabled = false
}: AustralianAddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<AddressSuggestion | null>(null)
  const [isValidAddress, setIsValidAddress] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query || query.length < 3) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetch(
          `/api/address-validation?q=${encodeURIComponent(query)}`
        )
        
        if (!response.ok) {
          throw new Error("Failed to fetch address suggestions")
        }

        const data = await response.json()
        
        if (data.success) {
          setSuggestions(data.predictions || [])
          setShowSuggestions(data.predictions.length > 0)
        } else {
          console.error("Address validation error:", data.error)
          setSuggestions([])
          setShowSuggestions(false)
        }
      } catch (error) {
        console.error("Address search error:", error)
        setSuggestions([])
        setShowSuggestions(false)
      } finally {
        setLoading(false)
      }
    }, 500), // Increased debounce for free API
    []
  )

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setSelectedSuggestion(null)
    setIsValidAddress(false)
    
    if (newValue.length >= 3) {
      debouncedSearch(newValue)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion: AddressSuggestion) => {
    setSelectedSuggestion(suggestion)
    setShowSuggestions(false)
    setLoading(true)

    try {
      // Get detailed address information
      const response = await fetch("/api/address-validation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ placeId: suggestion.placeId }),
      })

      if (!response.ok) {
        throw new Error("Failed to get address details")
      }

      const data = await response.json()
      
      if (data.success && data.address) {
        const addressDetails = data.address
        
        // Update the input field with the complete full address description
        onChange(suggestion.description, addressDetails)
        setIsValidAddress(true)
        
        toast({
          title: "Address validated",
          description: "Australian address format confirmed",
          duration: 2000,
        })
      } else {
        // Fallback: if API fails, still use the suggestion description
        console.warn("Address validation failed, using fallback:", data.error)
        onChange(suggestion.description)
        setIsValidAddress(true)
        
        toast({
          title: "Address selected",
          description: "Address format may not be fully validated",
          duration: 2000,
        })
      }
    } catch (error) {
      console.error("Address validation error:", error)
      
      // Fallback: if API completely fails, still use the suggestion
      onChange(suggestion.description)
      setIsValidAddress(true)
      
      toast({
        title: "Address selected",
        description: "Address service unavailable, using basic validation",
        duration: 2000,
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle input focus
  const handleFocus = () => {
    if (value.length >= 3 && suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  // Handle click outside
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

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Debounce utility function
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={`${className} ${isValidAddress ? 'border-green-500' : ''}`}
          disabled={disabled}
        />
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
        
        {/* Valid address indicator */}
        {isValidAddress && !loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Check className="h-4 w-4 text-green-500" />
          </div>
        )}
        
        {/* Map pin icon */}
        {!loading && !isValidAddress && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.placeId}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-zinc-700 focus:bg-gray-100 dark:focus:bg-zinc-700 focus:outline-none border-b border-gray-100 dark:border-zinc-700 last:border-b-0"
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {suggestion.structuredFormatting?.main_text || suggestion.description}
                  </div>
                  {suggestion.structuredFormatting?.secondary_text && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {suggestion.structuredFormatting.secondary_text}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Help text */}
      {!isValidAddress && value && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {suggestions.length > 0 
            ? "Type to search for Australian addresses. Select a suggestion to validate the format."
            : "Enter a valid Australian address (e.g., 123 George Street, Sydney NSW 2000). Powered by OpenStreetMap."
          }
        </p>
      )}
      
      {isValidAddress && (
        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
          ✓ Valid Australian address format
        </p>
      )}
    </div>
  )
} 