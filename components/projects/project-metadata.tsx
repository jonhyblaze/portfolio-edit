import type { Project } from "@/data/projects"
import { cn } from "@/lib/utils"

/**
 * The caption under a strip — a museum label, not a card header. The hairline runs
 * the full bleed, carrying on the bottom edge of the frames; the type sits back on
 * the site's gutter. Title left, credits right, and the rule firms up when the
 * strip is active.
 */
export function ProjectMetadata({ project }: { project: Project; isActive?: boolean }) {
  const { title, year, type, runtime, director } = project

  return (
    <header
      className={cn(
        "relative mb-3 border-b pb-3 transition duration-700 ease-out motion-reduce:transition-none sm:mb-4",
        "group-hover:opacity-100"
      )}>
      <div
        className={cn(
          "mx-auto flex flex-col gap-1 px-5 laptop:px-10",
          "sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
        )}>
        <h2 className="h3 tracking-wide font-black">{title}</h2>

        <div className="flex gap-1 text-muted-foreground sm:items-end sm:text-right">
          <p className="label-m">Dir. {director} ·</p>
          <p className="label-m">
            {year} · {type} · {runtime}
          </p>
        </div>
      </div>
    </header>
  )
}
