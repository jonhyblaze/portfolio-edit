"use client"

import { useEffect } from "react"

/**
 * Pins the document for as long as the page that renders it is mounted.
 *
 * For a page that is exactly one screen and navigates itself, a scrollbar is a
 * control for something that cannot happen. Worse, it still answers: a document
 * one pixel taller than the viewport flashes the bar on every wheel gesture the
 * page has already intercepted, which reads as the page fighting back.
 *
 * `overscroll-behavior` goes with it, so there is no rubber-band at the edges and
 * no pull-to-refresh on touch.
 *
 * Restored on unmount rather than set globally, so client-side navigation to a
 * page that does scroll gets its scrollbar back.
 */
export function ScrollLock() {
  useEffect(() => {
    const root = document.documentElement
    const { body } = document

    const previous = {
      rootOverflow: root.style.overflow,
      bodyOverflow: body.style.overflow,
      overscroll: root.style.overscrollBehavior
    }

    root.style.overflow = "hidden"
    body.style.overflow = "hidden"
    root.style.overscrollBehavior = "none"

    return () => {
      root.style.overflow = previous.rootOverflow
      body.style.overflow = previous.bodyOverflow
      root.style.overscrollBehavior = previous.overscroll
    }
  }, [])

  return null
}
