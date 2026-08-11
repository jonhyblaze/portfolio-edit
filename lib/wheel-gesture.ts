/**
 * Reading a wheel as a sequence of pushes.
 *
 * Some idea of "still the same gesture" is unavoidable for anything that moves one screen
 * at a time: a trackpad reports a single flick as dozens of events over as much as a
 * second, and taken at face value one flick would run through half the reel.
 *
 * Waiting for the stream to go quiet is the wrong way to find the end of a push, though.
 * macOS synthesises coasting events long after the fingers have left the pad, so anything
 * that waits stays locked for the whole tail — and a second flick landing on top of that
 * tail does nothing at all. Flicking twice, fast, has to give two slides.
 *
 * So nothing here waits for silence. It reads the *shape* of the stream instead, because
 * momentum can only ever decay: fingers are the only thing that can make it climb again.
 * Any of three signals is a new push, and a push is reported on its very first event, so the
 * cut lands on the flick rather than a moment behind it —
 *
 *   an overtake, where a coasting stream comes back harder than the push it is coasting
 *   from ever managed. Nothing decaying does that, so it needs no corroborating;
 *   a rebound, where the delta climbs off a trough well under the peak and keeps climbing.
 *   A tail can twitch upward for one event, but only fingers sustain it;
 *   a gap, where a real delta arrives out of a lull no momentum stream ever leaves — which
 *   is also what makes each discrete notch of a mouse wheel count.
 *
 * Everything else belongs to the push already reported and moves nothing: its opening ramp,
 * and the whole of the decaying tail behind it.
 *
 * Everything is measured against the push's own peak rather than fixed numbers, because the
 * two ends of the range are so far apart — one notch of a mouse wheel reports around 120
 * pixels, a slow two-finger drag reports single digits. The one absolute is MIN_PUSH, which
 * is what stops the wander of a very slow drag from being read as a shove.
 */

/** One push, and how it has developed so far. */
export type WheelPush = {
  direction: 1 | -1
  /** The biggest delta this push has produced. Everything below is measured against it. */
  peak: number
  /** The smallest delta since the peak — the floor a rebound has to climb off. */
  trough: number
  /** Whether the stream has fallen far enough below the peak to be coasting. */
  decayed: boolean
  /** How many events in a row have climbed clear of the trough. */
  climbs: number
  /** When this push last saw an event of any size. */
  lastAt: number
}

/** Under this share of a push's peak, the stream is coasting rather than driven. */
const DECAYED_RATIO = 0.5

/** How far a delta has to climb off its trough to read as fingers back on the pad. */
const REBOUND_RATIO = 3

/**
 * And how many events in a row have to do it.
 *
 * One is not enough. A coasting tail is not perfectly smooth, and on a noisy device a single
 * event can spike several times its neighbours — which looks exactly like the first frame of
 * a new flick. What a tail cannot do is *keep* climbing: the momentum curve only falls. Two
 * costs a frame or so of latency, well under anything a hand can feel, and it will not be
 * fooled by a spike.
 */
const REBOUND_CLIMBS = 2

/**
 * And a sanity floor under that, as a share of the peak of the push being interrupted.
 *
 * It cannot be set high. A gentle nudge after a hard flick is a perfectly ordinary thing to
 * do, and it arrives at a fraction of the delta the flick peaked at — asking for a tenth of
 * the peak swallowed it. A twentieth, on top of MIN_PUSH and the rebound ratio, is only
 * there to catch a badly behaved stream whose tail jitters by hundreds of per cent.
 */
const REVIVE_RATIO = 0.05

/** Below this many pixels, a delta is nobody's idea of a push. */
const MIN_PUSH = 8

/** A lull longer than any momentum stream leaves mid-flight, so a delta after one is new. */
const PUSH_GAP_MS = 70

/** Nothing at all for this long and the gesture is over, however gently the next one opens. */
const GESTURE_IDLE_MS = 200

/**
 * Nothing moves twice inside this, whichever signal found the push.
 *
 * It is deliberately short, because a mouse wheel spun hard delivers notches faster than
 * anything a hand does on a trackpad, and every notch is a real push that has to land.
 */
const MIN_STEP_GAP_MS = PUSH_GAP_MS

/**
 * A push *inferred from the shape of a live stream* waits longer than that.
 *
 * Nobody makes two deliberate gestures in a seventh of a second, so it costs the visitor
 * nothing — and it covers the two places the inference is blind. A hard flick's opening ramp
 * is jagged enough that a delta in it can dip and climb back like a second push, and a
 * diagonal gesture flips sign as the hand wobbles. Both are over within a few frames of the
 * push that has just landed, and this outlives them.
 */
const INFERRED_COOLDOWN_MS = 140

/** One line of a line-mode wheel, in pixels, so MIN_PUSH means the same on every device. */
const LINE_PX = 16

/** What one wheel event moved, in pixels, whatever units it chose to report. */
export function wheelPixels(deltaY: number, deltaMode: number, viewport: number) {
  if (deltaMode === 1) return deltaY * LINE_PX
  if (deltaMode === 2) return deltaY * viewport
  return deltaY
}

/**
 * Fold one wheel event into the push being read, and say whether it opened a new one.
 *
 * `moved` is signed pixels (see wheelPixels), `lastStepAt` the last time the caller acted
 * on a push. The returned push always replaces the one passed in; `step` is the direction
 * to move, or 0 for "this event belongs to a push already reported".
 */
export function readWheel(
  previous: WheelPush | null,
  moved: number,
  now: number,
  lastStepAt: number
): { push: WheelPush; step: 1 | -1 | 0 } {
  const direction: 1 | -1 = moved > 0 ? 1 : -1
  const magnitude = Math.abs(moved)

  /** A new push: report it, and take this event's size as the envelope for what follows. */
  const opened = {
    push: { direction, peak: magnitude, trough: magnitude, decayed: false, climbs: 0, lastAt: now },
    step: direction
  }

  /**
   * A push, unless one landed too recently to allow another. The envelope still resets
   * either way: whatever comes next is measured against this push, not the suppressed one.
   */
  const open = (cooldown = MIN_STEP_GAP_MS) =>
    now - lastStepAt >= cooldown ? opened : { push: opened.push, step: 0 as const }

  if (!previous) return open()

  const sinceLast = now - previous.lastAt

  // Nothing at all for a while: whatever this is, it opens something new, however softly.
  if (sinceLast >= GESTURE_IDLE_MS) return open()

  // Momentum never turns around, so a real delta the other way is a new push. A sign flip
  // too small to be one is a hand wobbling through a diagonal gesture: it is not a push and
  // it is not this push either, so it is dropped without even keeping the stream alive.
  if (direction !== previous.direction) {
    return magnitude >= MIN_PUSH ? open(INFERRED_COOLDOWN_MS) : { push: previous, step: 0 }
  }

  // A delta worth calling a push, arriving after a lull no coasting stream leaves.
  if (sinceLast >= PUSH_GAP_MS && magnitude >= MIN_PUSH) return open()

  const push = { ...previous, lastAt: now }

  // Falling away — the tail. Once it is well under the peak a climb back off it is worth
  // something; until then it is only the far side of the push, and the streak starts over.
  if (magnitude <= push.trough) {
    return {
      push: { ...push, trough: magnitude, decayed: push.decayed || magnitude < push.peak * DECAYED_RATIO, climbs: 0 },
      step: 0
    }
  }

  // Rising off the trough. A stream that has coasted and then beats its own peak with a real
  // delta needs no corroborating: nothing decaying comes back that hard, so it is a shove,
  // and it lands now. (Without the size test this fires on the ordinary wander of a slow
  // drag, where beating a peak of four pixels means nothing at all.)
  if (push.decayed && magnitude >= push.peak && magnitude >= MIN_PUSH) return open(INFERRED_COOLDOWN_MS)

  const climbing =
    push.decayed && magnitude >= MIN_PUSH && magnitude >= push.trough * REBOUND_RATIO && magnitude >= push.peak * REVIVE_RATIO
  const climbs = climbing ? push.climbs + 1 : 0

  if (climbs >= REBOUND_CLIMBS) return open(INFERRED_COOLDOWN_MS)

  // Not a rebound, or not yet one. If it set a new ceiling it is this push still getting up
  // to speed: raise the peak and take the trough up with it, so a later rebound is judged
  // against this push rather than whatever it grew out of.
  if (magnitude >= push.peak) {
    return { push: { ...push, peak: magnitude, trough: magnitude, decayed: false, climbs }, step: 0 }
  }

  return { push: { ...push, climbs }, step: 0 }
}
