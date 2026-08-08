import type { ProjectSpec } from "@/data/projects"
import { cn } from "@/lib/utils"
import { LABEL } from "./shared"

/**
 * A technical sheet, so: two columns, no rules, no boxes. The field names sit
 * back in small mono caps and the values line up against them — the page a
 * delivery spec is written on, not a table on a website.
 */
export function ProjectTechnical({ specs }: { specs: ProjectSpec[] }) {
  return (
    <dl className="max-w-3xl">
      {specs.map((spec) => (
        <div key={spec.label} className="grid grid-cols-[minmax(0,8rem)_1fr] gap-4 py-2.5 sm:grid-cols-[14rem_1fr] sm:gap-6">
          <dt className={cn(LABEL, "pt-px")}>{spec.label}</dt>
          <dd className="label-m text-foreground/90">{spec.value}</dd>
        </div>
      ))}
    </dl>
  )
}
