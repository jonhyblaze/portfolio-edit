"use client"

import { useRef, useState } from "react"
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react"
import { WIDESCREEN, type ProjectGrade } from "@/data/projects"
import { formatTimecode } from "@/lib/timecode"
import { cn } from "@/lib/utils"
import { LABEL } from "./shared"

/**
 * The stand-in for an ungraded plate, until real ones exist. One class, one
 * place: when the plates arrive, drop `simulated` from the shot in the data and
 * nothing here needs touching.
 */
const UNGRADED_STAND_IN = "saturate-50"

/** Where the wipe sits when the panel opens — dead centre, both states readable. */
const INITIAL_POSITION = 50

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

/**
 * Colour, shown the only way colour can be argued about: the same frame twice,
 * with a wipe between them.
 *
 * One shot at full size rather than a grid of six — a grade cannot be judged in
 * a thumbnail. The six live in the strip underneath, and the wipe holds its
 * position as you move between them, so the comparison stays like for like.
 *
 * The frame itself is the slider: drag it, or tab to it and use the arrows.
 */
export function ProjectGrades({
  grades,
  aspect = WIDESCREEN,
  onSeek
}: {
  grades: ProjectGrade[]
  aspect?: string
  onSeek: (time: number) => void
}) {
  const [index, setIndex] = useState(0)
  const [position, setPosition] = useState(INITIAL_POSITION)
  const frameRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const shot = grades[index]
  const standingIn = grades.some((grade) => grade.simulated)

  const positionAt = (clientX: number) => {
    const frame = frameRef.current
    if (!frame) return position
    const rect = frame.getBoundingClientRect()
    return clamp(((clientX - rect.left) / rect.width) * 100, 0, 100)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = event.key === "PageUp" || event.key === "PageDown" ? 10 : 2
    let next: number | null = null

    if (event.key === "ArrowLeft" || event.key === "ArrowDown" || event.key === "PageDown") next = position - step
    if (event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "PageUp") next = position + step
    if (event.key === "Home") next = 0
    if (event.key === "End") next = 100

    if (next === null) return
    event.preventDefault()
    setPosition(clamp(next, 0, 100))
  }

  return (

    <div className="max-w-5xl">

      <div className="mb-2 flex items-baseline justify-between gap-4">
        <span className={cn(LABEL)}>Ungraded</span>
        <span className={cn(LABEL)}>Graded</span>
      </div>

      <div
        ref={frameRef}
        role="slider"
        tabIndex={0}
        aria-label={`Wipe between the ungraded and graded frame for ${shot.shot}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}% ungraded`}
        onKeyDown={onKeyDown}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          dragging.current = true
          setPosition(positionAt(event.clientX))
        }}
        onPointerMove={(event) => {
          if (dragging.current) setPosition(positionAt(event.clientX))
        }}
        onPointerUp={(event) => {
          dragging.current = false
          event.currentTarget.releasePointerCapture(event.pointerId)
        }}
        onPointerCancel={() => {
          dragging.current = false
        }}
        // Both plates are absolute inside this box, so the film's ratio is set once
        // here and the wipe geometry follows it.
        style={{ aspectRatio: aspect }}
        className={cn(
          "relative w-full cursor-ew-resize touch-none select-none overflow-hidden bg-black",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40"
        )}>
        {/* Graded — the whole frame, underneath. */}
        <img
          key={`${shot.shot}-after`}
          src={shot.after}
          alt={shot.alt}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Ungraded — the same frame, clipped to the left of the wipe. Clipping the
            wrapper rather than sizing it keeps both images on identical geometry,
            so nothing shifts as the wipe travels. */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <img
            key={`${shot.shot}-before`}
            src={shot.before}
            alt=""
            draggable={false}
            className={cn("absolute inset-0 h-full w-full object-cover", shot.simulated && UNGRADED_STAND_IN)}
          />
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-white/50" style={{ left: `${position}%` }}>
          <span className="absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/50 bg-black/30 text-white">
            <RiArrowLeftSLine className="size-5" />
            <RiArrowRightSLine className="-ml-0.5 size-5" />
          </span>
        </div>
      </div>

      {shot.note && <p className="body-m mt-4 max-w-prose text-muted-foreground">{shot.note}</p>}

      {/* The other shots. Thumbnails show the graded state — the wipe is where the
          comparison happens, not here. */}
      <ul className="mt-8 flex gap-px overflow-x-auto overscroll-x-contain">
        {grades.map((grade, shotIndex) => {
          const isActive = shotIndex === index

          // basis is off a whole number on small screens on purpose — a cut-off
          // thumbnail is what says the strip carries on past the edge.
          return (
            <li key={grade.shot} className="min-w-0 shrink-0 basis-[38%] bg-background sm:basis-1/4 lg:basis-1/6">
              <button
                type="button"
                onClick={() => setIndex(shotIndex)}
                aria-pressed={isActive}
                aria-label={`Show ${grade.shot}`}
                className={cn(
                  "group block w-full text-left",
                  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground/40"
                )}>
                <img
                  src={grade.after}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  style={{ aspectRatio: aspect }}
                  className={cn(
                    "w-full object-cover transition duration-500 ease-out motion-reduce:transition-none",
                    isActive ? "brightness-100" : "brightness-40 group-hover:brightness-75"
                  )}
                />
                <span
                  className={cn(
                    "label-s block px-1 pb-3 pt-2 transition-colors duration-300 motion-reduce:transition-none",
                    isActive ? "text-muted-foreground" : "text-muted-foreground/40"
                  )}>
                  0{shotIndex + 1}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
