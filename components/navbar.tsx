"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "@/components/theme-provider"
import { usePathname } from "next/navigation"
import { LogOut, Sun, Moon, PlusCircle, Menu, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const navLinks = [
  { href: "/jobs", label: "Job Search", match: /^\/jobs/ },
  { href: "/locations", label: "Locations", match: /^\/locations/ },
  { href: "/career-info", label: "Career Info", match: /^\/career-info/ },
  { href: "/blog", label: "Blog", match: /^\/blog/ },
  { href: "/employer", label: "For Employers", match: /^\/employer/ },
  { href: "/resources", label: "Resources", match: /^\/resources/ },
]

export function Navbar() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="w-full bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 px-4 md:px-8 py-3 flex items-center justify-between shadow-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <span className="sr-only">AlliedHealthJobs.au</span>
        <Image
          src={theme === "dark" ? "/Logo-dark.png" : "/Logo-light.png"}
          alt="AlliedHealthJobs.au Logo"
          width={240}
          height={240}
          className="h-8 w-auto object-contain"
          priority
        />
      </Link>

      {/* Desktop Navigation - Centered */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-medium transition ${link.match.test(pathname)
              ? 'text-violet-700 dark:text-violet-400'
              : 'text-gray-700 dark:text-white hover:text-violet-700 dark:hover:text-violet-400'}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Desktop Right Side */}
      <div className="hidden md:flex items-center gap-4">
        {user && (
          <Link href="/post-job">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Post Job
            </Button>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
        {user ? (
          <>
            <span className="text-gray-700 dark:text-white font-medium">{user.name}</span>
            <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
              <LogOut className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">Sign In</Button>
          </Link>
        )}
      </div>

      {/* Mobile Right Side - Theme Toggle and Menu Button */}
      <div className="flex md:hidden items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute top-0 right-0 w-64 h-full bg-white dark:bg-zinc-900 shadow-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-zinc-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 dark:text-gray-400"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Mobile Navigation Links */}
            <div className="flex-1 p-4">
              <div className="space-y-4">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-lg font-medium transition ${
                      link.match.test(pathname)
                        ? 'text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20'
                        : 'text-gray-700 dark:text-white hover:text-violet-700 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile User Section - At Bottom */}
            <div className="border-t border-gray-200 dark:border-zinc-700 p-4 space-y-3">
              {user ? (
                <>
                  <div className="text-gray-700 dark:text-white font-medium text-center mb-2">{user.name}</div>
                  <Link href="/post-job" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Post Job
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 