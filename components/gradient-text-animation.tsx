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
      className={`bg-gradient-to-r from-green-600 via-green-500 to-green-700 bg-clip-text text-transparent animate-gradient ${className}`}
    >
      {children}
    </span>
  )
} 