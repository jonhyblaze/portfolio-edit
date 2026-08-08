"use client"

import { useRef, useState } from "react"
import type { Project } from "@/data/projects"
import { cn } from "@/lib/utils"
import { GUTTER, LABEL } from "./shared"
import { ProjectCredits } from "./project-credits"
import { ProjectFilm } from "./project-film"
import { ProjectGrades } from "./project-grades"
import { ProjectNotes } from "./project-notes"
import { ProjectStills } from "./project-stills"
import { ProjectStoryboard } from "./project-storyboard"
import { ProjectTechnical } from "./project-technical"
import { ProjectVersions } from "./project-versions"

type MaterialKey = "film" | "stills" | "storyboard" | "grade" | "versions" | "technical" | "credits" | "notes"

type Material = {
  key: MaterialKey
  label: string
  /** Shown beside the label the way a bin shows how much is in it. */
  count?: number
}

type ProjectMaterialsProps = {
  project: Project
  activeVersionId: string | null
  onSelectVersion: (id: string) => void
  onSeek: (time: number) => void
}

/**
 * The bins. Which ones exist is the project's business — the row is built from
 * what the record actually holds, so a film with no boards never advertises a
 * storyboard, and nothing here is hardcoded per project.
 *
 * Switching a bin changes only the panel: the film stays where it is, playing or
 * paused, because it is the thing all of this is about.
 */
export function ProjectMaterials({ project, activeVersionId, onSelectVersion, onSeek }: ProjectMaterialsProps) {
  const { stills, storyboard, grades, versions, notes } = project.materials ?? {}

  const available: (Material | null)[] = [
    { key: "film", label: "Film" },
    stills?.length ? { key: "stills", label: "Stills", count: stills.length } : null,
    storyboard?.length ? { key: "storyboard", label: "Storyboard", count: storyboard.length } : null,
    grades?.length ? { key: "grade", label: "Grade", count: grades.length } : null,
    versions?.length ? { key: "versions", label: "Versions", count: versions.length } : null,
    project.technical?.length ? { key: "technical", label: "Technical" } : null,
    project.credits ? { key: "credits", label: "Credits" } : null,
    notes?.length ? { key: "notes", label: "Notes", count: notes.length } : null
  ]

  const materials = available.filter((material): material is Material => material !== null)

  const [active, setActive] = useState<MaterialKey>("film")
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = materials.length - 1
    let next = -1

    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1
    if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1
    if (event.key === "Home") next = 0
    if (event.key === "End") next = last

    if (next < 0) return
    event.preventDefault()
    setActive(materials[next].key)
    tabRefs.current[next]?.focus()
  }

  return (
    <section aria-label="Project materials" className={cn("pb-16 pt-10 md:pb-24 md:pt-14", GUTTER)}>
      <h2 className={cn(LABEL, "mb-5 block")}>Project materials</h2>

      {/* The row scrolls sideways on small screens rather than wrapping — a bin list
          that has folded onto two lines stops reading as a list of bins. */}
      <div
        role="tablist"
        aria-label="Project materials"
        className={cn(
          "-mx-5 flex gap-7 overflow-x-auto overscroll-x-contain border-b border-border px-5 sm:mx-0 sm:gap-9 sm:px-0"
        )}>
        {materials.map((material, index) => {
          const isActive = material.key === active

          return (
            <button
              key={material.key}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              type="button"
              role="tab"
              id={`material-tab-${material.key}`}
              aria-selected={isActive}
              aria-controls={`material-panel-${material.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(material.key)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "label-s relative flex shrink-0 items-baseline gap-1.5 whitespace-nowrap pb-3 uppercase tracking-[0.2em]",
                "transition-colors duration-300 motion-reduce:transition-none",
                "focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground/30",
                isActive ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
              )}>
              {material.label}
              {material.count !== undefined && (
                <span aria-hidden className="text-[0.625rem] tabular-nums text-muted-foreground/30">
                  {String(material.count).padStart(2, "0")}
                </span>
              )}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 -bottom-px h-px bg-foreground transition-opacity duration-300 motion-reduce:transition-none",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />
            </button>
          )
        })}
      </div>

      {/* Keyed on the active bin so the panel fades in on every change rather than
          swapping its contents underneath itself. */}
      <div
        key={active}
        role="tabpanel"
        id={`material-panel-${active}`}
        aria-labelledby={`material-tab-${active}`}
        tabIndex={0}
        className="min-h-[20rem] pt-10 duration-500 animate-in fade-in-0 focus-visible:outline-none md:pt-12">
        {active === "film" && <ProjectFilm project={project} />}
        {active === "stills" && stills && <ProjectStills stills={stills} onSeek={onSeek} />}
        {active === "storyboard" && storyboard && <ProjectStoryboard boards={storyboard} onSeek={onSeek} />}
        {active === "grade" && grades && <ProjectGrades grades={grades} onSeek={onSeek} />}
        {active === "versions" && versions && (
          <ProjectVersions versions={versions} activeId={activeVersionId} onSelect={onSelectVersion} />
        )}
        {active === "technical" && project.technical && <ProjectTechnical specs={project.technical} />}
        {active === "credits" && project.credits && <ProjectCredits credits={project.credits} />}
        {active === "notes" && notes && <ProjectNotes notes={notes} onSeek={onSeek} />}
      </div>
    </section>
  )
}
