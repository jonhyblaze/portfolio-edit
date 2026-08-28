import { useSyncExternalStore } from 'react'

const MOBILE_BREAKPOINT = 768

// 1. Setup a function to handle the listener subscription
const subscribe = (callback: () => void) => {
  const queryList = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  queryList.addEventListener('change', callback)
  return () => queryList.removeEventListener('change', callback)
}

// 2. Setup functions to snapshot the values for Client vs Server
const getClientSnapshot = () => window.innerWidth < MOBILE_BREAKPOINT
const getServerSnapshot = () => false // Default fallback for SSR/Server Components

export function useMobile() {
  return useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  )
}
