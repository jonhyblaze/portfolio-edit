"use client"

import { Fragment, useCallback, useEffect, useRef, useState } from "react"
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
 * The beats between reels. Nothing here moves on by itself — every slide, reel or
 * anomaly, waits for the visitor.
 */

/** A held beat of black between two reels. Nothing to look at — that is the point. */
export type PauseSlide = SlideBase & {
  kind: "pause"
}

/**
 * How long the card waits before it appears, in milliseconds.
 *
 * 0, the default, means it arrives with the cut. Anything higher holds the frame empty
 * first, so the line lands after a beat of nothing rather than the instant you get
 * there.
 *
 * It shifts the card whole. On a title or quote that means the whole ripple moves, its
 * first word included, and the credit line under it keeps its place at the end; on a
 * caption, which arrives in one piece, it moves the block. Nothing inside a card is
 * re-timed relative to anything else.
 */
type Delayed = {
  delay?: number
}

/** One small line of type, set like a screenplay slug. */
export type CaptionSlide = SlideBase &
  Delayed & {
    kind: "caption"
    text: string
    sub?: string
  }

/** A full-bleed typographic statement, sized like a title card. */
export type QuoteSlide = SlideBase &
  Delayed & {
    kind: "quote"
    text: string
    attribution?: string
  }

/** The opening card. It waits for the visitor rather than pushing them. */
export type TitleSlide = SlideBase &
  Delayed & {
    kind: "title"
    text: string
    sub?: string
  }

/**
 * One camera flash: a burst of blown-out white, then the bloom it leaves behind.
 *
 * The only slide with a duration. Everything else in the showcase waits for the
 * visitor; a flash is a moment rather than a beat, so it takes itself off again.
 */
export type FlashSlide = SlideBase & {
  kind: "flash"
  /** How long the flash is on screen before it leaves, in ms. Default 2000. */
  duration?: number
}

/** The showcase is a cut sequence: reels interrupted by pauses, captions and title cards. */
export type ShowcaseSlide = VideoReel | PauseSlide | CaptionSlide | QuoteSlide | TitleSlide | FlashSlide

const isVideo = (slide: ShowcaseSlide): slide is VideoReel => (slide.kind ?? "video") === "video"

/**
 * Gesture timing.
 *
 * Some idea of "still the same gesture" is unavoidable: a trackpad reports one
 * flick as dozens of events over as much as a second, and without this a single
 * flick would run through half the reel. The trick is releasing on the right
 * signal. Waiting for the wheel to fall silent is the wrong one — macOS keeps
 * sending coasting events long after the fingers have left the pad, so the reel
 * stays locked for the whole tail. These three read the shape of the gesture
 * instead, and nothing here is on a timer.
 */

/**
 * A gap this long, with nothing live arriving, means they let go.
 *
 * It has to clear the seam in the middle of a trackpad flick. One flick is not one
 * stream: the fingers produce a burst, they leave, and macOS then starts the coasting
 * events a moment later — a pause of anywhere up to about a fifth of a second sits
 * between the two halves. At 120ms that seam read as the end of one gesture and the
 * start of another, and a single flick stepped twice. Worse, both halves of this
 * value failed together: the silence timer also fired inside the seam and wiped
 * `peak`, so the first coasting event was measured against nothing and sailed past
 * the tail floor as if it were a fresh shove.
 *
 * Raising it does not lock the reel through a long tail: `lastLiveAt` only moves on
 * live events, so dregs never extend the wait — they are still ignored the moment
 * they fall below the floor.
 */
const GESTURE_IDLE_MS = 350

/**
 * Where a gesture stops being input and becomes debris.
 *
 * Measured against the gesture's own peak rather than a fixed number, because the
 * two ends of the range are so far apart: one notch of a mouse wheel reports
 * around 120, a slow two-finger drag reports single digits. Eight per cent of
 * whatever this particular gesture peaked at separates a flick's dying tail from
 * a hand still on the pad, at either scale.
 *
 * This is what keeps the reel from staying locked for the whole of a long
 * momentum tail: the dregs are ignored, so the gesture is over well before they
 * stop arriving.
 */
const TAIL_RATIO = 0.08

/** How far a finger has to travel before it is a swipe rather than a touch. */
const SWIPE_PX = 40

/** The gap between one word of a ripple and the next. */
const RIPPLE_MS = 70

/** How long a flash stays up before moving on, unless the slide says otherwise. */
const FLASH_MS = 300

const splitWords = (text: string) => text.trim().split(/\s+/)

export function VideoShowcase({ slides, className }: { slides: ShowcaseSlide[]; className?: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [active, setActive] = useState(0)
  const { play } = useSound()
  const count = slides.length

  /** The biggest delta seen since the wheel last went quiet, for sizing its tail. */
  const peak = useRef(0)
  /** When the last event big enough to count as a hand on the wheel arrived. */
  const lastLiveAt = useRef(0)
  const lastDirection = useRef(0)
  const silence = useRef<number | undefined>(undefined)
  const touchStart = useRef<number | null>(null)
  /**
   * Which way the visitor is going through the sequence. Only the flash reads it,
   * to know which way to leave: a slide that always moved forward would bounce
   * anyone travelling backwards straight back into the reel they just left.
   */
  const travel = useRef<1 | -1>(1)

  /**
   * One slide, in one direction, and it wraps at both ends — the last reel leads
   * back to the opening card rather than stopping.
   */
  const step = useCallback(
    (direction: 1 | -1) => {
      travel.current = direction
      setActive((current) => (current + direction + count) % count)
    },
    [count]
  )

  /** Jumping straight to a slide still counts as travelling, so the flash can follow it. */
  const goTo = useCallback(
    (index: number) => {
      if (index !== active) travel.current = index > active ? 1 : -1
      setActive(index)
    },
    [active]
  )

  /**
   * The showcase owns the wheel while it is on screen: the slides advance, the
   * page underneath does not move.
   *
   * One unbroken stream of wheel events is one gesture and is worth exactly one
   * slide, whether it was a nudge or a shove.
   *
   * The boundary is a gap in *live* events. A flick's decaying tail is debris: it
   * is skipped entirely, so it neither moves the reel nor holds it, and the reel
   * comes free while the tail is still dribbling out.
   *
   * Two things had to be got right here, and both were wrong before:
   *
   * There is no rising-magnitude test. A climbing delta reads the same whether it
   * is a second push or a slow drag still getting going, so calling it a push
   * landed one gesture two slides away.
   *
   * And `peak` outlives the gesture — it is cleared only once the wheel has been
   * completely silent. Clearing it when the tail went quiet made the very next
   * dreg look enormous next to a peak of nothing, and the tail stepped the reel
   * on by itself.
   */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()

      const direction = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0
      if (!direction) return

      const now = performance.now()
      const magnitude = Math.abs(event.deltaY)

      // Any event at all, debris included, means the wheel has not gone quiet yet.
      // Only real silence forgets how big this gesture was.
      window.clearTimeout(silence.current)
      silence.current = window.setTimeout(() => {
        peak.current = 0
      }, GESTURE_IDLE_MS)

      // Reversing is always a new gesture: momentum never turns around.
      if (direction !== lastDirection.current) {
        lastDirection.current = direction
        peak.current = 0
        lastLiveAt.current = 0
      }

      peak.current = Math.max(peak.current, magnitude)

      // Too small to be a hand on the wheel — skip it without it counting as the
      // gesture carrying on.
      if (magnitude < peak.current * TAIL_RATIO) return

      const continuing = now - lastLiveAt.current <= GESTURE_IDLE_MS
      lastLiveAt.current = now
      if (continuing) return

      step(direction)
    }

    const onTouchStart = (event: TouchEvent) => {
      touchStart.current = event.touches[0]?.clientY ?? null
    }

    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault()

      const start = touchStart.current
      const y = event.touches[0]?.clientY
      if (start === null || y === undefined) return

      const travelled = start - y
      if (Math.abs(travelled) < SWIPE_PX) return

      // Dropping the origin ends the swipe here, so the rest of the drag — however
      // far it runs — cannot move a second slide.
      touchStart.current = null
      step(travelled > 0 ? 1 : -1)
    }

    const onTouchEnd = () => {
      touchStart.current = null
    }

    section.addEventListener("wheel", onWheel, { passive: false })
    section.addEventListener("touchstart", onTouchStart, { passive: true })
    section.addEventListener("touchmove", onTouchMove, { passive: false })
    section.addEventListener("touchend", onTouchEnd, { passive: true })
    section.addEventListener("touchcancel", onTouchEnd, { passive: true })

    return () => {
      section.removeEventListener("wheel", onWheel)
      section.removeEventListener("touchstart", onTouchStart)
      section.removeEventListener("touchmove", onTouchMove)
      section.removeEventListener("touchend", onTouchEnd)
      section.removeEventListener("touchcancel", onTouchEnd)
      window.clearTimeout(silence.current)
    }
  }, [step])

  /**
   * The arrows read as scroll: down is forward, up is back, one slide per press.
   *
   * This listens on the window rather than the section, because a <section> takes no
   * focus and a listener bound to it would need a click before the keys did anything.
   * The cost of listening that widely is that it has to know when to keep quiet, hence
   * the three ways out below: someone typing, the command palette open over the top,
   * and — the one that matters most — the showcase no longer being what is on screen.
   * Past the stage the arrows go back to scrolling the page, the way they should.
   *
   * A held arrow is one gesture and so is worth one slide, which is the same bargain
   * the wheel makes with a flick.
   */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return

      const direction = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0
      if (!direction) return

      const target = event.target instanceof HTMLElement ? event.target : null
      if (target?.closest("input, textarea, select, [contenteditable]")) return
      if (document.querySelector('[role="dialog"]')) return

      const section = sectionRef.current
      if (!section) return
      const { top, bottom } = section.getBoundingClientRect()
      const middle = window.innerHeight / 2
      if (top > middle || bottom < middle) return

      event.preventDefault()
      step(direction)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [step])

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

  /**
   * The flash is the one slide on a timer. A pause, a caption and a quote each hold
   * until the visitor moves, exactly as a reel does — the sequence is theirs to read
   * at whatever pace they read it. A flash is not something to read: it goes off and
   * it is over, so it takes itself off again.
   *
   * It leaves the way the visitor was going, so coming up from Leopolis carries on
   * upward instead of shoving them back down into it. The timer is cleared whenever
   * the active slide changes, so gesturing off the flash early cancels the push
   * rather than moving them a second time a moment later.
   */
  useEffect(() => {
    const slide = slides[active]
    if (!slide || slide.kind !== "flash") return

    const timer = window.setTimeout(() => step(travel.current), slide.duration ?? FLASH_MS)
    return () => window.clearTimeout(timer)
  }, [active, slides, step])

  if (count === 0) return null

  const current = slides[active]
  const currentReel = current && isVideo(current) ? current : null

  return (
    // One viewport, and it stays there. The showcase used to be a tall scroll
    // track with a sticky stage, which tied the slide to the scroll offset — that
    // is what made a hard flick jump several reels, and what made looping past the
    // last one impossible. The gesture drives it now, so the section is just a stage.
    <section
      ref={sectionRef}
      aria-label="Selected work"
      className={cn(
        "relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] h-svh w-screen touch-none overflow-hidden bg-black",
        className
      )}>
      <div className="h-full w-full">
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

        {/* The burst fires at stage level rather than inside its slide, for two reasons:
            a slide crossfades in over 700ms and a flash that peaks in the first frames
            would be swallowed by that fade, and up here it blows out the scrim and the
            chrome the way a real flash blows out a room. Keyed on the slide index so it
            replays on every arrival and never on a loop. */}
        {current?.kind === "flash" && <FlashBurst key={`flash-${active}`} />}

        {/* Caption — reels only; the anomalies carry their own type */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-1.5 px-6 pb-14 text-center md:pb-20">
          {currentReel && (currentReel.label || currentReel.meta) && (
            <div
              key={currentReel.id}
              className="flex flex-col items-center gap-1 duration-500 animate-in fade-in-0 slide-in-from-bottom-2">
              {currentReel.label && <p className="h3 text-white">{currentReel.label}</p>}
              {currentReel.meta && <p className="label-m uppercase tracking-widest text-muted-foreground">{currentReel.meta}</p>}
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
                  i === active ? "h-6 w-1.5 bg-white" : "size-1.5 bg-white/40 group-hover:bg-white/70"
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
  if (slide.kind === "flash") return "Go to the flash"
  return "Go to the title card"
}

function Anomaly({ slide }: { slide: PauseSlide | CaptionSlide | QuoteSlide | TitleSlide | FlashSlide }) {
  return (
    <>
      {/* Grain first, then the type — both are positioned, so tree order puts the words on top. */}
      <FilmGrain className={slide.kind === "pause" ? undefined : "opacity-[0.2]"} />
      {slide.kind === "pause" ? (
        <CueMark />
      ) : slide.kind === "flash" ? (
        <FlashAfterglow />
      ) : slide.kind === "caption" ? (
        <CaptionCard slide={slide} />
      ) : slide.kind === "title" ? (
        <TitleCard slide={slide} />
      ) : (
        <QuoteCard slide={slide} />
      )}
      {/* Every anomaly gets the nudge, and only anomalies — a reel is already moving,
          so it says "there is more" on its own. This sits outside the kind switch
          because it belongs to the beat, not to any one card. */}
      <ScrollHint />
    </>
  )
}

/** The nudge under an anomaly: the word, and a line drawn downward over and over. */
function ScrollHint() {
  return (
    <span
      aria-hidden
      className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-3 delay-1000 duration-1000 animate-in fade-in-0 fill-mode-both">
      <span className="label-s uppercase tracking-[0.5em] text-white">Scroll</span>
      <span className="block h-16 w-px origin-top animate-scroll-hint bg-muted-foreground" />
    </span>
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

/**
 * The flash itself: one frame of blown-out white over the whole stage.
 *
 * `opacity-0` is the resting state, so if the animation is refused — reduced motion,
 * or a browser that will not run it — the screen simply never goes white.
 */
function FlashBurst() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-30 animate-camera-flash bg-white opacity-0 motion-reduce:animate-none"
    />
  )
}

/**
 * What the burst leaves behind. The slide has to rest on something once the white is
 * gone, or a flash would be indistinguishable from a pause; this is the bloom that
 * stays on the eye. It is also the whole of the slide under reduced motion, where it
 * sits there statically instead of blooming.
 */
function FlashAfterglow() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 animate-flash-afterglow opacity-0 motion-reduce:animate-none motion-reduce:opacity-40"
      style={{ background: "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.4), transparent 55%)" }}
    />
  )
}

/**
 * A line that ripples in a word at a time, left to right, instead of arriving whole.
 *
 * Each word fades up from just below over 700ms, and each starts RIPPLE_MS after the
 * one before it, so the line assembles itself across the frame rather than appearing
 * on it. `delay` shifts the whole ripple later, first word and all, for a card meant
 * to land after a beat of empty frame.
 */
function RippleText({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const words = splitWords(text)

  return (
    <p className={className}>
      {words.map((word, i) => (
        // The separator is a text node between the spans, not a trailing space inside
        // one. A space at the end of an inline-block is collapsed away, which ran every
        // word into the next; out here it renders, and the line still wraps on it.
        <Fragment key={`${word}-${i}`}>
          {i > 0 && " "}
          <span
            className="inline-block duration-700 animate-in fade-in-0 slide-in-from-bottom-4 fill-mode-both"
            style={{ animationDelay: `${delay + i * RIPPLE_MS}ms` }}>
            {word}
          </span>
        </Fragment>
      ))}
    </p>
  )
}

/** Where the ripple runs out: the slot after its last word, for a line set beneath it. */
const rippleEndsAt = (text: string, delay: number) => delay + splitWords(text).length * RIPPLE_MS

/**
 * Small type, so it arrives whole rather than rippling — a ripple across two words at
 * this size reads as a stutter. The card is one block, shifted by its own delay.
 */
function CaptionCard({ slide }: { slide: CaptionSlide }) {
  return (
    <div
      className="relative px-8 text-center duration-700 animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both"
      style={{ animationDelay: `${slide.delay ?? 0}ms` }}>
      <p className="h2 tracking-wide text-white">{slide.text}</p>
      {slide.sub && <p className="label-m tracking-[0.4em] mt-4 uppercase text-muted-foreground">{slide.sub}</p>}
      <span aria-hidden className="mx-auto mt-8 block h-px w-10  bg-muted-foreground" />
    </div>
  )
}

/** The opening card: grain and the headline. The nudge below it comes from Anomaly. */
function TitleCard({ slide }: { slide: TitleSlide }) {
  const delay = slide.delay ?? 0

  return (
    <div className="relative max-w-5xl px-8 text-center md:px-16">
      <RippleText text={slide.text} delay={delay} className="h1 z-50 text-balance  text-white" />
      {slide.sub && (
        <p
          className="label-m mt-10 uppercase tracking-[0.35em] text-muted-foreground duration-1000 animate-in fade-in-0 fill-mode-both"
          style={{ animationDelay: `${rippleEndsAt(slide.text, delay)}ms` }}>
          {slide.sub}
        </p>
      )}
    </div>
  )
}

/** A statement card, set at title scale with a small line of credit beneath. */
function QuoteCard({ slide }: { slide: QuoteSlide }) {
  const delay = slide.delay ?? 0

  return (
    <div className="relative max-w-5xl px-8 text-center md:px-16">
      <RippleText text={slide.text} delay={delay} className="h1 text-balance leading-21 text-white" />
      {slide.attribution && (
        <p
          className="label-m mt-10 uppercase tracking-[0.35em] text-muted-foreground duration-1000 animate-in fade-in-0 fill-mode-both"
          style={{ animationDelay: `${rippleEndsAt(slide.text, delay)}ms` }}>
          {slide.attribution}
        </p>
      )}
    </div>
  )
}
