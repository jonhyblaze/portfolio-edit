"use client"

import type { ProjectBoard } from "@/data/projects"
import { formatTimecode } from "@/lib/timecode"
import { cn } from "@/lib/utils"
import { LABEL } from "./shared"

/**
 * Board on the left, the frame it became on the right. The pair is the point —
 * the distance between the two is most of what an edit decides.
 *
 * The drawn panel is set apart rather than styled up: a dashed edge, no colour,
 * held back. Where a project has no digitised boards the final frame stands in
 * for its own board under that treatment, and the panel says so out loud rather
 * than passing a frame off as a drawing.
 */
export function ProjectStoryboard({ boards, onSeek }: { boards: ProjectBoard[]; onSeek: (time: number) => void }) {
  const drawn = boards.some((board) => board.sketch)

  return (
    <div>
      {!drawn && (
        <p className="label-s mb-8 max-w-prose text-muted-foreground/50">
          Boards not yet digitised. The panels on the left are stand-ins, derived from the delivered frames.
        </p>
      )}

      <ul className="space-y-10">
        {boards.map((board) => (
          <li key={board.shot} className="border-t border-border pt-5">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <span className="label-m text-foreground">{board.shot}</span>
              {board.time !== undefined && (
                <button
                  type="button"
                  onClick={() => onSeek(board.time as number)}
                  className={cn(
                    "label-s tabular-nums text-muted-foreground/60 transition-colors duration-200 hover:text-foreground",
                    "focus-visible:text-foreground focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
                  )}>
                  {formatTimecode(board.time)} ↗
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-6">
              <figure>
                <figcaption className={cn(LABEL, "mb-2 block")}>Storyboard</figcaption>
                <div className="border border-dashed border-border p-2">
                  <img
                    src={board.sketch ?? board.final}
                    alt={board.sketch ? `${board.alt} — storyboard panel` : ""}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="aspect-video w-full object-cover opacity-45 grayscale contrast-150 brightness-110"
                  />
                </div>
              </figure>

              <span aria-hidden className="label-m hidden text-muted-foreground/30 sm:block">
                →
              </span>

              <figure>
                <figcaption className={cn(LABEL, "mb-2 block")}>Final frame</figcaption>
                <div className="border border-transparent p-2">
                  <img
                    src={board.final}
                    alt={board.alt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="aspect-video w-full object-cover"
                  />
                </div>
              </figure>
            </div>

            {board.note && <p className="body-s mt-4 max-w-prose text-muted-foreground">{board.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}
