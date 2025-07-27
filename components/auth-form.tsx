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

interface AuthFormProps {
  mode: "signin" | "signup"
  onClose?: () => void
  redirectTo?: string
}

export function AuthForm({ mode: initialMode, onClose, redirectTo }: AuthFormProps) {
  const [mode, setMode] = useState<AuthFormProps["mode"]>(initialMode)
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
      <Card className="w-full max-w-md bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 relative">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Check Your Email</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            A verification link has been sent to your email address. Please verify your email to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white" onClick={() => router.push("/sign-in")}>Go to Sign In</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 relative">
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          {mode === "signin" ? "Sign In" : "Employer Sign Up"}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {mode === "signin" ? "Enter your credentials to access your account" : "Create an employer account to post jobs"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
              placeholder="m@example.com"
              required
            />
          </div>

          {mode === "signup" && (
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white" disabled={loading}>
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>

          {mode === "signin" && (
            <>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Demo accounts: employer@demo.com / jobseeker@demo.com (password: password123)
              </div>
              <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  className="text-violet-600 hover:underline focus:outline-none"
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </div>
            </>
          )}
          {mode === "signup" && (
            <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                className="text-violet-600 hover:underline focus:outline-none"
                onClick={() => setMode("signin")}
              >
                Sign in
              </button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
