/**
 * Seconds to a clock the archive can read. Under an hour it stays at M:SS —
 * H:MM:SS for everything, on a page this small, is mostly zeroes.
 */
export function formatTimecode(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0

  const whole = Math.floor(seconds)
  const hours = Math.floor(whole / 3600)
  const minutes = Math.floor((whole % 3600) / 60)
  const secs = whole % 60
  const pad = (n: number) => String(n).padStart(2, "0")

  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(secs)}` : `${minutes}:${pad(secs)}`
}
