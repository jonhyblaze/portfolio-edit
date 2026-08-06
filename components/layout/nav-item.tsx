"use client"

import { navItems } from "@/data/nav-items"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NavItem = ({ item }: { item: (typeof navItems)[0] }) => {
  const pathname = usePathname()
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
}

export default NavItem
