import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjectArchive } from "@/components/projects/project-archive"
import { projects } from "@/data/projects"

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((candidate) => candidate.slug === slug)

  if (!project) return {}

  const title = project.title.trim()

  return {
    title: `${title} — Oleksandr Korotun`,
    description: project.logline ?? `${project.type}, ${project.year}. Directed by ${project.director}.`
  }
}

/**
 * One project, opened in the archive. The order of `projects` is the order of the
 * reels, so it also decides what "previous" and "next" mean — the list wraps
 * rather than dead-ending at either edge.
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const index = projects.findIndex((candidate) => candidate.slug === slug)

  if (index === -1) notFound()

  return (
    <div className="relative w-full">
      <ProjectArchive
        project={projects[index]}
        previous={projects[(index - 1 + projects.length) % projects.length]}
        next={projects[(index + 1) % projects.length]}
        position={index + 1}
        total={projects.length}
      />
    </div>
  )
}
