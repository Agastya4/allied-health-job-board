'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
      <Link 
        href="/" 
        className="flex items-center hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
      >
        <Home className="h-4 w-4 mr-1" />
        Home
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-gray-300 font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
} 