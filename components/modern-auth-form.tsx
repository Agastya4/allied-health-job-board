"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { X } from "lucide-react"
import Image from "next/image"

interface ModernAuthFormProps {
  mode: "signin" | "signup"
  onClose?: () => void
  redirectTo?: string
}

export function ModernAuthForm({ mode: initialMode, onClose, redirectTo }: ModernAuthFormProps) {
  const [mode, setMode] = useState<ModernAuthFormProps["mode"]>(initialMode)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "employer", // Only employer
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (mode === "signin") {
        await signIn(formData.email, formData.password)
        if (onClose) onClose()
        if (redirectTo) router.push(redirectTo)
        else router.push("/")
      } else {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            password: formData.password,
            role: "employer",
          }),
        })
        const data = await res.json()
        if (res.ok && data.success) {
          setVerificationSent(true)
        } else {
          setError(data.error || data.message || "Signup failed.")
        }
      }
    } catch (err) {
      console.error("Auth error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (verificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Check Your Email</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              A verification link has been sent to your email address. Please verify your email to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl" 
              onClick={() => router.push("/sign-in")}
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-white dark:bg-gray-900 relative">
        {/* Mobile background image */}
        <div className="lg:hidden absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-gray-800/5"></div>
        </div>

        <div className="w-full max-w-md">
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white z-10"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          )}

          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {mode === "signin" ? "Welcome Back" : "Create Your Account"} 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg leading-relaxed">
              {mode === "signin" 
                ? "Today is a new day. It's your day. You shape it. Sign in to start managing your allied health career."
                : "Join our community of employers and find the best allied health professionals for your organisation."
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                placeholder="example@email.com"
                required
              />
            </div>

            {mode === "signup" && (
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                placeholder="At least 8 characters"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl" 
              disabled={loading}
            >
              {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}
            </Button>

            {mode === "signin" && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none transition-colors duration-200"
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </div>
            )}
            {mode === "signup" && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none transition-colors duration-200"
                  onClick={() => setMode("signin")}
                >
                  Sign in
                </button>
              </div>
            )}
          </form>

          <div className="text-center mt-8 text-xs text-gray-500 dark:text-gray-400">
            © 2024 AlliedHealthJobs.au. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right side - Image (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-8 rounded-3xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Allied Health Professionals"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>
    </div>
  )
} 