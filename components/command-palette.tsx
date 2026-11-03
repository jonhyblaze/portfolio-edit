"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { routes } from "@/data/routes"
import profile from "@/data/profile"
import { projects } from "@/data/projects"
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
  RiAtLine,
  RiFileUserLine,
  RiFilmLine,
  RiHomeLine,
  RiInstagramLine,
  RiMailLine,
  RiMovie2Line,
  RiTelegram2Line,
  RiUserLine,
  RiVolumeMuteLine,
  RiVolumeUpLine
} from "@remixicon/react"
import { Imdb } from "@/components/svg/imdb"

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
          <CommandItem onSelect={() => runCommand(() => router.push(routes.homepage))} className="cursor-pointer">
            <RiHomeLine />
            <span>Home</span>
          </CommandItem>
          <CommandItem
            keywords={["work", "films", "portfolio", "reels"]}
            onSelect={() => runCommand(() => router.push(routes.projects))}
            className="cursor-pointer">
            <RiMovie2Line />
            <span>Projects</span>
          </CommandItem>
          <CommandItem
            keywords={["bio", "filmography", "experience"]}
            onSelect={() => runCommand(() => router.push(routes.about))}
            className="cursor-pointer">
            <RiUserLine />
            <span>About</span>
          </CommandItem>
          <CommandItem
            keywords={["message", "hire", "form", "get in touch"]}
            onSelect={() => runCommand(() => router.push(routes.contact))}
            className="cursor-pointer">
            <RiMailLine />
            <span>Contact</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Built from the project list itself, so a new project shows up here with
            no second place to remember. */}
        <CommandGroup heading="Projects">
          {projects.map((project) => (
            <CommandItem
              key={project.slug}
              keywords={["project", "projects", project.type, project.director, String(project.year), ...(project.keywords ?? [])]}
              onSelect={() => runCommand(() => router.push(routes.project(project.slug)))}
              className="cursor-pointer">
              <RiFilmLine />
              <span>{project.title.trim()}</span>
              <CommandShortcut>{project.year}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Links">
          <CommandItem
            keywords={["email", "mail", "write", "hire", profile.email]}
            onSelect={() => runCommand(() => (window.location.href = `mailto:${profile.email}`))}
            className="cursor-pointer">
            <RiAtLine />
            <span>Email</span>
            <CommandShortcut className="truncate tracking-normal">{profile.email}</CommandShortcut>
          </CommandItem>
          {profile.cv && (
            <CommandItem
              keywords={["resume", "pdf", "download"]}
              onSelect={() => runCommand(() => window.open(profile.cv!, "_blank"))}
              className="cursor-pointer">
              <RiFileUserLine />
              <span>CV</span>
            </CommandItem>
          )}
          <CommandItem
            keywords={["credits", "filmography"]}
            onSelect={() => runCommand(() => window.open(profile.imdb, "_blank"))}
            className="cursor-pointer">
            <Imdb />
            <span>IMDb</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open(profile.instagram, "_blank"))} className="cursor-pointer">
            <RiInstagramLine />
            <span>Instagram</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open(profile.telegram, "_blank"))} className="cursor-pointer">
            <RiTelegram2Line />
            <span>Telegram</span>
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
