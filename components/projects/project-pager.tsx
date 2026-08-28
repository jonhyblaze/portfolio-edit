import Link from "next/link"
import type { Project } from "@/data/projects"
import { cn } from "@/lib/utils"
import { GUTTER } from "./shared"
import { RiArrowLeftLongFill } from "@remixicon/react"

export function ProjectPager({ previous, next }: { previous: Project; next: Project }) {
  return (
    <footer className={cn("border-t border-border py-10 md:py-14", GUTTER)}>
      <nav aria-label="Other projects" className="flex items-start justify-between gap-8">
        <PagerLink project={previous} direction="previous" />
        <PagerLink project={next} direction="next" />
      </nav>
    </footer>
  )
}

function PagerLink({ project, direction }: { project: Project; direction: "previous" | "next" }) {
  const isNext = direction === "next"

  const hoverStyles = "text-muted-foreground group-hover:text-foreground duration-300 transition-colors motion-reduce:transition-none"

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group flex max-w-[45%] flex-col gap-2",
        isNext && "items-end text-right",
        "focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground/30"
      )}>
      <span className={cn("inline-flex gap-1 items-center label-m uppercase tracking-widest", hoverStyles)}>
        {isNext ? `Next` : `Previous`} <RiArrowLeftLongFill className={isNext ? "rotate-180" : "order-first"} size={20}/>
      </span>
      <span className={cn("h4", hoverStyles)}>
        {project.title}
      </span>
    </Link>
  )
}
