import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { usePathname } from "next/navigation"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  // Fallback for SSR/SSG: usePathname hook (client only)
  let landing = false;
  try {
    // This will only work on client
    // eslint-disable-next-line react-hooks/rules-of-hooks
    landing = require('next/navigation').usePathname?.() === '/';
  } catch {}
  // Fallback for SSR
  if (!landing && pathname === '/') landing = true;
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={`h-screen w-screen min-h-0 flex flex-col${landing ? ' landing-gradient-bg' : ''}`}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 min-h-0 flex flex-col">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
