import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { OG_SIZE } from "./og-size"

export { OG_SIZE }

/** A poster off /public, inlined — the image renderer can't fetch relative paths. */
async function inline(publicPath: string) {
  const file = await readFile(join(process.cwd(), "public", publicPath))
  return `data:image/jpeg;base64,${file.toString("base64")}`
}

/**
 * The link preview: a frame from the work, full bleed, with a caption under
 * it the way a festival still carries one. The frame does the selling; the
 * type only says whose it is.
 */
export async function renderOgImage({ poster, eyebrow, title, subtitle }: { poster: string; eyebrow: string; title: string; subtitle?: string }) {
  const src = await inline(poster)

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: "#000" }}>
        <img src={src} alt="" width={OG_SIZE.width} height={OG_SIZE.height} style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }} />
        <div
          style={{
            // Explicit edges: the renderer doesn't size an absolute box from `inset`.
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            background: "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 62%, rgba(0,0,0,0.9) 100%)"
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            bottom: 56,
            display: "flex",
            flexDirection: "column",
            color: "#fff"
          }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1 }}>{title}</div>
          {subtitle && <div style={{ display: "flex", marginTop: 16, fontSize: 28, color: "rgba(255,255,255,0.75)" }}>{subtitle}</div>}
        </div>
      </div>
    ),
    OG_SIZE
  )
}
