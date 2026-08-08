"use client"

import profile from "@/data/profile"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-muted-foreground dark:border-white/10">
      <div className="flex flex-col justify-between max-w-7xl mx-auto px-5 sm:px-16 laptop:px-0  py-10 pb-10 gap-10 lg:gap-0 lg:flex-row">
        <h3 className="label-s text-center mx-auto">
          Designed by{" "}
          <Link
            href={profile.devPortfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="decoration-1 decoration-muted-foreground  underline underline-offset-4">
            Devtools 044
          </Link>{" "}
          | Kyiv, Ukraine 2026
        </h3>
      </div>
    </footer>
  )
}
