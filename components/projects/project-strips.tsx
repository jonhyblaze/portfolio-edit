"use client"

import { useState } from "react"
import type { Project } from "@/data/projects"
import { ProjectStrip } from "./project-strip"

/**
 * Owns which strip is lit. It has to live above the strips rather than inside each
 * one, because pointing at a strip changes the *other* strips too.
 *
 * Nothing is lit until a strip is pointed at or tabbed to: every film sits at 80%.
 * From then on the one under the cursor goes to 100% and the rest drop to 50%.
 */
export function ProjectStrips({ projects }: { projects: Project[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  return (
    <ul className="mt-16 space-y-8 md:mt-10 md:space-y-16 lg:space-y-20">
      {projects.map((project) => (
        <ProjectStrip
          key={project.slug}
          project={project}
          isActive={activeSlug === project.slug}
          isDimmed={activeSlug !== null && activeSlug !== project.slug}
          onActivate={() => setActiveSlug(project.slug)}
          onDeactivate={() => setActiveSlug(null)}
        />
      ))}
    </ul>
  )
}
