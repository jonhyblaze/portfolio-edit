import Link from "next/link"
import type { Project } from "@/data/projects"
import { ProjectMetadata } from "./project-metadata"
import { cn } from "@/lib/utils"

type ProjectStripProps = {
  project: Project
  /** This strip is the one being pointed at. */
  isActive: boolean
  /** Another strip is being pointed at. */
  isDimmed: boolean
  onActivate: () => void
  onDeactivate: () => void
}

/**
 * One project as a strip of four frames. Which strip is lit is decided by
 * ProjectStrips — a strip cannot know that a sibling is being pointed at.
 *
 * Brightness is the only lever, so the three states read as the numbers they are:
 * 100% lit, 80% at rest, 50% stepped back.
 */
export function ProjectStrip({ project, isActive, isDimmed, onActivate, onDeactivate }: ProjectStripProps) {
  const { slug, title, year, type, runtime, director, frames } = project

  return (
    <li
      className="group"
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      // Focus mirrors hover so tabbing through the page lights strips the same way.
      onFocus={onActivate}
      onBlur={onDeactivate}>
      <Link
        href={`/projects/${slug}`}
        aria-label={`${title}, ${year}, ${type}, ${runtime}, directed by ${director}`}
        className={cn(
          "block",
          "focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-foreground/10"
        )}>
        <div className="relative">
          {/* The light under the table, switched on beneath the strip being pointed at. */}
          <div
            aria-hidden="true"
            className={cn(
              // Vertical bleed only — the strip already runs to both screen edges, and a
              // box wider than the viewport would put a scrollbar on the page.
              "pointer-events-none absolute inset-x-0 -inset-y-8 bg-foreground/5 blur-2xl",
              "transition-opacity duration-700 ease-out motion-reduce:transition-none",
              isActive ? "opacity-100" : "opacity-0"
            )}
          />

          <ProjectMetadata project={project} isActive={isActive} isDimmed={isDimmed} />

          {/* Small screens keep the strip and scroll it sideways rather than collapsing into
              cards — a frame and a bit stays in view, which is what says "there is more film
              here". From sm up it is a plain four-column grid. */}
          <div
            className={cn(
              "relative flex snap-x snap-mandatory gap-px overflow-x-auto overscroll-x-contain",
              "sm:grid sm:grid-cols-4 sm:overflow-visible"
            )}>
            {frames.map((frame, index) => (
              <img
                key={index}
                src={frame.src}
                alt={frame.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
                className={cn(
                  "aspect-video w-[72%] shrink-0 snap-start object-cover sm:w-full",
                  "transition duration-700 ease-out motion-reduce:transition-none",
                  isActive && "brightness-100",
                  isDimmed && "brightness-30",
                  !isActive && !isDimmed && "brightness-[0.8]"
                )}
              />
            ))}
          </div>
        </div>
      </Link>
    </li>
  )
}
