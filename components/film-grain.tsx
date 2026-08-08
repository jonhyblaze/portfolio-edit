import { cn } from "@/lib/utils"

/** Drifting fractal noise — the texture stock has and digital doesn't. */
const GRAIN_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

/**
 * Sits over whatever it is placed on. The tile is oversized (-inset-1/4) because
 * `animate-grain` shifts it a few percent in every direction — at inset-0 the
 * edges would swim into view. The overhang is clipped by the inset-0 wrapper so
 * it never spills out and stretches the page's scroll area.
 */
export function FilmGrain({ className }: { className?: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={cn("absolute -inset-1/4 animate-grain opacity-[0.2] mix-blend-screen", className)}
        style={{ backgroundImage: `url("${GRAIN_SVG}")` }}
      />
    </div>
  )
}
