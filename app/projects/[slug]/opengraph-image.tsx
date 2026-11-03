import { notFound } from "next/navigation"
import profile from "@/data/profile"
import { projects } from "@/data/projects"
import { toTitleCase } from "@/lib/metadata"
import { OG_SIZE, renderOgImage } from "@/lib/og"

export const alt = "A frame from the film"
export const size = OG_SIZE
export const contentType = "image/png"

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

/** The project's own poster under its title — the one place a preview names the film. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projects.find((candidate) => candidate.slug === slug)

  if (!project) notFound()

  return renderOgImage({
    poster: project.preview ?? project.video?.poster ?? "/showcase/hum-cover.jpg",
    eyebrow: `${profile.name} · ${profile.role}`,
    title: toTitleCase(project.title),
    subtitle: `${project.type} · ${project.year} · Dir. ${project.director}`
  })
}
