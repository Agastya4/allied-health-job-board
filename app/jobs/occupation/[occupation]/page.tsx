import OccupationJobPageClient from "./OccupationJobPageClient"

export default async function OccupationJobPage({ params }: { params: Promise<{ occupation: string }> }) {
  const { occupation } = await params
  return <OccupationJobPageClient occupation={occupation} />
} 