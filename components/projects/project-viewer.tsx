"use client"

import type { RefObject } from "react"
import { RiFullscreenExitLine, RiFullscreenLine, RiPauseFill, RiPlayFill, RiVolumeMuteLine, RiVolumeUpLine } from "@remixicon/react"
import { formatTimecode } from "@/lib/timecode"
import { cn } from "@/lib/utils"
import { GUTTER } from "./shared"

/** Whatever the viewer is currently showing — the film itself, or one of its versions. */
export type ViewerSource = {
  src: string
  poster?: string
  duration: number
  /** Display stand-in for a grade we hold no separate master of. */
  treatment?: "monochrome"
  /** Set only when a version is selected, so the chrome can name it. */
  versionName?: string
}

type ProjectViewerProps = {
  videoRef: RefObject<HTMLVideoElement | null>
  source: ViewerSource
  title: string
  currentTime: number
  duration: number
  isPlaying: boolean
  isMuted: boolean
  isFullscreen: boolean
  onTogglePlay: () => void
  onToggleMute: () => void
  onToggleFullscreen: () => void
  onLoadedMetadata: () => void
  onPlay: () => void
  onPause: () => void
}

/**
 * The screening end of the page: a black stage with the film letterboxed inside
 * it, and one quiet row of chrome underneath.
 *
 * The stage is black in both themes on purpose — the rest of the page follows
 * the site's tokens, but a screen is a screen. Everything drawn on top of it is
 * therefore white-tinted rather than `foreground`.
 *
 * Native controls are off; the row below does the work, so the film is never
 * covered by a browser's idea of a player.
 */
export function ProjectViewer({
  videoRef,
  source,
  title,
  currentTime,
  duration,
  isPlaying,
  isMuted,
  isFullscreen,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
  onLoadedMetadata,
  onPlay,
  onPause
}: ProjectViewerProps) {
  return (
    <>
      {/* `group` so the picture can answer to the cursor being anywhere on the stage —
          the click target sits over the video, so the video never sees the hover itself. */}
      <div className="group relative min-h-[220px] flex-1 border-y border-border bg-black md:min-h-[280px]">
        <video
          ref={videoRef}
          // React swaps this when a version is chosen; the element reloads and the
          // archive puts the playhead back where it was.
          src={source.src}
          poster={source.poster}
          preload="metadata"
          playsInline
          onLoadedMetadata={onLoadedMetadata}
          onPlay={onPlay}
          onPause={onPause}
          // Out of flow on purpose: in flow, the element's intrinsic height is what
          // the stage would size to, and the stage would stop being the thing that
          // fits the viewport.
          // A film standing still sits back a little; playing or pointed at, it comes
          // up to full. Same brightness language the strips on /projects speak.
          className={cn(
            "absolute inset-0 h-full w-full object-contain transition-[filter] duration-500 ease-out motion-reduce:transition-none",
            isPlaying ? "brightness-100" : "brightness-[0.8]",
            "group-hover:brightness-100",
            source.treatment === "monochrome" && "grayscale"
          )}
        />

        {/* The whole stage is the play/pause target, so the picture stays clickable
            while showing nothing. The button is also what a keyboard and a screen
            reader get. */}
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
          className={cn(
            "absolute inset-0 grid place-items-center",
            "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white/30"
          )}>
          {/* Nothing is drawn over a film that is running — not on hover either. It
              stays mounted rather than unmounting so it fades out on play instead of
              vanishing, and the row below already says whether the film is moving. */}
          <span
            aria-hidden
            className={cn(
              "grid size-14 place-items-center rounded-full border border-white/40 bg-black/20 text-white/80 backdrop-blur-[2px]",
              "transition-opacity duration-500 ease-out motion-reduce:transition-none",
              isPlaying ? "opacity-0" : "opacity-100"
            )}>
            <RiPlayFill className="size-5 translate-x-px" />
          </span>
        </button>
      </div>

      {/* Chrome. Timecode at the ends, the film's own controls in the middle —
          the arrangement a viewer window has, without the buttons a player has. */}
      <div className={cn("flex h-11 shrink-0 items-center gap-4", GUTTER)}>
        {/* Both halves are flex-1 so the transport sits on the centre line of the
            stage rather than wherever the labels leave room for it. */}
        <div className="flex min-w-0 flex-1 items-baseline gap-4">
          <span className="label-s shrink-0 tabular-nums text-muted-foreground">{formatTimecode(currentTime)}</span>
          {source.versionName && (
            <span className="label-s truncate uppercase tracking-[0.2em] text-muted-foreground/50">{source.versionName}</span>
          )}
        </div>

        <ViewerButton onClick={onTogglePlay} label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <RiPauseFill className="size-4" /> : <RiPlayFill className="size-4" />}
        </ViewerButton>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
          <ViewerButton onClick={onToggleMute} label={isMuted ? "Unmute" : "Mute"} pressed={isMuted}>
            {isMuted ? <RiVolumeMuteLine className="size-4" /> : <RiVolumeUpLine className="size-4" />}
          </ViewerButton>
          <ViewerButton onClick={onToggleFullscreen} label={isFullscreen ? "Exit full screen" : "Full screen"} shortcut="F">
            {isFullscreen ? <RiFullscreenExitLine className="size-4" /> : <RiFullscreenLine className="size-4" />}
          </ViewerButton>
          <span className="label-s ml-3 shrink-0 tabular-nums text-muted-foreground">
            {formatTimecode(duration || source.duration)}
          </span>
        </div>
      </div>
    </>
  )
}

function ViewerButton({
  onClick,
  label,
  pressed,
  shortcut,
  children
}: {
  onClick: () => void
  label: string
  pressed?: boolean
  /** The key that does the same thing. Announced properly rather than folded into the label. */
  shortcut?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      aria-keyshortcuts={shortcut?.toLowerCase()}
      title={shortcut ? `${label} (${shortcut})` : label}
      className={cn(
        "grid size-8 place-items-center text-muted-foreground transition-colors duration-200",
        "hover:text-foreground focus-visible:text-foreground",
        "focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
      )}>
      {children}
    </button>
  )
}
