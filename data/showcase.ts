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
 *   { kind: "title", text, sub? }            → the opening card, grain under display type
 *   { kind: "pause" }                        → black, grain, a cue mark
 *   { kind: "flash" }                        → one camera flash, then its afterglow
 *   { kind: "caption", text, sub? }          → one small line, screenplay-slug style
 *   { kind: "quote", text, attribution? }    → a statement card, word by word
 *
 * Title and quote cards ripple: the headline arrives a word at a time, left to right,
 * and the small line beneath it follows the last word. Captions are smaller type and
 * arrive whole.
 *
 * Every card that sets type also takes `delay`: how long it waits before any of that
 * starts, in ms, defaulting to 0. It shifts the card as a whole, so the frame is held
 * empty first and the line lands after a beat rather than the instant you cut to it.
 *
 *   delay: 0,    // arrives with the cut
 *   delay: 1000, // a second of empty frame, then the ripple
 *
 * The flash is the one slide with a duration: it holds for 2s (or its own `duration`)
 * and then carries on the way the visitor was going. Everything else — reel, pause,
 * caption, quote, title card — waits until they move, and one scroll gesture is worth
 * exactly one slide in either direction. The last slide leads back round to the first.
 *
 * Poster JPGs live in /public/showcase; videos are served from R2 (see above).
 */
export const showcaseSlides: ShowcaseSlide[] = [
  {
    id: "intro",
    kind: "title",
    text: "Cutting footage to make stories",
    sub: "Or manipulating bytes for that matter"
  },
  {
    id: "hum",
    src: video("loops/hum.mp4"),
    poster: "/showcase/hum-cover.jpg",
    label: "HUM",
    meta: "dir/dop. Oleksandr Korotun | Video Poetry",
    radius: 0 // gently rounded, cinematic
  },
  {
    id: "caption-01",
    text: "Careful now",
    sub: "wreckless behaviour ahead",
    kind: "caption"
  },
  {
    id: "212-CH",
    src: video("loops/212.mp4"),
    poster: "/showcase/212-cover.jpg",
    label: "212 Heroes | Carolina Herrera",
    meta: "dir/dop. Oleksandr Korotun | Commercial",
  },
  {
    id: "quote-01",
    kind: "quote",
    text: "Beware",
    attribution: "of the thin ice"
  },
  {
    id: "icohole",
    src: video("loops/icehole.mp4"),
    poster: "/showcase/icehole-cover.jpg",
    label: "Icehole",
    meta: "dir. Anastasia Gruba, dop. Oleksandr Korotun | Short Film"
  },
  {
    id: "quote-02",
    kind: "quote",
    text: "Next one is too complex for you",
    attribution: "Max Prodaniuk"
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
    id: "quote-03",
    kind: "quote",
    text: "I've told you",
    delay: 1000 // a second of empty frame first, so the line lands after the beat
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
    text: "Mariupolis",
    sub: "Is especially charming in winter"
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
    id: "caption-03",
    kind: "caption",
    text: "But I Love Summer",
    sub: "And youd should too"
  },
  {
    id: "flash-01",
    kind: "flash"
  },
  {
    id: "leopolis",
    src: video("loops/leopolis.mp4"),
    poster: "/showcase/leopolis-cover.jpg",
    label: "Leopolis Night",
    meta: "dir. Nikon Romanchenko, dop. Oleksandr Korotun | Short Film",
    width: 88
  },
  {
    id: "caption-04",
    kind: "quote",
    text: "One more thing",
    attribution: "Don't forget about your phone",
    delay: 1200
  },
  {
    id: "vertical",
    src: video("loops/pushing.mp4"),
    poster: "/showcase/pushing-cover.jpg",
    label: "Pushing Saves",
    meta: "Commercials & Social Media | Vertical Cut",
    width: 34 // pillarbox — bars left & right
  },

]
