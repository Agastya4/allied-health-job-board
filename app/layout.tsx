import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Logo.png" type="image/png" />
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
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
