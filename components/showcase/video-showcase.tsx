"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export type VideoReel = {
  id: string
  /** Path to the video file, e.g. "/showcase/lucky.mp4" */
  src: string
  /** Still shown before the video is ready / while paused */
  poster?: string
  /** Primary caption, e.g. the project name */
  label?: string
  /** Secondary caption line, e.g. "Director of Photography — Yaron Orbach" */
  meta?: string
  /** Corner radius in px. Default 0 — cinematic frames are usually sharp. */
  radius?: number
  /** Horizontal fill of the stage, 0–100. Below 100 reveals black bars left/right (pillarbox). Default 100. */
  width?: number
  /** Vertical fill of the stage, 0–100. Below 100 reveals black bars top/bottom (letterbox). Default 100. */
  height?: number
  /** How the video fills its frame. Default "cover". */
  fit?: "cover" | "contain"
}

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

export function VideoShowcase({ reels, className }: { reels: VideoReel[]; className?: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [active, setActive] = useState(0)
  const count = reels.length

  // Map scroll position within the section to the active reel index.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect()
        const scrollable = section.offsetHeight - window.innerHeight
        const progress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0
        const idx = count > 1 ? Math.round(progress * (count - 1)) : 0
        setActive((prev) => (prev === idx ? prev : idx))
      })
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [count])

  // Only the active reel plays; the rest stay paused to keep things light.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === active) video.play().catch(() => {})
      else video.pause()
    })
  }, [active])

  const goTo = useCallback(
    (idx: number) => {
      const section = sectionRef.current
      if (!section) return
      const scrollable = section.offsetHeight - window.innerHeight
      const top = section.offsetTop + (count > 1 ? (idx / (count - 1)) * scrollable : 0)
      window.scrollTo({ top, behavior: "smooth" })
    },
    [count]
  )

  if (count === 0) return null

  const current = reels[active]

  return (
    <section
      ref={sectionRef}
      aria-label="Selected work"
      className={cn("relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen", className)}
      style={{ height: `${count * 100}vh` }}>
      {/* Sticky full-screen stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Stacked videos — crossfade between reels */}
        {reels.map((reel, i) => {
          const w = reel.width ?? 100
          const h = reel.height ?? 100
          return (
            <div
              key={reel.id}
              aria-hidden={i !== active}
              className={cn(
                "absolute inset-0 grid place-items-center transition-opacity duration-700 ease-out",
                i === active ? "opacity-100" : "pointer-events-none opacity-0"
              )}>
              <div
                className="relative overflow-hidden bg-black"
                style={{ width: `${w}%`, height: `${h}%`, borderRadius: reel.radius ?? 0 }}>
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el
                  }}
                  src={reel.src}
                  poster={reel.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className={cn("h-full w-full", reel.fit === "contain" ? "object-contain" : "object-cover")}
                />
              </div>
            </div>
          )
        })}

        {/* Legibility scrim for the caption */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        {/* Caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-1.5 px-6 pb-14 text-center md:pb-20">
          {current && (current.label || current.meta) && (
            <div
              key={current.id}
              className="flex flex-col items-center gap-1.5 duration-500 animate-in fade-in-0 slide-in-from-bottom-2">
              {current.label && <p className="h4 text-white">{current.label}</p>}
              {current.meta && <p className="label-s uppercase tracking-widest text-white/60">{current.meta}</p>}
            </div>
          )}
        </div>

        {/* Radio navigation */}
        <nav
          aria-label="Showcase navigation"
          className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-3 md:right-8">
          {reels.map((reel, i) => (
            <button
              key={reel.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={reel.label ? `Go to ${reel.label}` : `Go to reel ${i + 1}`}
              aria-current={i === active}
              className="group grid place-items-center p-1.5">
              <span
                className={cn(
                  "block w-[6px] rounded-full transition-all duration-300 ease-out",
                  i === active ? "h-6 bg-white" : "h-[6px] bg-white/40 group-hover:bg-white/70"
                )}
              />
            </button>
          ))}
        </nav>
      </div>
    </section>
  )
}
