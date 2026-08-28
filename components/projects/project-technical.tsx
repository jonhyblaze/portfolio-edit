import type { ProjectSpec } from "@/data/projects"
import { cn } from "@/lib/utils"
import { LABEL } from "./shared"


export function ProjectTechnical({ specs }: { specs: ProjectSpec[] }) {
  return (
    <dl className="max-w-3xl">
      {specs.map((spec) => (
        <div key={spec.label} className="grid grid-cols-[minmax(0,8rem)_1fr] gap-8 py-2.5 sm:grid-cols-[14rem_1fr] sm:gap-6">
          <dt className={cn(LABEL, "pt-px")}>{spec.label}</dt>
          <dd className="body-m text-foreground/95">{spec.value}</dd>
        </div>
      ))}
    </dl>
  )
}
