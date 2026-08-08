import Link from "next/link"
import type { Project } from "@/data/projects"
import { cn } from "@/lib/utils"
import { GUTTER, LABEL } from "./shared"

/**
 * The slate at the top of the record: where you came from, which reel this is,
 * and the four facts that identify a film. Deliberately small — the film below
 * it is the thing worth looking at, and a title set at hero scale would say
 * otherwise.
 */
export function ProjectHeader({ project, position, total }: { project: Project; position: number; total: number }) {
  const { title, year, type, runtime, director } = project

  return (
    <header className={cn("shrink-0 pb-4 pt-6 md:pb-5 md:pt-8", GUTTER)}>
      <div className="flex items-baseline justify-between gap-6">
        <Link
          href="/projects"
          className={cn(
            "label-s uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors duration-200",
            "hover:text-foreground focus-visible:text-foreground",
            "focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground/30"
          )}>
          ← Projects
        </Link>
        <span className={cn(LABEL, "tabular-nums")}>
          Reel {String(position).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-10">
        <h1 className="h4 font-black tracking-wide">{title}</h1>
        <p className="label-m text-muted-foreground">
          Dir. {director} · {year} · {type} · {runtime}
        </p>
      </div>
    </header>
  )
}
