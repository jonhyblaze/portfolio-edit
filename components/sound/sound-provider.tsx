"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"

/**
 * Cues are synthesised with the Web Audio API rather than shipped as files —
 * a handful of oscillators weighs nothing and never has to be downloaded.
 * Each name maps to the kind of showcase slide being scrolled into.
 */
export type SoundCue = "title" | "video" | "pause" | "caption" | "quote"

const STORAGE_KEY = "sound-enabled"

type Engine = {
  ctx: AudioContext
  master: GainNode
  noise: AudioBuffer
}

type SoundContextValue = {
  /** Whether the visitor has opted into sound. Off until they say otherwise. */
  enabled: boolean
  toggle: () => void
  /** Fire a cue. No-op while sound is off, so callers never need to check. */
  play: (cue: SoundCue) => void
}

const SoundContext = createContext<SoundContextValue | null>(null)

export function useSound() {
  const value = useContext(SoundContext)
  if (!value) throw new Error("useSound must be used inside <SoundProvider>")
  return value
}

function createEngine(): Engine | null {
  const Ctor = window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null

  const ctx = new Ctor()
  const master = ctx.createGain()
  master.gain.value = 0.22
  master.connect(ctx.destination)

  // One second of white noise — the raw material for every click transient.
  const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const channel = noise.getChannelData(0)
  for (let i = 0; i < channel.length; i++) channel[i] = Math.random() * 2 - 1

  return { ctx, master, noise }
}

/**
 * One mechanical click — the transport buttons on a tape deck.
 *
 * Two layers: a few milliseconds of bright noise for the contact itself, and a
 * short damped sine for the housing knocking around it. Everything is over
 * inside ~150ms. No swells, no tails; a cut should sound like a button, not an
 * effect.
 *
 *   snap  → brightness of the contact, in Hz
 *   body  → pitch of the knock underneath it
 *   decay → how long the body rings
 */
function click(
  { ctx, master, noise }: Engine,
  opts: { at: number; level: number; snap: number; body: number; decay: number }
) {
  const { at, level, snap, body, decay } = opts

  const contact = ctx.createBufferSource()
  contact.buffer = noise

  const band = ctx.createBiquadFilter()
  band.type = "bandpass"
  band.frequency.value = snap
  band.Q.value = 0.7

  const contactGain = ctx.createGain()
  contactGain.gain.setValueAtTime(level, at)
  contactGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.012)

  contact.connect(band).connect(contactGain).connect(master)
  contact.start(at)
  contact.stop(at + 0.02)

  const knock = ctx.createOscillator()
  knock.type = "sine"
  knock.frequency.setValueAtTime(body, at)
  knock.frequency.exponentialRampToValueAtTime(body * 0.6, at + decay)

  const knockGain = ctx.createGain()
  knockGain.gain.setValueAtTime(level * 0.7, at)
  knockGain.gain.exponentialRampToValueAtTime(0.0001, at + decay)

  knock.connect(knockGain).connect(master)
  knock.start(at)
  knock.stop(at + decay + 0.02)
}

/** A deliberate switch throw: lower and slower than the rest, but still just a click. */
const switchThrow = (engine: Engine, at: number) => click(engine, { at, level: 0.45, snap: 1200, body: 90, decay: 0.18 })

const CUES: Record<SoundCue, (engine: Engine, at: number) => void> = {
  /** Play: the two-stage clunk of a transport button — press, then the latch catching. */
  video: (engine, at) => {
    click(engine, { at, level: 0.5, snap: 2400, body: 180, decay: 0.07 })
    click(engine, { at: at + 0.045, level: 0.3, snap: 1700, body: 120, decay: 0.09 })
  },
  /** Stop: one heavier throw, a little more weight under it. */
  pause: (engine, at) => {
    click(engine, { at, level: 0.55, snap: 1500, body: 110, decay: 0.13 })
  },
  /** A light relay tick — the smallest switch in the rack. */
  caption: (engine, at) => {
    click(engine, { at, level: 0.28, snap: 3200, body: 320, decay: 0.03 })
  },
  /** The opening card and the statement cards share the same throw. */
  quote: switchThrow,
  title: switchThrow
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  // Mirrored in a ref so `play` stays referentially stable and never reads a stale value.
  const enabledRef = useRef(false)
  const engineRef = useRef<Engine | null>(null)

  // Read the stored preference after mount so the server and client markup agree.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) === "on"
    enabledRef.current = stored
    setEnabled(stored)
  }, [])

  useEffect(() => {
    return () => {
      engineRef.current?.ctx.close().catch(() => {})
      engineRef.current = null
    }
  }, [])

  const toggle = useCallback(() => {
    const next = !enabledRef.current
    enabledRef.current = next
    setEnabled(next)
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off")

    if (next) {
      // Switching sound on is the user gesture browsers require before audio may start.
      engineRef.current ??= createEngine()
      engineRef.current?.ctx.resume().catch(() => {})
    }
  }, [])

  const play = useCallback((cue: SoundCue) => {
    if (!enabledRef.current) return

    const engine = (engineRef.current ??= createEngine())
    if (!engine || engine.ctx.state === "closed") return
    if (engine.ctx.state === "suspended") engine.ctx.resume().catch(() => {})

    CUES[cue](engine, engine.ctx.currentTime + 0.01)
  }, [])

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play])

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}
