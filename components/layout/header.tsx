"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { navItems } from "@/data/nav-items"
import { RiMoonLine, RiSunLine } from "@remixicon/react"

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/10">
      <div className="max-w-[1240px] mx-auto flex px-5 sm:px-16 laptop:px-0 h-16 items-center justify-between">
        <Link href="/" className="label-l transition-opacity hover:opacity-80">
          Oleksandr Korotun
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const activeRoute = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className="hidden md:flex">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "button transition-all duration-200 hover:bg-transparent",
                    activeRoute ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}>
                  {item.label}
                </Button>
              </Link>
            )
          })}

          <Button
            variant="ghost"
            size="sm"
            className="rounded ml-2 hidden md:flex hover:bg-transparent border-transparent border hover:border-black dark:hover:border-white/50 transition-all duration-200"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme">
            <RiSunLine className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <RiMoonLine className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="button rounded ml-2 gap-2 text-muted-foreground bg-transparent border-black/25 dark:border-white/25 hover:border-black dark:hover:border-white/50 hover:bg-transparent dark:hover:bg-transparent"
            onClick={() => {
              const event = new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
                bubbles: true
              })
              document.dispatchEvent(event)
            }}>
            <p>Search</p>
            <p className="flex gap-0.5 items-center border rounded px-2">
              <span className="relative text-md top-[1px]">⌘</span>
              <span>K</span>
            </p>
          </Button>
        </nav>
      </div>
    </header>
  )
}
