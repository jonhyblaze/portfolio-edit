"use client"

import type { ProjectNote } from "@/data/projects"
import { formatTimecode } from "@/lib/timecode"
import { cn } from "@/lib/utils"

/**
 * The edit log. Notes carrying a timecode double as cues — the note and the
 * moment it is about are one click apart. Notes without one are about the whole
 * film, and keep an empty gutter so the column of type stays straight.
 */
export function ProjectNotes({ notes, onSeek }: { notes: ProjectNote[]; onSeek: (time: number) => void }) {
  return (
    <ul className="max-w-3xl space-y-6">
      {notes.map((note, index) => (
        <li key={index} className={cn("grid grid-cols-[3.5rem_1fr] gap-4 border-t border-border sm:grid-cols-[5rem_1fr]", index === 0 && "border-0")}>
          {note.time === undefined ? (
            <span aria-hidden className="label-m text-muted-foreground/60">
              ——
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onSeek(note.time as number)}
              aria-label={`Play from ${formatTimecode(note.time)}`}
              className={cn(
                "label-m justify-self-start tabular-nums text-muted-foreground/60 transition-colors duration-200 hover:text-foreground",
                "focus-visible:text-foreground focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
              )}>
              {formatTimecode(note.time)}
            </button>
          )}
          <p className="body-m text-muted-foreground">{note.text}</p>
        </li>
      ))}
    </ul>
  )
}
