import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjectArchive } from "@/components/projects/project-archive"
import { projects } from "@/data/projects"
import { pageMetadata, toTitleCase } from "@/lib/metadata"

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

  const credit = `${project.type}, ${project.year}. Directed by ${project.director}.`

  return pageMetadata({
    title: toTitleCase(project.title),
    description: project.logline ? `${project.logline} ${credit}` : credit,
    path: `/projects/${project.slug}`,
    image: { url: `/projects/${project.slug}/opengraph-image`, alt: `A frame from ${toTitleCase(project.title)}` }
  })
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
