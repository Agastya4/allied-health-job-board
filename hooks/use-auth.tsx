"use client"

import React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface User {
  id: number
  email: string
  name: string
  role: string
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, name: string, password: string, role?: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (response.ok) {
        const text = await response.text()
        if (text) {
          try {
            const data = JSON.parse(text)
            setUser(data.user)
          } catch (parseError) {
            console.error("JSON parse error in refreshUser:", parseError)
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("refreshUser error:", error)
      setUser(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const text = await response.text()

      if (!response.ok) {
        let errorMessage = "Sign in failed"
        if (text) {
          try {
            const errorData = JSON.parse(text)
            errorMessage = errorData.error || errorMessage
          } catch (parseError) {
            console.error("Error parsing sign in response:", parseError)
            errorMessage = `Server error: ${response.status}`
          }
        }
        throw new Error(errorMessage)
      }

      if (text) {
        try {
          const data = JSON.parse(text)
          setUser(data.user)
        } catch (parseError) {
          console.error("JSON parse error in signIn:", parseError)
          throw new Error("Invalid response from server")
        }
      } else {
        throw new Error("Empty response from server")
      }
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  const signUp = async (email: string, name: string, password: string, role = "job_seeker") => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, name, password, role }),
      })

      const text = await response.text()

      if (!response.ok) {
        let errorMessage = "Sign up failed"
        if (text) {
          try {
            const errorData = JSON.parse(text)
            errorMessage = errorData.error || errorMessage
          } catch (parseError) {
            console.error("Error parsing sign up response:", parseError)
            errorMessage = `Server error: ${response.status}`
          }
        }
        throw new Error(errorMessage)
      }

      if (text) {
        try {
          const data = JSON.parse(text)
          setUser(data.user)
        } catch (parseError) {
          console.error("JSON parse error in signUp:", parseError)
          throw new Error("Invalid response from server")
        }
      } else {
        throw new Error("Empty response from server")
      }
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setUser(null)
    }
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [])

  const contextValue: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>")
  }
  return ctx
}
