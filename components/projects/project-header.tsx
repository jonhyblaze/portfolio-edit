import Link from "next/link"
import type { Project } from "@/data/projects"
import { cn } from "@/lib/utils"
import { GUTTER } from "./shared"
import { RiArrowLeftLongFill } from "@remixicon/react"

/**
 * The slate at the top of the record: where you came from, which reel this is,
 * and the four facts that identify a film. Deliberately small — the film below
 * it is the thing worth looking at, and a title set at hero scale would say
 * otherwise.
 */
export function ProjectHeader({ project, position, total }: { project: Project; position: number; total: number }) {
  const { title, year, type, runtime, director } = project

  return (
    <header className={cn("pb-4 pt-10 md:pb-5", GUTTER)}>
      <div className="flex items-baseline justify-between gap-6">
        <Link
          href="/projects"
          className={cn(
            "inline-flex items-center gap-2 label-m uppercase tracking-widest text-muted-foreground/80 transition-colors duration-200 cursor-pointer",
            "hover:text-foreground focus-visible:text-foreground",
            "focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground/30"
          )}>
          <RiArrowLeftLongFill size={20} />
          Projects
        </Link>
        <span className={cn("label-m tracking-wider uppercase text-muted-foreground/80 tabular-nums")}>
          Reel {String(position).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-10">
        <h1 className="h3 font-black tracking-wide">{title}</h1>
        <p className="label-m text-muted-foreground">
          Dir. {director} · {year} · {type} · {runtime}
        </p>
      </div>
    </header>
  )
}
