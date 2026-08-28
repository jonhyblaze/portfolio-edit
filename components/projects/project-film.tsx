import type { Project, ProjectFestival } from "@/data/projects"
import { cn } from "@/lib/utils"

/**
 * The bin that film itself lives in: what it is, and what the cut was trying to
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

  // A win is a selection too, so the same entry never appears in both bins: it is
  // filed under what it won, and the selections are what's left.
  const festivals = project.festivals ?? []
  const awards = festivals.filter((festival) => festival.award)
  const selections = festivals.filter((festival) => !festival.award)

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">
      <div className="max-w-prose">
        {project.logline && <h5 className="h4 text-pretty text-foreground">{project.logline}</h5>}
        {project.synopsis && <p className="body-l mt-6 text-muted-foreground">{project.synopsis}</p>}
      </div>

      <div className="space-y-10">
        <dl>
          {record.map((row) => (
            <div key={row.label} className="grid grid-cols-2 gap-4 py-2 lg:grid-cols-[7rem_1fr]">
              <dt className={cn("label-m uppercase tracking-wider text-muted-foreground", "pt-px")}>{row.label}</dt>
              <dd className="body-m text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>

        {awards.length > 0 && <FestivalList heading="Awards" festivals={awards} />}
        {selections.length > 0 && <FestivalList heading="Selected" festivals={selections} />}
      </div>
    </div>
  )
}

/**
 * One bin of the festival record. Awards and selections are the same list read
 * two ways — a win leads with what it won, a selection with the festival — so
 * the two sections share a component and differ only in which line comes first.
 */
function FestivalList({ heading, festivals }: { heading: string; festivals: ProjectFestival[] }) {
  return (
    <section>
      <h3 className={cn("label-m uppercase text-muted-foreground tracking-wider", "mb-4 block border-b border-border pb-3")}>{heading}</h3>
      <ul className="space-y-3 lg:max-w-sm">
        {festivals.map((festival) => {
          const second = secondLine(festival)

          return (
            <li key={`${festival.name} ${festival.year ?? ""}`}>
              <p className="body-m text-foreground">{festival.award ?? festival.name}</p>
              {second && <p className="body-s text-muted-foreground">{second}</p>}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/**
 * What's left once the first line has taken the award (a win) or the name (a
 * selection). Everything but the name is optional, so a bare selection with no
 * year and no section comes back empty and reads as a single line.
 */
function secondLine({ name, year, award, note }: ProjectFestival) {
  return [award ? name : undefined, note, year].filter(Boolean).join(", ")
}
