"use client"
import { ModernAuthForm } from "@/components/modern-auth-form"
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
      <ModernAuthForm mode="signin" redirectTo="/" />
    </>
  )
}
