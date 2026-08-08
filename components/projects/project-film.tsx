import type { Project } from "@/data/projects"
import { cn } from "@/lib/utils"
import { LABEL } from "./shared"

/**
 * The bin the film itself lives in: what it is, and what the cut was trying to
 * do. Everything here is optional — a project with nothing written about it
 * falls back to the record, which every project has.
 */
export function ProjectFilm({ project }: { project: Project }) {
  const record = [
    { label: "Director", value: project.director },
    { label: "Year", value: String(project.year) },
    { label: "Format", value: project.type },
    { label: "Runtime", value: project.runtime }
  ]

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
      <div className="max-w-prose">
        {project.logline && <p className="body-l text-balance text-foreground">{project.logline}</p>}
        {project.synopsis && <p className="body-m mt-6 text-muted-foreground">{project.synopsis}</p>}
      </div>

      <div className="space-y-10">
        <dl>
          {record.map((row) => (
            <div key={row.label} className="grid grid-cols-2 gap-4 py-2 lg:grid-cols-[7rem_1fr]">
              <dt className={cn(LABEL, "pt-px")}>{row.label}</dt>
              <dd className="label-m text-foreground/90">{row.value}</dd>
            </div>
          ))}
        </dl>

        {project.festivals && project.festivals.length > 0 && (
          <section>
            <h3 className={cn(LABEL, "mb-4 block border-b border-border pb-3")}>Selected</h3>
            <ul className="space-y-2">
              {project.festivals.map((festival) => (
                <li key={festival} className="body-s text-muted-foreground">
                  {festival}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
