"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react"

/**
 * The space bar is reserved.
 *
 * Everywhere on the site it is stopped from doing what a browser would normally
 * do with it — scrolling the page, and firing the button or control that happens
 * to hold focus. It does one thing, and only where something has claimed it:
 * play and pause the film on a project page. Nowhere else does it do anything at
 * all, which includes the homepage, where the loops are left alone.
 *
 * Two deliberate exceptions, because neither is a matter of taste:
 *
 *   Typing — a field you cannot put a space into is broken, not opinionated.
 *   Modifiers — ⌘/Ctrl/Alt + Space belongs to the operating system.
 *
 * Enter still activates buttons and links, so nothing on the site becomes
 * unreachable from the keyboard; it just stops answering to this one key.
 */

type SpaceHandler = () => void

type SpaceKeyContextValue = {
  /** Take the space bar. Returns the release. */
  claim: (handler: SpaceHandler) => () => void
}

const SpaceKeyContext = createContext<SpaceKeyContextValue | null>(null)

/** Input types that hold no text, so the bar is not being used to write. */
const NON_TEXT_INPUTS = new Set(["button", "submit", "reset", "checkbox", "radio", "file", "range", "image", "color"])

const isTyping = (target: EventTarget | null) => {
  const node = target as HTMLElement | null
  if (!node || typeof node.tagName !== "string") return false
  if (node.isContentEditable) return true

  const role = node.getAttribute?.("role")
  if (role === "textbox" || role === "searchbox" || role === "combobox") return true

  const tag = node.tagName
  if (tag === "TEXTAREA" || tag === "SELECT") return true
  if (tag === "INPUT") return !NON_TEXT_INPUTS.has((node as HTMLInputElement).type)

  return false
}

export function SpaceKeyProvider({ children }: { children: ReactNode }) {
  const handler = useRef<SpaceHandler | null>(null)

  const claim = useCallback((next: SpaceHandler) => {
    handler.current = next
    // Only let go if nobody else has claimed it since.
    return () => {
      if (handler.current === next) handler.current = null
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // `code`, not `key`: the physical bar, whatever the keyboard layout says.
      if (event.code !== "Space") return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isTyping(event.target)) return

      // This one call does both halves of the job: it stops the page scrolling,
      // and because a button's click is dispatched on the keyup that follows an
      // un-prevented keydown, it stops the focused control firing too.
      event.preventDefault()

      // A held bar repeats. Swallow the repeats rather than machine-gunning the
      // transport, but keep them prevented so the page still cannot scroll.
      if (event.repeat) return

      handler.current?.()
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const value = useMemo(() => ({ claim }), [claim])

  return <SpaceKeyContext.Provider value={value}>{children}</SpaceKeyContext.Provider>
}

/**
 * Give the space bar something to do for as long as the caller is mounted. The
 * handler may change between renders without re-claiming; the latest one is
 * always what runs.
 */
export function useSpaceKey(handler: SpaceHandler) {
  const context = useContext(SpaceKeyContext)
  if (!context) throw new Error("useSpaceKey must be used inside <SpaceKeyProvider>")

  const latest = useRef(handler)
  useEffect(() => {
    latest.current = handler
  })

  const { claim } = context
  useEffect(() => claim(() => latest.current()), [claim])
}
