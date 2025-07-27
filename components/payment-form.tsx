"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CreditCard, CheckCircle } from "lucide-react"

interface PaymentFormProps {
  amount: number
  currency: string
  jobTitle: string
  jobId: string
  onPaymentSuccess: (paymentIntentId: string) => void
  onPaymentError: (error: string) => void
  onCancel: () => void
}

export function PaymentForm({ 
  amount, 
  currency, 
  jobTitle, 
  jobId,
  onPaymentSuccess, 
  onPaymentError, 
  onCancel 
}: PaymentFormProps) {
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const { toast } = useToast()

  // Format amount for display
  const formattedAmount = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)

  useEffect(() => {
    checkPaymentStatus()
  }, [])

  const checkPaymentStatus = async () => {
    try {
      console.log("Creating checkout session for job:", { jobId, jobTitle, amount, currency })
      
      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          jobId,
          jobTitle,
          amount,
          currency 
        }),
      })

      const data = await response.json()
      console.log("Checkout session response:", { status: response.status, data })

      if (!response.ok) {
        if (data.requiresPayment === false) {
          // Payment not required
          console.log("Payment not required:", data.message)
          onPaymentSuccess("free")
          return
        }
        throw new Error(data.error || "Failed to create checkout session")
      }

      if (data.requiresPayment === false) {
        // Payment not required
        console.log("Payment not required:", data.message)
        onPaymentSuccess("free")
        return
      }

      // Redirect to Stripe Checkout
      if (data.checkoutUrl) {
        console.log("Redirecting to Stripe Checkout:", data.checkoutUrl)
        window.location.href = data.checkoutUrl
      } else {
        throw new Error("No checkout URL received")
      }

    } catch (error) {
      console.error("Error creating checkout session:", error)
      onPaymentError(error instanceof Error ? error.message : "Payment setup failed")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-violet-600" />
            <p className="text-gray-600 dark:text-gray-400">Setting up payment...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paymentSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your job posting will be published shortly.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Complete Payment
        </CardTitle>
        <CardDescription>
          Pay {formattedAmount} to publish your job posting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Job Title:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{jobTitle}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
            <span className="text-lg font-semibold text-violet-600">{formattedAmount}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={checkPaymentStatus}
            disabled={processing}
            className="w-full"
            size="lg"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay {formattedAmount}
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={processing}
            className="w-full"
          >
            Cancel
          </Button>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          You will be redirected to Stripe's secure payment page to complete your transaction.
        </div>
      </CardContent>
    </Card>
  )
} 