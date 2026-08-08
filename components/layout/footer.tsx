"use client"
import profile from "@/data/profile"
import { usePathname } from "next/navigation"

const SKIP_RENDER = new Set(["/"])

export function Footer() {
  const pathname = usePathname()

  if (SKIP_RENDER.has(pathname)) return null

  return (
    <footer className="border-t border-muted-foreground dark:border-white/10">
      <div className="flex flex-col justify-between max-w-7xl mx-auto px-5 sm:px-16 laptop:px-0  py-10 pb-10 gap-10 lg:gap-0 lg:flex-row">
        <h3 className="text-muted-foreground label-s text-center mx-auto">
          Designed by{" "}
          <a
            href={profile.devPortfolio}
            target="_blank"
            className="decoration-1 decoration-muted-foreground  underline underline-offset-4 hover:text-foreground">
            Devtools 044
          </a>{" "}
          | Kyiv, Ukraine 2026
        </h3>
      </div>
    </footer>
  )
}
