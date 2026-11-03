import type { Metadata } from "next"
import profile from "@/data/profile"
import { OG_SIZE } from "@/lib/og-size"

export const SITE_TITLE = `${profile.name} — ${profile.role}`

export const SITE_DESCRIPTION =
  "Film and video editor with a cinematographer’s eye and an engineer’s precision. Short films, music videos and commercials, cut in Kyiv."

/**
 * A page's own description, canonical and link-preview text.
 *
 * Next merges metadata shallowly, so a page that sets `title` but not
 * `openGraph` would still go out with the home page's og:title. Every page
 * goes through here to keep the three in step.
 *
 * Declaring `openGraph` also cuts the page off from the image it would have
 * inherited, and overrides a segment's own opengraph-image file besides, so
 * the image is always named here: the site's by default, or `image` for a
 * page that renders its own (the projects).
 */
export function pageMetadata({
  title,
  description,
  path,
  image = { url: "/opengraph-image", alt: SITE_TITLE }
}: {
  title?: string
  description: string
  path: string
  image?: { url: string; alt: string }
}): Metadata {
  const fullTitle = title ? `${title} — ${profile.name}` : SITE_TITLE
  const images = [{ ...image, width: OG_SIZE.width, height: OG_SIZE.height }]

  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: profile.name,
      locale: "en_US",
      url: path,
      title: fullTitle,
      description,
      images
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images
    }
  }
}

/** "BLIND AS A BAT" → "Blind As A Bat". Project titles are set in caps for the page, not for a link preview. */
export const toTitleCase = (title: string) =>
  title
    .trim()
    .toLowerCase()
    .replace(/(^|\s)(\p{L})/gu, (_, space: string, letter: string) => space + letter.toUpperCase())
