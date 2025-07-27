"use client"

import { X, Phone, Mail, MapPin, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Job } from "@/hooks/use-jobs"

interface ApplyJobModalProps {
  job: Job
  onClose: () => void
}

export function ApplyJobModal({ job, onClose }: ApplyJobModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <CardHeader className="border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-gray-900 dark:text-white">Contact Details</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <Mail className="h-5 w-5 text-violet-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{job.contact_email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <Phone className="h-5 w-5 text-violet-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{job.contact_phone}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="border-gray-300 dark:border-zinc-600 bg-transparent flex-1">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
