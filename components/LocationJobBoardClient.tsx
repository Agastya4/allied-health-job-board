"use client";

import { StandardizedJobPreview } from "@/components/standardized-job-preview";
import type { JobFilters } from "@/hooks/use-jobs";

// Helper function to normalize location strings
function normalizeLocation(str: string): string {
  return str ? str.trim().toLowerCase().replace(/\s+/g, '-') : '';
}

export default function LocationJobBoardClient({ city, state, category, title, prompt }: { city: string; state: string; category: string; title?: string; prompt?: string }) {
  // Normalize the incoming parameters to match database format
  const normalizedCity = normalizeLocation(city);
  const normalizedState = normalizeLocation(state);
  
  const initialFilters: JobFilters = {
    city: normalizedCity || undefined,
    state: normalizedState || undefined,
    occupation: category || undefined,
  };

  return (
    <StandardizedJobPreview
      initialFilters={initialFilters}
      title={title}
      prompt={prompt}
      shiftDown={true}
      autoSelectFirst={true}
    />
  );
} 