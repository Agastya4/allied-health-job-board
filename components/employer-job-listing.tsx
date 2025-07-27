import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Users } from "lucide-react"

interface EmployerJobListingProps {
  job: {
    id: string
    title: string
    location: string
    status: string
    applicants: number
    postedDate: string
  }
  onDelete?: (jobId: string) => void
}

export function EmployerJobListing({ job, onDelete }: EmployerJobListingProps) {
  return (
    <Card className="bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 p-4 flex items-center justify-between text-gray-900 dark:text-white">
      <div>
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{job.location}</p>
        <div className="flex items-center gap-2 text-sm mt-1">
          <Badge
            variant="outline"
            className="bg-gray-200 dark:bg-zinc-700 border-gray-400 dark:border-zinc-600 text-gray-700 dark:text-white"
          >
            Status: {job.status}
          </Badge>
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" /> {job.applicants} Applicants
          </span>
          <span className="text-gray-600 dark:text-gray-400">Posted: {job.postedDate}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-200 dark:bg-zinc-700 border-gray-400 dark:border-zinc-600 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-200 dark:bg-zinc-700 border-gray-400 dark:border-zinc-600 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600"
          onClick={() => onDelete?.(job.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </Card>
  )
}
