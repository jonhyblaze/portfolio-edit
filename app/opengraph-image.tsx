import profile from "@/data/profile"
import { OG_SIZE, renderOgImage } from "@/lib/og"

export const alt = `${profile.name} — ${profile.role}`
export const size = OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return renderOgImage({
    poster: "/showcase/hum-cover.jpg",
    eyebrow: `${profile.role} · Kyiv`,
    title: profile.name,
    subtitle: "Short films, music videos and commercials"
  })
}
