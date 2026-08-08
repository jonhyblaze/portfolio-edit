import Link from "next/link"
import type { Project } from "@/data/projects"
import { cn } from "@/lib/utils"
import { GUTTER, LABEL } from "./shared"

/**
 * The end of the record: the reels either side of this one, and the line that
 * says none of this is real yet. The disclaimer is set as quietly as everything
 * else — it is part of the document, not a banner over it.
 */
export function ProjectPager({ previous, next }: { previous: Project; next: Project }) {
  return (
    <footer className={cn("border-t border-border py-10 md:py-14", GUTTER)}>
      <nav aria-label="Other projects" className="flex items-start justify-between gap-8">
        <PagerLink project={previous} direction="previous" />
        <PagerLink project={next} direction="next" />
      </nav>

      <p className="label-s mt-12 max-w-prose text-muted-foreground/30">
        Placeholder record. Credits, technical specifications, notes and materials on this page are mock data, and the viewer plays a
        showcase loop in place of the film.
      </p>
    </footer>
  )
}

function PagerLink({ project, direction }: { project: Project; direction: "previous" | "next" }) {
  const isNext = direction === "next"

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group flex max-w-[45%] flex-col gap-2",
        isNext && "items-end text-right",
        "focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground/30"
      )}>
      <span className={LABEL}>{isNext ? "Next →" : "← Previous"}</span>
      <span className="body-m text-muted-foreground transition-colors duration-300 group-hover:text-foreground motion-reduce:transition-none">
        {project.title}
      </span>
    </Link>
  )
}
