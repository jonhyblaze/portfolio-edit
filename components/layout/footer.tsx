"use client"

import Link from "next/link"
import profile from "@/data/profile"
import { usePathname } from "next/navigation"
import { routes } from "@/data/routes"
import { navItems } from "@/data/nav-items"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Arrow } from "@/components/svg/arrow"

export function Footer() {
  const pathname = usePathname()
  return (
    <footer className="border-t border-muted-foreground dark:border-white/10">
      <div className="flex flex-col justify-between max-w-[1240px] mx-auto px-5 sm:px-16 laptop:px-0  pt-6 pb-10 gap-10 lg:gap-0 lg:flex-row">
        <aside className="lg:w-1/2">
          <Link href={routes.homepage} className="label-l hover:text-black/85 dark:hover:text-white/85">
            {profile.name}
          </Link>
        </aside>
        <div className="flex gap-4 justify-between lg:w-1/2">
          <nav className="flex flex-col gap-4">
            {navItems.map((route) => {
              const activeRoute = pathname === route.href
              return (
                <Link
                  href={route.href}
                  key={route.label}
                  className={cn(
                    "button hover:text-primary transition-color duration-200",
                    activeRoute ? "text-primary" : "text-muted-foreground"
                  )}>
                  {route.label}
                </Link>
              )
            })}
            <ul className="flex flex-col gap-4 sm:hidden">
              <li className="button">Projects</li>
              {Object.values(profile.projects).map((project) => (
                <li key={project.title}>
                  <Link
                    href={project.case}
                    className="body-s text-muted-foreground hover:text-white duration-200 transition-colors">
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex-col gap-4 hidden sm:flex">
            <li className="button">Projects</li>
            {Object.values(profile.projects).map((project) => (
              <li key={project.title}>
                <Link
                  href={project.case}
                  className="body-s text-muted-foreground hover:text-primary duration-200 transition-colors">
                  {project.title}
                </Link>
              </li>
            ))}
          </ul>

          <Link href={routes.contact} className="group h-fit">
            <Button className="button rounded">
              Contact Me
              <Arrow className="-rotate-90 group-hover:translate-x-1 transition-transform duration-200"/>
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  )
}
