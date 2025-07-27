"use client";
export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="mb-6 text-violet-700 hover:underline text-sm font-medium flex items-center gap-1"
    >
      <span className="text-lg">&larr;</span> Back
    </button>
  );
} 