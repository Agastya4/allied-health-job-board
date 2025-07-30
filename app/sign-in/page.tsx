"use client"
import { AuthForm } from "@/components/auth-form"
import { SEO } from "@/components/seo"

export default function SignInPage() {
  return (
    <>
      <SEO 
        title="Sign In - AlliedHealthJobs.au"
        description="Sign in to your AlliedHealthJobs.au account to post jobs, manage your profile, and access employer features."
        keywords={[
          'sign in',
          'login',
          'employer login',
          'job board login',
          'allied health jobs login'
        ]}
        url="/sign-in"
        type="website"
      />
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950 text-gray-900 dark:text-white">
        <AuthForm mode="signin" redirectTo="/" />
      </div>
    </>
  )
}
