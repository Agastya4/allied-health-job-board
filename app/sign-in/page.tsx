"use client"
import { AuthForm } from "@/components/auth-form"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950 text-gray-900 dark:text-white">
      <AuthForm mode="signin" redirectTo="/" />
    </div>
  )
}
