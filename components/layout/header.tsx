"use client"
import Link from "next/link"
import NavItem from "./nav-item"
import CommandButton from "./command-button"
import { navItems } from "@/data/nav-items"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/10">
      <div className="max-w-[1280px] mx-auto flex px-5 sm:px-16 laptop:px-0 h-16 items-center justify-between">
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
