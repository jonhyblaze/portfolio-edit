/**
 * Projects shown on /projects as strips of four stills.
 *
 * The shape is deliberately flat — a CMS will fill these fields verbatim later,
 * including `frames`, where each entry carries its own `src` and `alt`.
 *
 * Everything here is placeholder. The stills in /public/projects/stills were cut
 * from the showcase loops (letterboxing removed, 720x405) purely so the strips
 * have real frames to hold; the titles and credits are invented. The alt text
 * says which frame it is rather than describing a picture that doesn't belong to
 * the project yet — real copy comes with the real stills.
 */

export type ProjectFrame = {
  src: string
  alt: string
}

export type Project = {
  slug: string
  title: string
  year: number
  /** Short form, e.g. "Short Film", "Feature Documentary". */
  type: string
  /** Pre-formatted, e.g. "18 min" — runtimes are written, not computed. */
  runtime: string
  director: string
  /** Exactly four landscape stills, in cut order. */
  frames: ProjectFrame[]
}

const FRAMES_PER_STRIP = 4

/** /public/projects/stills/<slug>-1.jpg … -4.jpg */
const frames = (slug: string, title: string): ProjectFrame[] =>
  Array.from({ length: FRAMES_PER_STRIP }, (_, index) => ({
    src: `/projects/stills/${slug}-${index + 1}.jpg`,
    alt: `${title} — frame ${index + 1} of ${FRAMES_PER_STRIP}`
  }))

export const projects: Project[] = [
  {
    slug: "hum",
    title: "HUM ",
    year: 2021,
    type: "Short Music Film",
    runtime: "4 min",
    director: "Oleksandr Korotun",
    frames: frames("a-quiet-morning", "A Quiet Morning")
  },
  {
    slug: "blind-as-a-bat",
    title: "BLIND AS A BAT",
    year: 2018,
    type: "Music Video",
    runtime: "5 min",
    director: "Oleksandr Korotun",
    frames: frames("northern-interior", "Northern Interior")
  },
  {
    slug: "icehole",
    title: "ICEHOLE",
    year: 2025,
    type: "Short Film",
    runtime: "14 min",
    director: "Anastasia Grüba",
    frames: frames("salt-line", "Salt Line")
  },
  {
    slug: "leopolis-night",
    title: "LEOPOLIS NIGHT",
    year: 2021,
    type: "Short Film",
    runtime: "20 min",
    director: "Nikon Rōmanchenko",
    frames: frames("the-long-field", "The Long Field")
  },
  {
    slug: "papr",
    title: "PAPERUSHKA",
    year: 2020,
    type: "Short Film",
    runtime: "21 min",
    director: "Lilia Ostapovyčh",
    frames: frames("rooms-facing-north", "Rooms Facing North")
  }
]
