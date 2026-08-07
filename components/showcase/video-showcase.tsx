"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { SoundToggle } from "@/components/sound/sound-toggle"
import { useSound } from "@/components/sound/sound-provider"
import { FilmGrain } from "@/components/film-grain"
import { cn } from "@/lib/utils"

type SlideBase = {
  id: string
}

export type VideoReel = SlideBase & {
  kind?: "video"
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

/**
 * The beats between reels are timed: they hold, then the showcase moves itself
 * on. Reels are never timed — they loop for as long as you stay with them.
 */
type BeatBase = SlideBase & {
  /** How long this beat holds before pushing on, in ms. Default 7000. */
  hold?: number
}

/** A held beat of black between two reels. Nothing to look at — that is the point. */
export type PauseSlide = BeatBase & {
  kind: "pause"
}

/** One small line of type, set like a screenplay slug. */
export type CaptionSlide = BeatBase & {
  kind: "caption"
  text: string
  sub?: string
}

/** A full-bleed typographic statement, sized like a title card. */
export type QuoteSlide = BeatBase & {
  kind: "quote"
  text: string
  attribution?: string
}

/** The opening card. Untimed — it waits for the visitor rather than pushing them. */
export type TitleSlide = SlideBase & {
  kind: "title"
  text: string
  sub?: string
}

/** The showcase is a cut sequence: reels interrupted by pauses, captions and title cards. */
export type ShowcaseSlide = VideoReel | PauseSlide | CaptionSlide | QuoteSlide | TitleSlide

const isVideo = (slide: ShowcaseSlide): slide is VideoReel => (slide.kind ?? "video") === "video"

/** Beats that hold for a moment and then push on. The title card and reels do not. */
const isTimed = (slide: ShowcaseSlide): slide is PauseSlide | CaptionSlide | QuoteSlide =>
  slide.kind === "pause" || slide.kind === "caption" || slide.kind === "quote"

/** How long an intermediary beat holds before the showcase cuts to the next slide. */
const HOLD_MS = 7000

const splitWords = (text: string) => text.trim().split(/\s+/)

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

export function VideoShowcase({ slides, className }: { slides: ShowcaseSlide[]; className?: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [active, setActive] = useState(0)
  const { play } = useSound()
  const count = slides.length

  // Map scroll position within the section to the active slide index.
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

  // Each cut gets its own transition sound. Silent until the visitor turns sound on.
  const previous = useRef(active)
  useEffect(() => {
    if (previous.current === active) return
    previous.current = active
    const slide = slides[active]
    if (slide) play(slide.kind ?? "video")
  }, [active, slides, play])

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

  // An intermediary beat holds, then pushes on to the next slide by itself. Reels
  // are left alone — they loop until the visitor decides to move. The timer resets
  // whenever the active slide changes, so scrolling past a beat cancels its push.
  useEffect(() => {
    const slide = slides[active]
    if (!slide || !isTimed(slide)) return
    if (active + 1 >= count) return
    // Moving someone's viewport for them is exactly what reduced motion asks us not to do.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const timer = window.setTimeout(() => goTo(active + 1), slide.hold ?? HOLD_MS)
    return () => window.clearTimeout(timer)
  }, [active, slides, count, goTo])

  if (count === 0) return null

  const current = slides[active]
  const currentReel = current && isVideo(current) ? current : null

  return (
    <section
      ref={sectionRef}
      aria-label="Selected work"
      className={cn("relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] w-screen", className)}
      style={{ height: `${count * 100}vh` }}>
      {/* Sticky full-screen stage */}
      <div className={cn("sticky top-0 h-screen w-full overflow-hidden bg-black", count === 0 && "bg-teal-950")}>
        {/* Stacked slides — crossfade between them */}
        {slides.map((slide, i) => {
          const isActive = i === active

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 grid place-items-center transition-opacity duration-700 ease-out",
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              )}>
              {isVideo(slide) ? (
                <div
                  className="relative overflow-hidden bg-black"
                  style={{
                    width: `${slide.width ?? 100}%`,
                    height: `${slide.height ?? 100}%`,
                    borderRadius: slide.radius ?? 0
                  }}>
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el
                    }}
                    src={slide.src}
                    poster={slide.poster}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className={cn("h-full w-full", slide.fit === "contain" ? "object-contain" : "object-cover")}
                  />
                </div>
              ) : isActive ? (
                // Anomalies mount only while active, so their type animates in on every arrival.
                <Anomaly slide={slide} />
              ) : null}
            </div>
          )
        })}

        {/* Legibility scrim for the caption */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/10" />

        {/* Caption — reels only; the anomalies carry their own type */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-1.5 px-6 pb-14 text-center md:pb-20">
          {currentReel && (currentReel.label || currentReel.meta) && (
            <div
              key={currentReel.id}
              className="flex flex-col items-center gap-1.5 duration-500 animate-in fade-in-0 slide-in-from-bottom-2">
              {currentReel.label && <p className="h4 text-white">{currentReel.label}</p>}
              {currentReel.meta && <p className="label-s uppercase tracking-widest text-white/60">{currentReel.meta}</p>}
            </div>
          )}
        </div>

        {/* Radio navigation — reels read as dots, anomalies as thin ticks */}
        <nav
          aria-label="Showcase navigation"
          className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-3 md:right-8">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={slideLabel(slide, i)}
              aria-current={i === active}
              className="group grid place-items-center p-1.5">
              <span
                className={cn(
                  "block rounded-full transition-all duration-300 ease-out",
                  i === active
                    ? "h-6 w-1.5 bg-white"
                    : isVideo(slide)
                      ? "h-1.5 w-1.5 bg-white/40 group-hover:bg-white/70"
                      : "h-0.5 w-1.5 bg-white/25 group-hover:bg-white/60"
                )}
              />
            </button>
          ))}
        </nav>

        <SoundToggle className="absolute bottom-6 right-4 z-10 md:bottom-10 md:right-8" />
      </div>
    </section>
  )
}

function slideLabel(slide: ShowcaseSlide, i: number) {
  if (isVideo(slide)) return slide.label ? `Go to ${slide.label}` : `Go to reel ${i + 1}`
  if (slide.kind === "pause") return "Go to the pause"
  if (slide.kind === "caption") return `Go to ${slide.text}`
  if (slide.kind === "title") return "Back to the opening"
  return "Go to the title card"
}

function Anomaly({ slide }: { slide: PauseSlide | CaptionSlide | QuoteSlide | TitleSlide }) {
  return (
    <>
      {/* Grain first, then the type — both are positioned, so tree order puts the words on top. */}
      <FilmGrain className={slide.kind === "pause" ? undefined : "opacity-[0.2]"} />
      {slide.kind === "pause" ? (
        <CueMark />
      ) : slide.kind === "caption" ? (
        <CaptionCard slide={slide} />
      ) : slide.kind === "title" ? (
        <TitleCard slide={slide} />
      ) : (
        <QuoteCard slide={slide} />
      )}
    </>
  )
}

/** Black, grain, and the projectionist's cue mark warning of a reel change. */
function CueMark() {
  return (
    <span
      aria-hidden
      className="absolute right-[6vw] top-[10vh] block h-12 w-12 animate-cue-flash rounded-full border border-white md:h-16 md:w-16"
    />
  )
}

function CaptionCard({ slide }: { slide: CaptionSlide }) {
  return (
    <div className="relative px-8 text-center">
      <p className="label-s uppercase tracking-[0.4em] text-white/80 duration-700 animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both">
        {slide.text}
      </p>
      {slide.sub && (
        <p className="label-s mt-4 text-white/35 delay-200 duration-700 animate-in fade-in-0 fill-mode-both">{slide.sub}</p>
      )}
      <span
        aria-hidden
        className="mx-auto mt-8 block h-px w-10 bg-white/20 delay-300 duration-1000 animate-in fade-in-0 fill-mode-both"
      />
    </div>
  )
}

/** Display type that arrives a word at a time, the way a cut lands. */
function StaggeredLine({ text, className }: { text: string; className?: string }) {
  const words = splitWords(text)

  return (
    <p className={className}>
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block duration-700 animate-in fade-in-0 slide-in-from-bottom-4 fill-mode-both"
            style={{ animationDelay: `${i * 70}ms` }}>
            {word}
            {i < words.length - 1 && " "}
          </span>
        ))}
    </p>
  )
}

/** The opening card: grain, the headline, and a nudge that there is more below. */
function TitleCard({ slide }: { slide: TitleSlide }) {
  const words = splitWords(slide.text)

  return (
    <>
      <div className="relative max-w-5xl px-8 text-center md:px-16">
        <StaggeredLine text={slide.text} className="h1 z-50 text-balance  text-white" />
        {slide.sub && (
          <p
            className="label-s mt-10 uppercase tracking-[0.35em] text-white/50 duration-1000 animate-in fade-in-0 fill-mode-both"
            style={{ animationDelay: `${words.length * 70 + 200}ms` }}>
            {slide.sub}
          </p>
        )}
      </div>
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-3 delay-1000 duration-1000 animate-in fade-in-0 fill-mode-both">
        <span className="label-s uppercase tracking-[0.5em] text-white/80">Scroll</span>
        <span className="block h-16 w-px origin-top animate-scroll-hint bg-white/50" />
      </span>
    </>
  )
}

/** A statement card, set at title scale with a small line of credit beneath. */
function QuoteCard({ slide }: { slide: QuoteSlide }) {
  const words = splitWords(slide.text)

  return (
    <div className="relative max-w-5xl px-8 text-center md:px-16">
      <StaggeredLine text={slide.text} className="h1 text-balance leading-[1.05] text-white" />
      {slide.attribution && (
        <p
          className="label-s mt-10 uppercase tracking-[0.35em] text-white/40 duration-1000 animate-in fade-in-0 fill-mode-both"
          style={{ animationDelay: `${words.length * 70 + 200}ms` }}>
          {slide.attribution}
        </p>
      )}
    </div>
  )
}
