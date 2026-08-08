"use client"

import type { ProjectVersion } from "@/data/projects"
import { formatTimecode } from "@/lib/timecode"
import { cn } from "@/lib/utils"

/**
 * The cuts that exist, as a list of sequences rather than a set of buttons.
 * Choosing one swaps what the viewer is playing and keeps the playhead where it
 * was, so moving between a cut and its grade is a comparison and not a restart.
 *
 * The active row is marked twice — a filled cue on the left and full-strength
 * type — because "which one am I watching" is the only question this panel has
 * to answer at a glance.
 */
export function ProjectVersions({
  versions,
  activeId,
  onSelect
}: {
  versions: ProjectVersion[]
  activeId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <ul className="max-w-3xl border-t border-border">
      {versions.map((version) => {
        const isActive = version.id === activeId

        return (
          <li key={version.id} className="border-b border-border">
            <button
              type="button"
              onClick={() => onSelect(version.id)}
              aria-pressed={isActive}
              className={cn(
                "group flex w-full items-baseline gap-4 py-5 text-left",
                "focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-foreground/30"
              )}>
              <span
                aria-hidden
                className={cn(
                  "mt-1 size-1.5 shrink-0 rotate-45 transition-colors duration-300",
                  isActive ? "bg-foreground" : "bg-foreground/20 group-hover:bg-foreground/50"
                )}
              />

              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "body-m block transition-colors duration-300",
                    isActive ? "text-foreground" : "text-muted-foreground/50 group-hover:text-foreground"
                  )}>
                  {version.name}
                </span>
                {version.note && <span className="label-s mt-1.5 block text-muted-foreground/50">{version.note}</span>}
              </span>

              {version.duration !== undefined && (
                <span className="label-s shrink-0 tabular-nums text-muted-foreground/40">{formatTimecode(version.duration)}</span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
