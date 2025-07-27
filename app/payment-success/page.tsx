"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, Briefcase } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [jobTitle, setJobTitle] = useState("")

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (sessionId) {
      // Confirm the payment with our backend
      confirmPayment(sessionId)
    } else {
      setLoading(false)
      toast({
        title: "Payment confirmation failed",
        description: "No session ID found. Please contact support.",
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  const confirmPayment = async (sessionId: string) => {
    try {
      const response = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ sessionId }),
      })

      const data = await response.json()

      if (response.ok) {
        setJobTitle(data.jobTitle || "Your job posting")
        toast({
          title: "Payment successful!",
          description: "Your job listing is now live.",
        })
      } else {
        throw new Error(data.error || "Payment confirmation failed")
      }
    } catch (error) {
      console.error("Payment confirmation error:", error)
      toast({
        title: "Payment confirmation failed",
        description: "Please contact support if you were charged.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Confirming your payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-gray-900 dark:text-white">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Thank you for your payment. Your job posting is now live.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                {jobTitle}
              </span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Your job listing is now visible to candidates.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/')}
              className="w-full"
              size="lg"
            >
              <Home className="h-4 w-4 mr-2" />
              Return to Job Board
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => router.push('/post-job')}
              className="w-full"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Post Another Job
            </Button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            You will receive a confirmation email shortly. If you have any questions, please contact support.
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 