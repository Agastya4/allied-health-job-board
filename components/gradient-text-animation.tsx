"use client"

interface GradientTextAnimationProps {
  children: React.ReactNode
  className?: string
}

export function GradientTextAnimation({ 
  children, 
  className = ""
}: GradientTextAnimationProps) {
  return (
    <span 
      className={`bg-gradient-to-r from-violet-600 via-violet-500 to-violet-700 bg-clip-text text-transparent animate-gradient ${className}`}
    >
      {children}
    </span>
  )
} 