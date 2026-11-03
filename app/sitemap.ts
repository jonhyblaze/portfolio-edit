import type { MetadataRoute } from "next"
import profile from "@/data/profile"
import { projects } from "@/data/projects"
import { routes } from "@/data/routes"

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [routes.homepage, routes.projects, routes.about, routes.contact]

  return [...pages, ...projects.map((project) => routes.project(project.slug))].map((path) => ({
    url: new URL(path, profile.url).toString()
  }))
}
