"use client"

import { WIDESCREEN, type ProjectStill } from "@/data/projects"
import { formatTimecode } from "@/lib/timecode"
import { cn } from "@/lib/utils"

/**
 * A contact sheet. The frames sit on a hairline grid with nothing between them
 * but the rule, and each one carries the number it has in the cut.
 *
 * Where a still knows the timecode it was pulled from it becomes a way back into
 * the film: clicking it moves the playhead there. Stills without one are just
 * pictures, and are not made to look clickable.
 *
 * Every cell carries the film's ratio, `aspect`, rather than a fixed widescreen —
 * a contact sheet that crops the frames is not a record of them.
 */
/** How many blank cells it takes to finish the last row at a given column count. */
const trailingBlanks = (count: number, columns: number) => (columns - (count % columns)) % columns

export function ProjectStills({
  stills,
  aspect = WIDESCREEN,
  onSeek
}: {
  stills: ProjectStill[]
  aspect?: string
  onSeek: (time: number) => void
}) {
  // A narrower frame takes less width, so one more fits across a large screen
  // before the sheet stops reading as a sheet.
  const columns = { base: 2, sm: 3, lg: aspect === WIDESCREEN ? 4 : 5 }
  const blanks = {
    base: trailingBlanks(stills.length, columns.base),
    sm: trailingBlanks(stills.length, columns.sm),
    lg: trailingBlanks(stills.length, columns.lg)
  }

  return (
    // Exclusive column classes rather than layered: two grid-cols utilities on one
    // element leave the winner up to stylesheet order, which is not a thing to
    // depend on.
    <ul
      className={cn(
        "grid grid-cols-2 gap-px bg-border sm:grid-cols-3",
        aspect === WIDESCREEN ? "lg:grid-cols-4" : "lg:grid-cols-5"
      )}>
      {stills.map((still, index) => {
        const number = String(index + 1).padStart(2, "0")

        return (
          <li key={still.src} className="bg-background">
            <figure className="group">
              {still.time === undefined ? (
                <img
                  src={still.src}
                  alt={still.alt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  style={{ aspectRatio: aspect }}
                  className="w-full object-cover brightness-[0.85]"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => onSeek(still.time as number)}
                  aria-label={`${still.alt} — play from ${formatTimecode(still.time)}`}
                  className={cn(
                    "block w-full",
                    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground/40"
                  )}>
                  <img
                    src={still.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    style={{ aspectRatio: aspect }}
                    className={cn(
                      "w-full object-cover brightness-[0.85]",
                      "transition duration-500 ease-out group-hover:brightness-100 motion-reduce:transition-none"
                    )}
                  />
                </button>
              )}

              {/* Both marks stay left: pushed to opposite edges, a frame's timecode
                  ends up sitting against the next frame's number across the rule. */}
              <figcaption className="flex items-baseline gap-3 px-1 pb-3 pt-2">
                <span className="label-s tabular-nums text-muted-foreground/40">{number}</span>
                {still.time !== undefined && (
                  <span
                    className={cn(
                      "label-s tabular-nums text-muted-foreground/40",
                      "transition-colors duration-500 group-hover:text-foreground motion-reduce:transition-none"
                    )}>
                    {formatTimecode(still.time)}
                  </span>
                )}
              </figcaption>
            </figure>
          </li>
        )
      })}

      {/* The hairline field is the list's own background showing through the gaps, so
          a half-filled last row would leave it exposed as a slab. Blank cells finish
          the row instead, the way a contact sheet runs out with empty slots. How many
          are wanted depends on the column count, so each one is told per breakpoint. */}
      {Array.from({ length: Math.max(blanks.base, blanks.sm, blanks.lg) }, (_, index) => (
        <li
          key={`blank-${index}`}
          aria-hidden
          className={cn(
            "bg-background",
            index < blanks.base ? "block" : "hidden",
            index < blanks.sm ? "sm:block" : "sm:hidden",
            index < blanks.lg ? "lg:block" : "lg:hidden"
          )}
        />
      ))}
    </ul>
  )
}
