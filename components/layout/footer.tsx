"use client"

import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname()
  return (
    <footer className="border-t border-muted-foreground dark:border-white/10">
      <div className="flex flex-col justify-between max-w-[1240px] mx-auto px-5 sm:px-16 laptop:px-0  pt-6 pb-10 gap-10 lg:gap-0 lg:flex-row">
      </div>
    </footer>
  )
}
