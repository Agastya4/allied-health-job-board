import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { Analytics } from "@/components/analytics"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'AlliedHealthJobs.au - Find Allied Health Jobs in Australia',
    template: '%s | AlliedHealthJobs.au'
  },
  description: 'Find the Best Allied Health Jobs in Australia. Browse Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions. Post Jobs and Connect with Qualified Professionals.',
  keywords: [
    'Allied Health Jobs',
    'Physiotherapy Jobs',
    'Occupational Therapy Jobs', 
    'Speech Pathology Jobs',
    'Healthcare Jobs Australia',
    'Allied Health Careers',
    'Healthcare Recruitment',
    'Medical Jobs',
    'Therapy Jobs',
    'Rehabilitation Jobs'
  ],
  authors: [{ name: 'AlliedHealthJobs.au' }],
  creator: 'AlliedHealthJobs.au',
  publisher: 'AlliedHealthJobs.au',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://alliedhealthjobs.au'),
  alternates: {
    canonical: 'https://alliedhealthjobs.au',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://alliedhealthjobs.au',
    title: 'AlliedHealthJobs.au - Find Allied Health Jobs in Australia',
    description: 'Find the Best Allied Health Jobs in Australia. Browse Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions.',
    siteName: 'AlliedHealthJobs.au',
    images: [
      {
        url: '/Logo.png',
        width: 1200,
        height: 630,
        alt: 'AlliedHealthJobs.au - Allied Health Job Board',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlliedHealthJobs.au - Find Allied Health Jobs in Australia',
    description: 'Find the Best Allied Health Jobs in Australia. Browse Physiotherapy, Occupational Therapy, Speech Pathology, and Other Healthcare Positions.',
    images: ['/Logo.png'],
    creator: '@alliedhealthjobs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'G-E14337071K',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/Logo.png" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="msapplication-TileColor" content="#7c3aed" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://alliedhealthjobs.au" />
      </head>
      <body className="h-screen w-screen min-h-0 flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 min-h-0 flex flex-col">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
