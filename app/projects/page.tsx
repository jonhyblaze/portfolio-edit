import type { Metadata } from "next"
import { ProjectStrips } from "@/components/projects/project-strips"
import { projects } from "@/data/projects"

export const metadata: Metadata = {
  title: "Projects — Oleksandr Korotun",
  description: "Selected editing work: features, short films and documentary, shown as strips of stills."
}

export default function ProjectsPage() {
  return (
    <div className="relative w-full py-16 md:py-10">
      <ProjectStrips projects={projects} />
    </div>
  )
}
