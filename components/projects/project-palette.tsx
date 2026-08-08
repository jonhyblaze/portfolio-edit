"use client"

import { useEffect, useRef, useState } from "react"
import type { ProjectPalette } from "@/data/projects"
import { cn } from "@/lib/utils"
import { LABEL } from "./shared"

/** How long a copied swatch says so before going back to its hex. */
const COPIED_MS = 1200

/**
 * Perceived lightness, to decide whether a swatch's own label should be set in
 * black or white. Cheap sRGB luminance — close enough for a caption, and it has
 * to be exact in neither direction to stay readable.
 */
const isLight = (hex: string) => {
  const value = hex.replace("#", "")
  const [r, g, b] = [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16) || 0)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 140
}

/**
 * The film's colour, as a block rather than a list.
 *
 * Laid out as a square because that is how colour gets presented to a grade —
 * a chart, not a legend — and because a square lets you read the relationships
 * between swatches instead of one after another. The side is derived from how
 * many colours there are, so nine sits as a 3×3 and sixteen as a 4×4 without
 * anything here changing.
 *
 * Swatches butt against each other with no rule between them: a hairline would
 * put a colour that isn't in the film between two that are.
 */
export function ProjectPaletteBlock({ palette }: { palette: ProjectPalette }) {
  const { swatches, note } = palette
  const [copied, setCopied] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = (hex: string) => {
    navigator.clipboard
      ?.writeText(hex)
      .then(() => {
        setCopied(hex)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(null), COPIED_MS)
      })
      .catch(() => {})
  }

  const columns = Math.ceil(Math.sqrt(swatches.length))

  return (
    <div className="grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16">
      <ul className="grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {swatches.map((swatch, index) => {
          const light = isLight(swatch.hex)
          const wasCopied = copied === swatch.hex

          return (
            <li key={`${swatch.hex}-${index}`}>
              <button
                type="button"
                onClick={() => copy(swatch.hex)}
                aria-label={`Copy ${swatch.hex}${swatch.name ? ` — ${swatch.name}` : ""}`}
                style={{ backgroundColor: swatch.hex }}
                className={cn(
                  "group flex aspect-square w-full flex-col justify-end gap-0.5 p-2.5 text-left",
                  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground/60"
                )}>
                {swatch.name && (
                  <span
                    className={cn(
                      "label-s uppercase tracking-[0.15em] transition-opacity duration-300 motion-reduce:transition-none",
                      light ? "text-black" : "text-white",
                      "opacity-55 group-hover:opacity-100 group-focus-visible:opacity-100"
                    )}>
                    {swatch.name}
                  </span>
                )}
                <span
                  className={cn(
                    "label-s tabular-nums uppercase transition-opacity duration-300 motion-reduce:transition-none",
                    light ? "text-black" : "text-white",
                    "opacity-35 group-hover:opacity-80 group-focus-visible:opacity-80"
                  )}>
                  {wasCopied ? "Copied" : swatch.hex}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="max-w-prose space-y-6">
        {note && <p className="body-m text-muted-foreground">{note}</p>}

        <p className={cn(LABEL, "border-t border-border pt-4")}>
          {String(swatches.length).padStart(2, "0")} swatches · click to copy
        </p>

        <p className="label-s text-muted-foreground/40">
          Sampled from this project&rsquo;s strip frames and named for what they are in the picture. The delivered palette replaces
          them.
        </p>
      </div>
    </div>
  )
}
