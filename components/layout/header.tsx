"use client"
import Link from "next/link"
import NavItem from "./nav-item"
import CommandButton from "./command-button"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { navItems } from "@/data/nav-items"
import { cn } from "@/lib/utils"

const SKIP_BLUR_ROUTES = new Set(["/"])

export function Header() {
  // Transparent while it sits over the hero; blurred bar once content scrolls under it.
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 border-border bg-background/10 backdrop-blur supports-backdrop-filter:bg-background/5",
        !scrolled && "backdrop-blur-none",
        SKIP_BLUR_ROUTES.has(pathname) && "backdrop-blur-none"
      )}>
      <div className="max-w-8xl mx-auto flex px-5 sm:px-16 laptop:px-0 h-16 items-center justify-between">
        <Link href="/" className="label-l transition-opacity hover:opacity-80">
          Oleksandr Korotun
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavItem item={item} key={item.href} />
          ))}
          <CommandButton />
        </nav>
      </div>
    </header>
  )
}
