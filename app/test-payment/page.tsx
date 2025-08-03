"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { PaymentForm } from "@/components/payment-form"

export default function TestPaymentPage() {
  const [showPayment, setShowPayment] = useState(false)
  const { toast } = useToast()

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log("Payment success:", paymentIntentId)
    toast({
      title: "Payment successful!",
      description: paymentIntentId === "free" ? "Free job posting" : "Payment completed",
    })
    setShowPayment(false)
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
    toast({
      title: "Payment failed",
      description: error,
      variant: "destructive",
    })
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
  }

  const testPaymentConfig = async () => {
    try {
      const response = await fetch("/api/debug-payment")
      const data = await response.json()
      console.log("Payment config:", data)
      
      if (data.recommendations) {
        const issues = Object.values(data.recommendations).filter(Boolean)
        if (issues.length > 0) {
          toast({
            title: "Payment configuration issues found",
            description: issues.join(", "),
            variant: "destructive",
          })
        } else {
          toast({
            title: "Payment configuration looks good",
            description: "All required settings are configured",
          })
        }
      }
    } catch (error) {
      console.error("Config test error:", error)
      toast({
        title: "Configuration test failed",
        description: "Could not check payment configuration",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Payment Test</CardTitle>
          <CardDescription>
            Test the payment flow and configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testPaymentConfig} className="w-full">
            Test Payment Configuration
          </Button>
          
          <Button 
            onClick={() => setShowPayment(true)} 
            variant="outline" 
            className="w-full"
          >
            Test Payment Flow
          </Button>
        </CardContent>
      </Card>

      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <PaymentForm
            amount={100}
            currency="aud"
            jobTitle="Test Job Posting"
            jobId="test-123"
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            onCancel={handlePaymentCancel}
          />
        </div>
      )}
    </div>
  )
} 