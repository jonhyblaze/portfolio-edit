"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { Project } from "@/data/projects"
import { ProjectHeader } from "./project-header"
import { ProjectMaterials } from "./project-materials"
import { ProjectPager } from "./project-pager"
import { ProjectTimeline } from "./project-timeline"
import { ProjectViewer, type ViewerSource } from "./project-viewer"

type ProjectArchiveProps = {
  project: Project
  previous: Project
  next: Project
  position: number
  total: number
}

/** Anything under a thirtieth of a second is a repaint nobody can see. */
const FRAME = 1 / 30

/**
 * The whole record, and the only thing on the page that holds state.
 *
 * Playback lives here rather than inside the viewer because the timeline draws
 * the playhead, the versions list decides what is loaded, and the stills, boards
 * and notes all cue the film — everything on the page is talking about one video
 * element, so one place owns it.
 *
 * The screening block above the fold is a flex column with a stated minimum
 * height, so the stage takes whatever the header, chrome and timeline don't. The
 * materials start where it ends.
 */
export function ProjectArchive({ project, previous, next, position, total }: ProjectArchiveProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)
  /** Where to put the playhead once a newly chosen version has loaded. */
  const resume = useRef<{ time: number; playing: boolean } | null>(null)

  const versions = project.materials?.versions
  const [versionId, setVersionId] = useState<string | null>(versions?.[0]?.id ?? null)

  const source = useMemo<ViewerSource | null>(() => {
    const version = versions?.find((candidate) => candidate.id === versionId)

    if (version) {
      return {
        src: version.src,
        poster: version.poster ?? project.video?.poster,
        duration: version.duration ?? project.video?.duration ?? 0,
        treatment: version.treatment,
        versionName: version.name
      }
    }

    if (project.video) {
      return { src: project.video.src, poster: project.video.poster, duration: project.video.duration }
    }

    return null
  }, [project.video, versions, versionId])

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(source?.duration ?? 0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // A new source is a new length. The declared one holds until the element says
  // otherwise, which keeps the timeline drawn to scale in the meantime.
  useEffect(() => {
    setDuration(source?.duration ?? 0)
  }, [source?.src, source?.duration])

  // `timeupdate` fires about four times a second — enough for a clock, not for a
  // playhead. This runs only while the film is actually moving.
  useEffect(() => {
    if (!isPlaying) return

    let frame = requestAnimationFrame(function tick() {
      const element = videoRef.current
      if (element) setCurrentTime((previousTime) => (Math.abs(element.currentTime - previousTime) < FRAME ? previousTime : element.currentTime))
      frame = requestAnimationFrame(tick)
    })

    return () => cancelAnimationFrame(frame)
  }, [isPlaying])

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === viewerRef.current)

    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  const seek = useCallback(
    (time: number) => {
      const element = videoRef.current
      if (!element) return

      const length = Number.isFinite(element.duration) ? element.duration : duration
      const next = Math.min(Math.max(time, 0), length || 0)

      element.currentTime = next
      setCurrentTime(next)
    },
    [duration]
  )

  /**
   * Cueing from a still, a board or a note. The film is usually off screen by
   * then, so the page brings it back — a direct answer to a click, not the page
   * moving on its own.
   */
  const cue = useCallback(
    (time: number) => {
      seek(time)
      viewerRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "center"
      })
    },
    [seek]
  )

  const selectVersion = useCallback(
    (id: string) => {
      if (id === versionId) return

      // Hold the playhead across the swap so a cut and its grade can be compared
      // rather than restarted.
      const element = videoRef.current
      resume.current = element ? { time: element.currentTime, playing: !element.paused } : null
      setVersionId(id)
    },
    [versionId]
  )

  const onLoadedMetadata = useCallback(() => {
    const element = videoRef.current
    if (!element) return

    const length = Number.isFinite(element.duration) ? element.duration : (source?.duration ?? 0)
    setDuration(length)

    const pending = resume.current
    resume.current = null

    if (!pending) {
      setCurrentTime(element.currentTime)
      return
    }

    element.currentTime = Math.min(pending.time, length)
    setCurrentTime(element.currentTime)
    if (pending.playing) element.play().catch(() => {})
  }, [source?.duration])

  const togglePlay = useCallback(() => {
    const element = videoRef.current
    if (!element) return

    if (element.paused) element.play().catch(() => {})
    else element.pause()
  }, [])

  const toggleMute = useCallback(() => {
    const element = videoRef.current
    if (!element) return

    element.muted = !element.muted
    setIsMuted(element.muted)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
      return
    }

    viewerRef.current?.requestFullscreen?.().catch(() => {})
  }, [])

  return (
    <article className="w-full">
      {/* Screening block — one viewport, minus the site header. */}
      <div className="flex min-h-[calc(100svh-4rem)] flex-col">
        <ProjectHeader project={project} position={position} total={total} />

        <div ref={viewerRef} className="flex min-h-0 flex-1 flex-col bg-background">
          {source && (
            <ProjectViewer
              videoRef={videoRef}
              source={source}
              title={project.title.trim()}
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              isMuted={isMuted}
              isFullscreen={isFullscreen}
              onTogglePlay={togglePlay}
              onToggleMute={toggleMute}
              onToggleFullscreen={toggleFullscreen}
              onLoadedMetadata={onLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          )}

          <ProjectTimeline
            duration={duration}
            currentTime={currentTime}
            markers={project.markers ?? []}
            onSeek={seek}
            seed={project.slug}
          />
        </div>
      </div>

      <ProjectMaterials project={project} activeVersionId={versionId} onSelectVersion={selectVersion} onSeek={cue} />

      <ProjectPager previous={previous} next={next} />
    </article>
  )
}
