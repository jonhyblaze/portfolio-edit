import type { ShowcaseSlide } from "@/components/showcase/video-showcase"

/**
 * Video files live on Cloudflare R2 (see scripts/README.md); only the small
 * poster JPGs stay in git under /public/showcase.
 *
 * Set NEXT_PUBLIC_MEDIA_BASE to the bucket's public origin
 * (e.g. https://videos.yourdomain.com) in .env.local and in the host's env.
 * When unset it falls back to a local /showcase path, so `next dev` still
 * plays the on-disk copies during migration.
 */
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE ?? ""

/** Build a video URL: R2 origin + key, or a local /path when base is unset. */
const video = (key: string) => `${MEDIA_BASE}/${key}`

/**
 * The showcase reads as a cut sequence, not a grid. Reels are interrupted by
 * anomalies — a held beat of black, a small caption, a full-screen title card —
 * so the rhythm breathes the way an edit does. Each slide takes one screen of
 * scroll, and each cut fires its own transition sound.
 *
 * Video slides (the default `kind`) tune their frame per entry:
 *   radius → rounded corners (default 0, sharp)
 *   width  → pillarbox (black bars left/right) when below 100
 *   height → letterbox (black bars top/bottom) when below 100
 *
 *   height: 62, // 2.39:1 letterbox — bars top & bottom
 *
 * Anomaly slides:
 *   { kind: "pause" }                        → black, grain, a cue mark
 *   { kind: "caption", text, sub? }          → one small line, screenplay-slug style
 *   { kind: "quote", text, attribution? }    → a title card, word by word
 *
 * Poster JPGs live in /public/showcase; videos are served from R2 (see above).
 */
export const showcaseSlides: ShowcaseSlide[] = [
  {
    id: "hum",
    src: video("loops/hum.mp4"),
    poster: "/showcase/hum-cover.jpg",
    label: "HUM",
    meta: "dir/dop. Oleksandr Korotun | Video Poetry",
    radius: 0 // gently rounded, cinematic
  },
  {
    id: "pause-01",
    kind: "pause"
  },
  {
    id: "212-CH",
    src: video("loops/212.mp4"),
    poster: "/showcase/212-cover.jpg",
    label: "212 Heroes | Carolina Herrera",
    meta: "dir/dop. Oleksandr Korotun | Commercial",
    radius: 0 // gently rounded, cinematic
  },
  {
    id: "caption-01",
    kind: "caption",
    text: "Int. Edit Suite — 04:12",
    sub: "the cut is still wrong"
  },
  {
    id: "icohole",
    src: video("loops/icehole.mp4"),
    poster: "/showcase/icehole-cover.jpg",
    label: "Icehole",
    meta: "dir. Anastasia Gruba, dop. Oleksandr Korotun | Short Film"
  },
  {
    id: "quote-01",
    kind: "quote",
    text: "A cut is a decision about what you are allowed to feel next.",
    attribution: "Oleksandr Korotun"
  },
  {
    id: "pavo-indus",
    src: video("loops/pavo-indus.mp4"),
    poster: "/showcase/pavo-indus-cover.jpg",
    label: "Pavo Indus",
    meta: "dir. Max Prodaniuk, dop. Oleksandr Korotun | Music Video",
    height: 62
  },
  {
    id: "blb",
    src: video("loops/blb.mp4"),
    poster: "/showcase/blb-cover.jpg",
    label: "Blind As A Bat",
    meta: "dir/dop. Oleksandr Korotun | Music Video",
    height: 74
  },
  {
    id: "caption-02",
    kind: "caption",
    text: "Match Cut —",
    sub: "on movement, on shape, on breath"
  },
  {
    id: "papr",
    src: video("loops/papr.mp4"),
    poster: "/showcase/papr-cover.jpg",
    label: "Paperushka",
    meta: "dir. Lilia Ostapovych, dop. Oleksandr Korotun | Short Film",
    height: 74
  },
  {
    id: "pause-02",
    kind: "pause"
  },
  {
    id: "leopolis",
    src: video("loops/leopolis.mp4"),
    poster: "/showcase/leopolis-cover.jpg",
    label: "Leopolis Night",
    meta: "dir. Nikon Romanchenko, dop. Oleksandr Korotun | Short Film",
    radius: 0,
    width: 88
  },
  {
    id: "vertical",
    src: video("loops/pushing.mp4"),
    poster: "/showcase/vertical.jpg",
    label: "Pushing Saves",
    meta: "Commercials & Social Media | Vertical Cut",
    width: 34 // pillarbox — bars left & right
  }
]
