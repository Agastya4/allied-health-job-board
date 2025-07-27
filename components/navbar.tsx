"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "@/components/theme-provider"
import { usePathname } from "next/navigation"
import { LogOut, Sun, Moon, PlusCircle } from "lucide-react"
import Image from "next/image"

const navLinks = [
  { href: "/jobs", label: "Job Search", match: /^\/jobs/ },
  { href: "/locations", label: "Locations", match: /^\/locations/ },
  { href: "/employer", label: "For Employers", match: /^\/employer/ },
  { href: "/resources", label: "Resources", match: /^\/resources/ },
]

export function Navbar() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()

  return (
    <nav className="w-full bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 px-8 py-1 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="sr-only">AlliedHealthJobs.au</span>
          <Image
            src={theme === "dark" ? "/Logo-dark.png.png" : "/Logo-light.png.png"}
            alt="AlliedHealthJobs.au Logo"
            width={240}
            height={240}
            className="h-60 w-60 object-contain -my-20"
            priority
          />
        </Link>
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
      <div className="flex items-center gap-4">
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
    </nav>
  )
} 