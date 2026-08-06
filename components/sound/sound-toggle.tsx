"use client"

import { RiVolumeMuteLine, RiVolumeUpLine } from "@remixicon/react"
import { useSound } from "@/components/sound/sound-provider"
import { cn } from "@/lib/utils"

/** Sits over the showcase, where the sound actually lives. */
export function SoundToggle({ className }: { className?: string }) {
  const { enabled, toggle } = useSound()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Disable sound" : "Enable sound"}
      className={cn(
        "flex items-center gap-2 rounded-full border border-white/30 bg-black/40 p-2 text-white/60",
        "backdrop-blur group transition-colors duration-500 hover:border-white/50 hover:text-white hover:px-3.5",
        className
      )}>
      {enabled ? <RiVolumeUpLine className="h-4 w-4" /> : <RiVolumeMuteLine className="h-4 w-4" />}
      <span className={cn("label-s hidden uppercase tracking-widest group-hover:inline transition-all duration-500")}>{enabled ? "Sound on" : "Sound off"}</span>
    </button>
  )
}
