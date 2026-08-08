"use client"

import { useRef } from "react"
import type { ProjectMarker } from "@/data/projects"
import { formatTimecode } from "@/lib/timecode"
import { cn } from "@/lib/utils"
import { GUTTER } from "./shared"

type ProjectTimelineProps = {
  /** Seconds. Whatever the element reports, or the declared length before it loads. */
  duration: number
  currentTime: number
  markers: ProjectMarker[]
  onSeek: (time: number) => void
  /** Only used to make the audio track's shape stable per film. */
  seed: string
}

/** Bars in the audio track. Enough to read as a waveform, few enough to stay a drawing. */
const WAVEFORM_BARS = 220

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

/**
 * A shape, not a waveform — but the same shape every time, which is what matters:
 * anything random here would differ between the server's HTML and the browser's.
 * Integer hashing only, so no float rounding can disagree across engines.
 */
const barHeight = (seed: number, index: number) => {
  let x = (seed + index * 2654435761) >>> 0
  x ^= x >>> 15
  x = Math.imul(x, 2246822519) >>> 0
  x ^= x >>> 13
  return 18 + (x % 82)
}

const seedOf = (value: string) => {
  let hash = 0
  for (let i = 0; i < value.length; i++) hash = (Math.imul(hash, 31) + value.charCodeAt(i)) >>> 0
  return hash
}

/**
 * Navigation, not editing. It borrows an NLE's vocabulary — a video track, an
 * audio track, a marker row, a playhead crossing all three — because that is the
 * grammar the material was cut in, and it stops there: nothing here can change
 * the film.
 *
 * The track area is one slider. Dragging scrubs, arrows nudge, markers jump.
 */
export function ProjectTimeline({ duration, currentTime, markers, onSeek, seed }: ProjectTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const scrubbing = useRef(false)
  const waveSeed = seedOf(seed)

  const progress = duration > 0 ? clamp(currentTime / duration, 0, 1) : 0
  const playhead = `${progress * 100}%`

  // A marker past the end belongs to a different cut of the film — versions can be
  // shorter than the master the markers were logged against.
  const visible = markers.filter((marker) => duration <= 0 || marker.time <= duration)
  const activeIndex = visible.reduce((found, marker, index) => (currentTime + 0.25 >= marker.time ? index : found), -1)

  const timeAt = (clientX: number) => {
    const track = trackRef.current
    if (!track || duration <= 0) return 0
    const rect = track.getBoundingClientRect()
    return clamp((clientX - rect.left) / rect.width, 0, 1) * duration
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = event.key === "PageUp" || event.key === "PageDown" ? 30 : 5
    let next: number | null = null

    if (event.key === "ArrowLeft" || event.key === "ArrowDown" || event.key === "PageDown") next = currentTime - step
    if (event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "PageUp") next = currentTime + step
    if (event.key === "Home") next = 0
    if (event.key === "End") next = duration

    if (next === null) return
    event.preventDefault()
    onSeek(clamp(next, 0, duration))
  }

  return (
    <section aria-label="Timeline" className={cn("shrink-0 border-b border-border py-4", GUTTER)}>
      {/* Below ~560px the timeline scrolls rather than compressing — marker labels
          stop being labels once they are 40px wide. */}
      <div className="overflow-x-auto overscroll-x-contain pb-1">
        <div className="min-w-[560px]">
          {/* Ruler */}
          <div className="mb-2 flex items-baseline justify-between pl-10">
            <span className="label-s tabular-nums text-muted-foreground/40">{formatTimecode(0)}</span>
            <span className="label-s tabular-nums text-muted-foreground/40">{formatTimecode(duration / 2)}</span>
            <span className="label-s tabular-nums text-muted-foreground/40">{formatTimecode(duration)}</span>
          </div>

          <div className="flex gap-3">
            {/* Track heads */}
            <div className="flex w-7 shrink-0 flex-col gap-1">
              <span className="label-s flex h-6 items-center text-muted-foreground/40">V1</span>
              <span className="label-s flex h-9 items-center text-muted-foreground/40">A1</span>
              <span className="label-s flex h-10 items-start pt-0.5 text-muted-foreground/40">MK</span>
            </div>

            <div className="relative flex-1">
              <div
                ref={trackRef}
                role="slider"
                tabIndex={0}
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                aria-valuenow={Math.round(currentTime)}
                aria-valuetext={`${formatTimecode(currentTime)} of ${formatTimecode(duration)}`}
                onKeyDown={onKeyDown}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId)
                  scrubbing.current = true
                  onSeek(timeAt(event.clientX))
                }}
                onPointerMove={(event) => {
                  if (scrubbing.current) onSeek(timeAt(event.clientX))
                }}
                onPointerUp={(event) => {
                  scrubbing.current = false
                  event.currentTarget.releasePointerCapture(event.pointerId)
                }}
                onPointerCancel={() => {
                  scrubbing.current = false
                }}
                className={cn(
                  "flex touch-none select-none flex-col gap-1",
                  "focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground/30"
                )}>
                {/* V1 — one unbroken block. The film is a single sequence here. */}
                <div className="relative h-6 overflow-hidden bg-foreground/10">
                  <div className="absolute inset-y-0 left-0 bg-foreground/30" style={{ width: playhead }} />
                </div>

                {/* A1 — drawn, not analysed. Honest about being a picture of sound. */}
                <div className="relative h-9 overflow-hidden bg-foreground/[0.04]">
                  <div aria-hidden className="absolute inset-0 flex items-center gap-px px-px">
                    {Array.from({ length: WAVEFORM_BARS }, (_, index) => (
                      <span
                        key={index}
                        className="flex-1 bg-foreground/25"
                        style={{ height: `${barHeight(waveSeed, index)}%` }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-y-0 left-0 bg-foreground/10" style={{ width: playhead }} />
                </div>
              </div>

              {/* MK — the only row that navigates by name rather than by position. */}
              <div className="relative mt-1 h-10">
                {visible.map((marker, index) => {
                  const isActive = index === activeIndex
                  const left = duration > 0 ? `${clamp(marker.time / duration, 0, 1) * 100}%` : "0%"

                  return (
                    <button
                      key={`${marker.time}-${marker.label}`}
                      type="button"
                      onClick={() => onSeek(marker.time)}
                      aria-current={isActive || undefined}
                      style={{ left }}
                      className={cn(
                        "group absolute top-0 flex -translate-x-1/2 flex-col items-center gap-1.5 px-1",
                        "focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
                      )}>
                      <span
                        aria-hidden
                        className={cn(
                          "size-1.5 rotate-45 transition-colors duration-300",
                          isActive ? "bg-foreground" : "bg-foreground/30 group-hover:bg-foreground/70"
                        )}
                      />
                      <span
                        className={cn(
                          "label-s whitespace-nowrap transition-opacity duration-300",
                          isActive ? "text-foreground opacity-100" : "text-muted-foreground opacity-40 group-hover:opacity-90"
                        )}>
                        {marker.label}
                      </span>
                      <span className="sr-only"> — seek to {formatTimecode(marker.time)}</span>
                    </button>
                  )
                })}
              </div>

              {/* Playhead, crossing every row. No transition — it is driven frame by frame. */}
              <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute inset-y-0 w-px -translate-x-1/2 bg-foreground/70" style={{ left: playhead }}>
                  <span className="absolute -top-px left-1/2 size-1.5 -translate-x-1/2 bg-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
