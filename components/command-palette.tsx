"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { routes } from "@/data/routes"
import profile from "@/data/profile"
import { useSound } from "@/components/sound/sound-provider"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from "@/components/ui/command"
import {
  RiBookLine,
  RiBookMarkedLine,
  RiFileUserLine,
  RiHomeLine,
  RiInstagramLine,
  RiLinkedinBoxLine,
  RiMailLine,
  RiUserLine,
  RiVolumeMuteLine,
  RiVolumeUpLine
} from "@remixicon/react"

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { enabled: soundEnabled, toggle: toggleSound } = useSound()

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
              "project",
              "projects",
              ...profile.projects.papr.keywords
            ]}
            onSelect={() => runCommand(() => router.push(routes.papr))}
            className="cursor-pointer">
            <RiBookMarkedLine />
            <span>Paperushka</span>
          </CommandItem>
          <CommandItem
            keywords={[
              "project",
              "projects",
              ...profile.projects.icehole.keywords
            ]}
            onSelect={() => runCommand(() => router.push(routes.icehole))}
            className="cursor-pointer">
            <RiBookMarkedLine />
            <span>My Icehole</span>
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
              ...profile.projects.leopolis.keywords
            ]}
            onSelect={() => runCommand(() => router.push(routes.leopolis))}
            className="cursor-pointer">
            <RiBookLine />
            <span>Leopolis Night</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandSeparator />
        <CommandGroup heading="Links">
          <CommandItem onSelect={() => runCommand(() => window.open(profile.cv, "_blank"))} className="cursor-pointer">
            <RiFileUserLine />
            <span>CV Open</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open(profile.instagram, "_blank"))} className="cursor-pointer">
            <RiInstagramLine />
            <span>Instagram</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open(profile.linkedIn, "_blank"))} className="cursor-pointer">
            <RiLinkedinBoxLine />
            <span>LinkedIn</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          {/* Stays open on select so the state change is visible. */}
          <CommandItem
            keywords={["sound", "audio", "mute", "unmute", "silence", "volume", "sfx", "showcase"]}
            onSelect={toggleSound}
            className="cursor-pointer">
            {soundEnabled ? <RiVolumeUpLine /> : <RiVolumeMuteLine />}
            <span>{soundEnabled ? "Disable Sound" : "Enable Sound"}</span>
            <CommandShortcut>{soundEnabled ? "On" : "Off"}</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
