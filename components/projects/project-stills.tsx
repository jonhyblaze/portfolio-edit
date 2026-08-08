"use client"

import type { ProjectStill } from "@/data/projects"
import { formatTimecode } from "@/lib/timecode"
import { cn } from "@/lib/utils"

/**
 * A contact sheet. The frames sit on a hairline grid with nothing between them
 * but the rule, and each one carries the number it has in the cut.
 *
 * Where a still knows the timecode it was pulled from it becomes a way back into
 * the film: clicking it moves the playhead there. Stills without one are just
 * pictures, and are not made to look clickable.
 */
export function ProjectStills({ stills, onSeek }: { stills: ProjectStill[]; onSeek: (time: number) => void }) {
  return (
    <ul className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-4">
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
                  className="aspect-video w-full object-cover brightness-[0.85]"
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
                    className={cn(
                      "aspect-video w-full object-cover brightness-[0.85]",
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
    </ul>
  )
}
