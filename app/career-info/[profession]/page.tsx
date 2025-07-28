import ProfessionPageClient from "./ProfessionPageClient"

export default async function ProfessionPage({ params }: { params: Promise<{ profession: string }> }) {
  const { profession } = await params
  return <ProfessionPageClient profession={profession} />
} 