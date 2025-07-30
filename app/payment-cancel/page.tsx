"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, Home, ArrowLeft } from "lucide-react"
import { SEO } from "@/components/seo"

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <>
      <SEO 
        title="Payment Cancelled - AlliedHealthJobs.au"
        description="Your job posting payment was cancelled. No charges were made. You can try the payment process again anytime."
        keywords={[
          'payment cancelled',
          'job posting payment cancelled',
          'allied health job posting',
          'healthcare recruitment payment'
        ]}
        url="/payment-cancel"
        type="website"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-gray-900 dark:text-white">
              Payment Cancelled
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your payment was cancelled. No charges were made to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Your job posting has been saved as a draft. You can complete the payment process anytime to make it live.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/post-job')}
                className="w-full"
                size="lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Try Payment Again
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => router.push('/')}
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Return to Job Board
              </Button>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              If you're having trouble with payment, please contact support for assistance.
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
} 