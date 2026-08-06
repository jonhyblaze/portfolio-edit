"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { routes } from "@/data/routes"
import profile from "@/data/profile"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command"
import {
  RiBookLine,
  RiBookMarkedLine,
  RiFileUserLine,
  RiGithubLine,
  RiHomeLine,
  RiLinkedinBoxLine,
  RiMailLine,
  RiUserLine
} from "@remixicon/react"

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()


  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))} className="cursor-pointer">
            <RiHomeLine />
            <span>Home</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/about"))} className="cursor-pointer">
            <RiUserLine />
            <span>About</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/contact"))} className="cursor-pointer">
            <RiMailLine />
            <span>Contact</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Projects">
          <CommandItem
            keywords={[
              "graphql",
              "video",
              "courses",
              "platform",
              "lms",
              "dashboard",
              "next",
              "next.js",
              "api",
              "project",
              "projects",
              "stripe",
              "hygraph",
              "clerk",
              "auth",
              "typography",
              "design",
              "tailwind css",
              ...profile.projects.academy.stack
            ]}
            onSelect={() => runCommand(() => router.push(routes.academy))}
            className="cursor-pointer">
            <RiBookMarkedLine />
            <span>NOISM Academy</span>
          </CommandItem>
          <CommandItem
            keywords={[
              "next.js",
              "next",
              "firebase",
              "tailwind css",
              "project",
              "projects",
              "typography",
              "design",
              ...profile.projects.hairculture.stack
            ]}
            onSelect={() => runCommand(() => router.push(routes.hairculture))}
            className="cursor-pointer">
            <RiBookMarkedLine />
            <span>NOISM Hairculture</span>
          </CommandItem>
          <CommandItem
            keywords={[
              "weather",
              "app",
              "dashboard",
              "next",
              "next.js",
              "api",
              "project",
              "projects",
              "tailwind css",
              "react",
              ...profile.projects.forecast.stack
            ]}
            onSelect={() => runCommand(() => router.push(routes.forecastStorm))}
            className="cursor-pointer">
            <RiBookLine />
            <span>Forecast Storm</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandSeparator />
        <CommandGroup heading="Links">
          <CommandItem onSelect={() => runCommand(() => window.open(profile.cv, "_blank"))} className="cursor-pointer">
            <RiFileUserLine />
            <span>CV Open</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open(profile.github, "_blank"))} className="cursor-pointer">
            <RiGithubLine />
            <span>GitHub</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open(profile.linkedIn, "_blank"))} className="cursor-pointer">
            <RiLinkedinBoxLine />
            <span>LinkedIn</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
