import { ProjectStrips } from "@/components/projects/project-strips"
import { projects } from "@/data/projects"
import { pageMetadata } from "@/lib/metadata"

export const metadata = pageMetadata({
  title: "Projects",
  description: "Selected work: short films, music videos and commercials, with stills, grades and notes from the edit.",
  path: "/projects"
})

export default function ProjectsPage() {
  return (
    <div className="relative w-full py-16 md:py-10">
      <ProjectStrips projects={projects} />
    </div>
  )
}
