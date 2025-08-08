"use client"
import { ModernAuthForm } from "@/components/modern-auth-form"
import { SEO } from "@/components/seo"

export default function SignUpPage() {
  return (
    <>
      <SEO 
        title="Sign Up - AlliedHealthJobs.au"
        description="Create your AlliedHealthJobs.au employer account to post jobs and find qualified allied health professionals."
        keywords={[
          'sign up',
          'register',
          'employer registration',
          'job board registration',
          'allied health jobs registration'
        ]}
        url="/signup"
        type="website"
      />
      <ModernAuthForm mode="signup" redirectTo="/" />
    </>
  )
} 