/**
 * Projects: the strips on /projects, and the archive on /projects/[slug].
 *
 * The shape is deliberately flat — a CMS will fill these fields verbatim later,
 * including `frames`, where each entry carries its own `src` and `alt`.
 *
 * Frames come from two folders, and the split is deliberate:
 *
 *   /public/projects/strips — the four frames of the strip on /projects. Cut and
 *     compressed for a band that is four-across and never full width, so they are
 *     small: roughly a third of the weight of the stills, for the page that loads
 *     every project at once.
 *   /public/projects/stills — the contact sheet on /projects/[slug], where the
 *     point is a closer look. Higher resolution, and the only place a project's
 *     own ratio is shown uncropped.
 *
 * The rest is placeholder: the titles and credits are invented, and the alt text
 * says which frame it is rather than describing a picture that doesn't belong to
 * the project yet — real copy comes with the real stills.
 *
 * Everything past `frames` belongs to the project page and is mock in the same
 * way: the films are real, the records are not. `video` mostly points at the
 * showcase loops on R2, because most of the finished films are not online — so
 * those "cuts" run under a minute and carry no audio track. The projects that do
 * have a master play it out of edits/, with sound and at full length. Pointing
 * the remaining keys at their own masters is the only change the page needs.
 */

export type ProjectFrame = {
  src: string
  alt: string
}

/**
 * The master the viewer plays. `duration` is in seconds and declared rather than
 * read, so the timeline can be drawn on the server; the element's own metadata
 * takes over as soon as it arrives.
 */
export type ProjectVideo = {
  src: string
  poster?: string
  duration: number
  /** Informational, e.g. "16:9". The viewer letterboxes to whatever it is handed. */
  aspectRatio?: string
}

/** A point in the cut worth naming. Times are seconds into the master. */
export type ProjectMarker = {
  time: number
  label: string
}

/** A contact-sheet still. `time` links it back to the frame it was pulled from. */
export type ProjectStill = ProjectFrame & {
  time?: number
}

/**
 * One board paired with the frame it became. `sketch` is the drawn panel; where
 * a project has no digitised boards the page falls back to the final frame under
 * a sketch treatment, and says so.
 */
export type ProjectBoard = {
  /** Shot notation, e.g. "SH 04A". */
  shot: string
  sketch?: string
  final: string
  alt: string
  note?: string
  time?: number
}

/**
 * A selectable variant of the film. `treatment` is a display stand-in for grades
 * we don't hold a separate master of yet — a real one just gets its own `src`.
 */
export type ProjectVersion = {
  id: string
  name: string
  src: string
  poster?: string
  duration?: number
  note?: string
  treatment?: "monochrome"
}

/**
 * One shot in two states, for the grade comparison.
 *
 * `before` is the ungraded plate and `after` the delivered grade — both plain
 * image paths, identically framed, so dropping the real pair in is a path swap
 * and nothing else. `simulated` marks a shot whose ungraded plate we don't hold
 * yet: the panel stands one in by desaturating the graded frame, and says so.
 * Delete the flag when the real plate lands.
 */
export type ProjectGrade = {
  /** Shot notation, e.g. "SH 07". */
  shot: string
  before: string
  after: string
  alt: string
  note?: string
  time?: number
  simulated?: boolean
}

/**
 * One colour off the film. `name` is what it is in the picture — a coat, a
 * streetlamp, the sky — rather than a colour-theory term.
 */
export type ProjectSwatch = {
  /** "#rrggbb". */
  hex: string
  name?: string
}

/**
 * The film's palette: the colours the grade keeps coming back to, not a sample
 * of any one frame. One per project, and the panel lays out whatever length it
 * is given — nine reads as a 3×3, sixteen as a 4×4, and so on.
 */
export type ProjectPalette = {
  swatches: ProjectSwatch[]
  note?: string
}

/**
 * A festival the film played. One list holds both selections and wins, because a
 * win is a selection — writing them as two fields would mean naming the same
 * festival twice. `award` is what was won there, and its presence is what makes
 * the entry a win: the page bins on it.
 *
 * `note` is the section or programme the film sat in ("International Short Film
 * Competition", "30 Years of Ukrainian Cinema"), which is what a selection has
 * to say for itself where a win has the award.
 */
export type ProjectFestival = {
  /** The festival as its own catalogue names it, without the year. */
  name: string
  year?: number
  /** What was won. Present means a win, absent means a selection. */
  award?: string
  note?: string
}

/** A line from the edit log. With a `time` it doubles as a cue. */
export type ProjectNote = {
  time?: number
  text: string
}

/** One row of the technical sheet. Free-form so a CMS can add rows we don't know about. */
export type ProjectSpec = {
  label: string
  value: string
}

export type ProjectCastMember = {
  name: string
  character?: string
}

export type ProjectCrewMember = {
  role: string
  name: string
}

export type ProjectCredits = {
  cast?: ProjectCastMember[]
  crew?: ProjectCrewMember[]
}

/** Optional throughout: the page renders the sections a project actually has. */
export type ProjectMaterials = {
  stills?: ProjectStill[]
  storyboard?: ProjectBoard[]
  grades?: ProjectGrade[]
  palette?: ProjectPalette
  versions?: ProjectVersion[]
  notes?: ProjectNote[]
}

export type Project = {
  slug: string
  title: string
  year: number
  /** Short form, e.g. "Short Film", "Feature Documentary". */
  type: string
  /** Pre-formatted, e.g. "18 min" — runtimes are written, not computed. */
  runtime: string
  director: string
  /**
   * The shape of the picture, as a CSS aspect-ratio: "16 / 9", "4 / 3", "2.39 / 1".
   * Everything that holds a frame sizes itself to this — the strip on /projects,
   * the contact sheet, the grade wipe, the boards — so a film that isn't
   * widescreen is not cropped into a widescreen hole. Omitted reads as 16:9, so
   * only a film that departs from it has to say anything.
   *
   * This is the film's own ratio, not the placeholder loop's: the viewer contains
   * whatever master it is handed and needs no telling.
   */
  aspect?: string
  /**
   * The shape of the *strip* frames, when they were recut to something other than
   * the film's own ratio. Defaults to `aspect`, which is the usual case: the files
   * in /projects/strips are delivered inside a 16:9 box, and a scope film sitting
   * letterboxed in that box has its bars cropped straight back off by being sized
   * to 2.39:1. Only a film whose strip is a genuine recompose — 4:3 picture
   * reframed to fill 16:9 — has to say so here.
   */
  stripAspect?: string
  /** Exactly four landscape frames off /public/projects/strips, in cut order. */
  frames: ProjectFrame[]
  /** One line, the way a festival catalogue would carry it. */
  logline?: string
  synopsis?: string
  /** Selections and wins together, in the order they should be read. */
  festivals?: ProjectFestival[]
  video?: ProjectVideo
  markers?: ProjectMarker[]
  materials?: ProjectMaterials
  technical?: ProjectSpec[]
  credits?: ProjectCredits
}

const FRAMES_PER_STRIP = 4

/** What a project is assumed to be shaped like when it doesn't say. */
export const WIDESCREEN = "16 / 9"

/**
 * Video files live on Cloudflare R2 (see scripts/README.md); only the small
 * poster JPGs stay in git under /public/showcase. Same arrangement as the
 * showcase — NEXT_PUBLIC_MEDIA_BASE unset falls back to the on-disk copies.
 */
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE ?? ""

const master = (key: string) => `${MEDIA_BASE}/${key}`

/**
 * /public/projects/strips/<prefix>-1.<ext> … -4.<ext> — the strip on /projects.
 *
 * The extension is per project rather than fixed: the folder is mostly webp, with
 * a couple of projects still delivered as jpg.
 */
const frames = (prefix: string, title: string, ext: "webp" | "jpg" = "webp"): ProjectFrame[] =>
  Array.from({ length: FRAMES_PER_STRIP }, (_, index) => ({
    src: `/projects/strips/${prefix}-${index + 1}.${ext}`,
    alt: `${title} — frame ${index + 1} of ${FRAMES_PER_STRIP}`
  }))

/**
 * A strip built out of the contact-sheet stills, for a project whose strip cuts
 * haven't been delivered yet. Heavier than the real thing over the wire — the
 * point of the strips folder is that it isn't this — so it is a stopgap, and
 * every project using it should stop using it.
 */
const framesFromStills = (prefix: string, title: string): ProjectFrame[] =>
  Array.from({ length: FRAMES_PER_STRIP }, (_, index) => ({
    src: `/projects/stills/${prefix}-${index + 1}.jpg`,
    alt: `${title} — frame ${index + 1} of ${FRAMES_PER_STRIP}`
  }))

/**
 * The contact sheet, which can run longer than the strip: one still per entry in
 * `times`, so a project with six frames on disk gets six by asking for six times.
 * `times` is sparse on purpose — a still with no timecode is written `undefined`
 * rather than left out, since the array's length is the number of stills.
 */
const stills = (prefix: string, title: string, times: (number | undefined)[] = []): ProjectStill[] =>
  times.map((time, index) => ({
    src: `/projects/stills/${prefix}-${index + 1}.jpg`,
    alt: `${title} — frame ${index + 1} of ${times.length}`,
    time
  }))

/**
 * Swatches written as [hex, name] pairs, which keeps a nine-colour palette to
 * nine lines. Order is the author's — the panel lays them out exactly as given,
 * so a delivered palette can arrange itself however it wants to be read.
 *
 * These were sampled off each project's own strip frames (median cut, then the
 * nine most separated) and named for what they are in the picture. Real palettes
 * replace them wholesale.
 */
const palette = (note: string, entries: [string, string][]): ProjectPalette => ({
  note,
  swatches: entries.map(([hex, name]) => ({ hex, name }))
})

export const projects: Project[] = [
  {
    slug: "hum",
    title: "HUM ",
    year: 2021,
    type: "Short Music Film",
    runtime: "03:46 min",
    director: "Oleksandr Korotun",
    frames: frames("hum", "Hum"),
    logline: "The ultimate act of escapism — is to vanish into your own silence.",
    synopsis: `A visual adaptation of "Ballad of the Escape" by Vasyl Symonenko. Layering poetic Ukrainian voiceover, atmospheric sound design, and subtle imagery, the video portrays a human attempt to flee joy, pain, and the self—a quiet meditation on identity, loss, and the cost of emotional detachment from inner self.`,
    festivals: [{ name: "CYCLOP Video Poetry Festival", year: 2021, note: "International Competition" }],
    video: {
      src: master("edits/hum.mp4"),
      poster: "/showcase/hum-cover.jpg",
      duration: 226,
      aspectRatio: "16:9"
    },
    markers: [
      { time: 8, label: "Opening" },
      { time: 30, label: "First verse" },
      { time: 97, label: "Rupture" },
      { time: 176, label: "Dissolve" },
      { time: 207, label: "Resolution" }
    ],
    materials: {
      stills: stills("hum", "Hum", [40, 63, 118, 195]),
      palette: palette(
        "Wet earth, cool foliage, and overcast light. Warmth is hesitant to appear anywhere except human skin.",
        [
          ["#090F0D", "Black"],
          ["#1F3505", "Deep grass"],
          ["#274502", "Grass"],
          ["#97866F", "Skin"],
          ["#506758", "Moss"],
          ["#B0C6D2", "Overcast"],
          ["#7f9394", "Haze"],
          ["#a8bdb7", "Sage"],
          ["#AEC9BE", "Mint"]
        ]
      ),
      grades: [
        {
          shot: "SH 04",
          before: "/projects/grades/hum-01-ungraded.jpg",
          after: "/projects/grades/hum-01-graded.jpg",
          alt: "Project Title — shot 04, woman standing outdoors by a lake in soft overcast daylight",
          note: "Lifted the black point in dark coat to maintain detail and match the washed-out, dreamy feel of the backlit water.",
          time: 3,
        },
        {
          shot: "SH 05",
          before: "/projects/grades/hum-02-ungraded.jpg",
          after: "/projects/grades/hum-02-graded.jpg",
          alt: "Project Title — shot 05, profile shot of two women standing outdoors under cloudy skies",
          note: "Pushed the sky toward a muted pastel green-cyan cast to give the overcast clouds depth while keeping the black clothing dense and rich.",
          time: 12,
        },
        {
          shot: "SH 09",
          before: "/projects/grades/hum-03-ungraded.jpg",
          after: "/projects/grades/hum-03-graded.jpg",
          alt: "Project Title — shot 09, dynamic low-angle shot of two dancers reaching for each other outdoors under trees",
          note: "Pushed the sky and background foliage into a cool sage-cyan wash to match the kinetic tension while keeping skin tones natural on the key highlights.",
          time: 22.5,
        },
        {
          shot: "SH 14",
          before: "/projects/grades/hum-04-ungraded.jpg",
          after: "/projects/grades/hum-04-graded.jpg",
          alt: "Project Title — shot 14, close-up profile of a woman adjusting wet hair outdoors in the rain",
          note: "Maintained smooth highlight roll-off along the wet skin and arms under heavy backlighting, letting rain streaks pop against the dark canopy backdrop.",
          time: 43,
        },

        {
          shot: "SH 21",
          before: "/projects/grades/hum-05-ungraded.jpg",
          after: "/projects/grades/hum-05-graded.jpg",
          alt: "Project Title — shot 21, high-angle view of two figures sitting on rocky shoreline looking out at water",
          note: "Pushed the water ripples into a warm olive-sage hue while keeping the dark silhouettes softly lifted to match the atmospheric haze.",
          time: 64,
        },

        {
          shot: "SH 33",
          before: "/projects/grades/hum-06-ungraded.jpg",
          after: "/projects/grades/hum-06-graded.jpg",
          alt: "Project Title — shot 33, character looking back against a vast, dark field under evening skies",
          note: "Maintained a smooth tonal transition between the overcast sky and dark horizon, letting the subtle highlight draw a full focus.",
          time: 92,
        }

      ]
    },
    technical: [
      { label: "Camera", value: "Sony A7S3" },
      { label: "Lenses", value: "Jupiter" },
      { label: "Format", value: "XAVC-S 4K" },
      { label: "Aspect Ratio", value: "1.77:1" },
      { label: "Color", value: "HLG 2020" },
      { label: "Editing System", value: "DaVinci Resolve Studio" },
      { label: "Delivery", value: "H.264 · 1080p 24fps" }
    ],
    credits: {
      cast: [
        { name: "Iryna Tychyna", character: "Woman" },
        { name: "Solomiia Kyrylova", character: "Alter Ego" }
      ],
      crew: [
        { role: "Director / DoP", name: "Oleksandr Korotun" },
        { role: "Editor / Color", name: "Oleksandr Korotun" },
        { role: "Compositor", name: "Maryana Klochko" },
        { role: "Producers", name: "Max Prodaniuk, Iryna Tychyna" }
      ]
    }
  },
  {
    slug: "212-heroes",
    title: "212 HEROES",
    year: 2021,
    type: "Commercial",
    runtime: "1:29 min",
    director: "Oleksandr Korotun",
    // Shot 1440x1080 — the one project here that isn't widescreen. Its strip was
    // reframed to fill 16:9, so the 4:3 only shows up on the project page.
    aspect: "4 / 3",
    stripAspect: WIDESCREEN,
    frames: frames("212", "212 Heroes"),
    logline: "Ups and downs on Kyiv hills.",
    synopsis:
      "Shot across one city over several days and cut to run the light down with it — daylight, dusk, sodium. The grade is doing most of the work of holding that as one journey rather than four urelated locations.",
    video: {
      src: master("edits/212.mp4"),
      poster: "/showcase/212-cover.jpg",
      duration: 88,
      aspectRatio: "4:3"
    },
    markers: [
      { time: 7, label: "Opening" },
      { time: 23, label: "Street" },
      { time: 54, label: "Speed" },
      { time: 75, label: "Night" }
    ],
    materials: {
      stills: stills("212", "212 Heroes", [10.5, 24, 31, 62.8, 67.7, 76]),
      palette: palette(
        "The film runs the light down: concrete daylight, an indigo hour, then sodium. The lilac is the only colour that belongs to none of the three, which is why the dusk shots carry it.",
        [
          ["#2B3843", "Asphalt"],
          ["#2D1D53", "Indigo"],
          ["#404E78", "Dusk"],
          ["#C7A10A", "Sodium"],
          ["#6D9EAF", "Steel"],
          ["#917ECF", "Lilac"],
          ["#9DAFAE", "Concrete"],
          ["#B5D5D8", "Daylight"],
          ["#E7E9E3", "Highlight"]
        ]
      ),
      grades: [
        {
          shot: "SH 02",
          before: "/projects/grades/212-01-ungraded.jpg",
          after: "/projects/grades/212-01-graded.jpg",
          alt: "212 Heroes — shot 02, street in daylight",
          note: "Low sun daylight. The grade introduces indigo tones to a shadows, the spice that we mix our daytime with.",
          time: 6,
          simulated: false
        },
        {
          shot: "SH 07",
          before: "/projects/grades/212-02-ungraded.jpg",
          after: "/projects/grades/212-02-graded.jpg",
          alt: "212 Heroes — shot 07, low angle against a concrete facade",
          note: "Concrete turns blue here. We make sure white board is only pure thing in a frame.",
          time: 12,
          simulated: false
        },
        {
          shot: "SH 11",
          before: "/projects/grades/212-03-ungraded.jpg",
          after: "/projects/grades/212-03-graded.jpg",
          alt: "212 Heroes — shot 11, aerial of the road",
          note: "Pushed greens. We make sure shadows has some blue to establish contrast.",
          time: 15,
          simulated: false
        },
        {
          shot: "SH 14",
          before: "/projects/grades/212-04-ungraded.jpg",
          after: "/projects/grades/212-04-graded.jpg",
          alt: "212 Heroes — shot 14, traffic light",
          note: "Full throttle. Purple haze moment, everything tilting towards indigo, but we start to let the yellow lights in.",
          time: 21,
          simulated: false
        },
        {
          shot: "SH 19",
          before: "/projects/grades/212-05-ungraded.jpg",
          after: "/projects/grades/212-05-graded.jpg",
          alt: "212 Heroes — shot 19, motion blur at dusk",
          note: "Magenta dusk, carried into the blur rather than corrected out of it.",
          time: 27,
          simulated: false
        },
        {
          shot: "SH 26",
          before: "/projects/grades/212-06-ungraded.jpg",
          after: "/projects/grades/212-06-graded.jpg",
          alt: "212 Heroes — shot 26, sodium-lit street at night",
          note: "Sodium left as sodium. We hue it more complementary, but every attempt at white balance made it look off.",
          time: 36,
          simulated: false
        }
      ],
      notes: [
        { time: 15, text: "The descent is the hinge. Before it the film is a place; after it, it is a route." },
        { text: "Cut to the light, not to the music. The track was laid in last." }
      ]
    },
    technical: [
      { label: "Camera", value: "Sony A7S3" },
      { label: "Lenses", value: "Zeiss Zf" },
      { label: "Format", value: "XAVC-S 4K" },
      { label: "Aspect Ratio", value: "1.33:1" },
      { label: "Color", value: "HLG 2020" },
      { label: "Delivery", value: "1080p · H.264" }
    ],
    credits: {
      crew: [
        { role: "Director / DoP", name: "Oleksandr Korotun" },
        { role: "Editor / Colorist", name: "Oleksandr Korotun" },
        { role: "Client", name: "Carolina Herrera" }
      ]
    }
  },
  {
    slug: "blind-as-a-bat",
    title: "BLIND AS A BAT",
    year: 2018,
    type: "Music Video",
    runtime: "04:40 min",
    director: "Oleksandr Korotun",

    frames: frames("blind-as-a-bat", "Blind As A Bat"),
    logline: "Wandering in nomans land, just before the storm.",
    synopsis:
      "This music video came about during cold winter in Mariupol, while having days off on feature film shoot. We had a song, a character, a camera, and location most importantly.",
    video: {
      src: master("edits/blb.mp4"),
      poster: "/showcase/blb-cover.jpg",
      duration: 280,
      aspectRatio: "2.39:1"
    },
    markers: [
      { time: 5, label: "Cold open" },
      { time: 58, label: "Chorus" },
      { time: 180, label: "Bridge" },
      { time: 248, label: "Fade" }
    ],
    materials: {
      palette: palette(
        "A cold coast in winter. One teal carries the sea and the sky both, and the bark is the only warm thing in the film.",
        [
          ["#070c0e", "Black"],
          ["#1e252a", "Shadow"],
          ["#374147", "Slate"],
          ["#1e5265", "Sea"],
          ["#3d5e6e", "Teal"],
          ["#5b5959", "Bark"],
          ["#67747d", "Overcast"],
          ["#969ba1", "Sand"],
          ["#b3bfc3", "Sky"]
        ]
      ),
      grades: [
        {
          shot: "SH 01",
          before: "/projects/grades/blb-01.jpg",
          after: "/projects/grades/blb-01.jpg",
          alt: "Blind As A Bat — shot 01, over-the-shoulder view of character looking at the sea behind winter trees",
          note: "Pushed the sky towards neutral cool to let the deep blue of the sea carry the weight, keeping the dry grass in warm amber for balance.",
          time: 5,
          simulated: true
        },
        {
          shot: "SH 07",
          before: "/projects/grades/blb-02.jpg",
          after: "/projects/grades/blb-02.jpg",
          alt: "Blind As A Bat — shot 07, wide shot of an industrial footbridge beside bare trees",
          note: "Desaturated the cyan cast in the flat overcast sky to anchor the shot in a colder, industrial gray palette without losing the warm rust on the metal structures.",
          time: 18,
          simulated: true
        },
        {
          shot: "SH 11",
          before: "/projects/grades/blb-03.jpg",
          after: "/projects/grades/blb-03.jpg",
          alt: "Blind As A Bat — shot 011, low-angle view looking up into pale tree branches against a overcast sky",
          note: "Leaned into a subtle cyan-blue tint across the highlights to keep the white cool, while preserving midtone definition along the smooth branches.",
          time: 33,
          simulated: true
        },
        {
          shot: "SH 12",
          before: "/projects/grades/blb-04.jpg",
          after: "/projects/grades/blb-04.jpg",
          alt: "Blind As A Bat — shot 12, over-the-shoulder view of a quiet industrial coastline",
          note: "Muted saturation in the sky and sea to yield a cohesive zinc-grey backdrop, letting the blurred foreground silhouette set the depth.",
          simulated: true,
          time: 47,
        }
        , {
          shot: "SH 15",
          before: "/projects/grades/blb-05.jpg",
          after: "/projects/grades/blb-05.jpg",
          alt: "Blind As A Bat — shot 15, close-up profile of a man against a soft overcast background",
          note: "Kept skin tones natural under flat diffused sky light, balancing subtle warmth on the cheek while maintaining the overall cool atmosphere.",
          time: 92,
          simulated: true
        }, {
          shot: "SH 23",
          before: "/projects/grades/blb-06.jpg",
          after: "/projects/grades/blb-06.jpg",
          alt: "Blind As A Bat — shot 07A, dark silhouette framed low against a vast overcast blue sky",
          note: "Graded for a cold dusk feel, pulling down exposure in the sky just enough to reveal high-cloud texture while anchoring the head in absolute black.",
          time: 127,
          simulated: true
        }
      ],
    },
    technical: [
      { label: "Camera", value: "Arri Alexa Mini" },
      { label: "Lenses", value: "Zeiss Ultra Primes" },
      { label: "Format", value: "ProRes 4444" },
      { label: "Aspect Ratio", value: "2.40 : 1" },
      { label: "Color", value: "Rec.709" },
      { label: "Editing System", value: "Final Cut Pro" }
    ],
    credits: {
      crew: [
        { role: "Director / DoP", name: "Oleksandr Korotun" },
        { role: "Editor / Color", name: "Oleksandr Korotun" },
        { role: "Producer", name: "Valentyn Vasyanovych" },
        { role: "1st AD", name: "Tetyana Symon" },
      ],
      cast: [{ character: "Wandering Man ", name: "Serhiy Stepansky" }]
    }
  },
  {
    slug: "icehole",
    title: "ICEHOLE",
    year: 2026,
    type: "Short Film",
    runtime: "14 min",
    director: "Anastasia Grüba",
    frames: frames("icehole", "Icehole", "jpg"),
    logline: "A woman cuts a hole in the ice every morning. One morning she doesn't come back up.",
    synopsis:
      "Assembled long and then cut down over four passes. The festival cut and the black-and-white version are both delivered from the same conform; the trailer was built separately from the same bins.",
    festivals: [{ name: "Berlinale Shorts", note: "In Competition" }],
    video: {
      src: master("loops/icehole.mp4"),
      poster: "/showcase/icehole-cover.jpg",
      duration: 51,
      aspectRatio: "16:9"
    },
    markers: [
      { time: 6, label: "Ice" },
      { time: 19, label: "Scene 04" },
      { time: 31, label: "Silence" },
      { time: 44, label: "Final sequence" }
    ],
    materials: {
      palette: palette(
        "Eight greys and one coat. The whole grade is arranged so that the yellow is the only thing in the film you can find at a distance.",
        [
          ["#1c2225", "Water"],
          ["#363c3d", "Ice shadow"],
          ["#4d5451", "Treeline"],
          ["#7f6e57", "Coat"],
          ["#67767a", "Slush"],
          ["#7f8d90", "Cold grey"],
          ["#a8b7bf", "Ice"],
          ["#c7ced1", "Snow"],
          ["#e3e6e5", "Whiteout"]
        ]
      ),
      // The trailer points at a different loop so switching versions is visibly a
      // switch. Black & White is the same master under a display treatment until
      // a graded one exists.
      versions: [
        {
          id: "final",
          name: "Final Cut",
          src: master("loops/icehole.mp4"),
          poster: "/showcase/icehole-cover.jpg",
          duration: 51,
          note: "Delivery master. 14 min."
        },
        {
          id: "bw",
          name: "Black & White",
          src: master("loops/icehole.mp4"),
          poster: "/showcase/icehole-cover.jpg",
          duration: 51,
          treatment: "monochrome",
          note: "Alternate grade, same conform."
        },
        {
          id: "trailer",
          name: "Trailer",
          src: master("loops/pavo-indus.mp4"),
          poster: "/showcase/pavo-indus-cover.jpg",
          duration: 34,
          note: "Festival trailer, cut from the same bins."
        }
      ],
      stills: stills("icehole", "Icehole", [6, undefined, 31, 44]),
      notes: [
        { time: 19, text: "Scene 04 ran ninety seconds in the assembly. Everything after the second look is gone." },
        { time: 31, text: "The silence is not a hole in the track — it is the room, recorded and laid in." },
        { text: "Four passes. The third one is where it stopped being a sequence of events." }
      ]
    },
    technical: [
      { label: "Camera", value: "ARRI Alexa Mini" },
      { label: "Lenses", value: "Zeiss Super Speeds" },
      { label: "Format", value: "ARRIRAW 3.4K" },
      { label: "Aspect Ratio", value: "1.85:1" },
      { label: "Color", value: "DCI-P3" },
      { label: "Resolution", value: "4K" },
      { label: "Sound", value: "5.1" },
      { label: "Delivery", value: "DCP 24fps · ProRes 4444 XQ" }
    ],
    credits: {
      cast: [
        { name: "Olesia Usata", character: "Khrystia" },
        { name: "Serhiy Smiyan", character: "Semen" },
      ],
      crew: [
        { role: "Director", name: "Anastasiya Gruba" },
        { role: "Director of Photography", name: "Oleksandr Korotun" },
        { role: "Editor", name: "Nikodem Chabior" },
        { role: "Sound Design", name: "Mykhailo Zakytskyi" },
        { role: "Color", name: "Volodymyr Morozov" },
      ]
    }
  },
  {
    slug: "pavo-indus",
    title: "PAVO INDUS",
    year: 2019,
    type: "Music Video",
    runtime: "9:16 min",
    director: "Max Prodaniuk",
    // Scope, and the strip files carry the letterbox baked in — sizing the frames
    // to 2.84:1 crops those bars off rather than drawing them twice. That is the
    // measured ratio of the picture inside both the master and the delivered
    // frames; 2.39 left a black band standing on either edge.
    aspect: "2.84 / 1",
    frames: frames("pavo", "Pavo Indus"),
    logline: "A hunter walks up into weather that has already closed behind him.",
    synopsis:
      "Shot black-and-white over two days on a ridge in the Carpathians, in snow that never let up long enough to be waited out. Cut to the track rather than to the walk: the film keeps arriving at the same treeline, and the only thing that changes is how much of it you can still see.",
    video: {
      src: master("edits/pavo-indus.mp4"),
      poster: "/showcase/pavo-indus-cover.jpg",
      duration: 555,
      aspectRatio: "2.39:1"
    },
    markers: [
      { time: 2, label: "Ridge" },
      { time: 11, label: "Treeline" },
      { time: 21, label: "The shot" },
      { time: 29, label: "Whiteout" }
    ],
    materials: {
      palette: palette(
        "Nine greys and no colour at all. The film tops out around 70% — nothing in it is ever white, which is what makes the snow read as weather rather than as light.",
        [
          ["#050505", "Black"],
          ["#191919", "Treeline"],
          ["#262626", "Spruce"],
          ["#2f2f2f", "Slope"],
          ["#3c3c3c", "Shadow"],
          ["#4f4f4f", "Fog"],
          ["#666666", "Mist"],
          ["#8f8f8f", "Haze"],
          ["#b9b9b9", "Snow"]
        ]
      ),
      notes: [
        { time: 11, text: "The treeline comes back four times. It is the same treeline; only the visibility is cut." },
        { text: "Graded mono on the day one, which meant the second day had to be lit for a picture nobody could see." }
      ]
    },
    technical: [
      { label: "Camera", value: "Black Magic Cinema Camera" },
      { label: "Lenses", value: "ISCORAMA-34" },
      { label: "Format", value: "BRAW" },
      { label: "Aspect Ratio", value: "2.39:1" },
      { label: "Delivery", value: "ProRes 422 · 25fps" }
    ],
    credits: {
      crew: [
        { role: "Director", name: "Max Prodaniuk" },
        { role: "Director of Photography", name: "Oleksandr Korotun" },
        { role: "Editor", name: "Max Prodaniuk" },
        { role: "Color", name: "Max Prodaniuk, Oleksandr Korotun" },
      ]
    }
  },
  {
    slug: "leopolis-night",
    title: "LEOPOLIS NIGHT",
    year: 2021,
    type: "Short Film",
    runtime: "20 min",
    director: "Nikon Rōmanchenko",
    // TODO: no strip cuts delivered yet — falling back to the full-size stills.
    frames: frames("leopolis", "Leopolis Night"),
    logline: "Lviv between the last tram and the first one.",
    synopsis:
      "Shot over five nights in a 4:3 frame and cut to the length of the walk itself. The boards were drawn as a route rather than as shots, which is why so few of them survive the edit in order.",
    festivals: [
      { name: "Odesa International Film Festival", year: 2021, award: "Golden Duke — Best Director" },
      {
        name: "Molodist Kyiv International Film Festival",
        year: 2022,
        award: "Scythian Deer — Best Short Film",
        note: "National Competition"
      },
      { name: "Ivano-Frankivsk International Short Film Festival 4:3", year: 2021, award: "Jury Prize — Best Film" },
      { name: "Ukrainian Film Academy Awards", year: 2023, note: "Nominee — Golden Dzyga, Best Short Fiction Film" },
      { name: `Ukrainian Film Critics Awards "Kinokolo"`, year: 2021, note: "Nominee — Best Short Fiction Film" },
      { name: "Filmfest Hamburg", year: 2022, note: "Molodist National Competition" },
      { name: "Festival REGARD", year: 2022, note: "Québec — Best of Ukraine" }
    ],
    video: {
      src: master("loops/leopolis.mp4"),
      poster: "/showcase/leopolis-cover.jpg",
      duration: 49,
      aspectRatio: "4:3"
    },
    markers: [
      { time: 4, label: "Night exterior" },
      { time: 16, label: "Scene 02" },
      { time: 29, label: "The tram" },
      { time: 41, label: "Last look" }
    ],
    materials: {
      stills: stills("leopolis", "Leopolis Night", [4, 16, 29, 41]),
      palette: palette(
        "No hue survived the grade. What is left is a ladder of stone and lamplight, and the film asks you to read it as tone rather than colour.",
        [
          ["#0b0b0b", "Black"],
          ["#343333", "Shadow"],
          ["#565552", "Stone"],
          ["#6c6a67", "Pavement"],
          ["#82817e", "Midtone"],
          ["#b0afac", "Skin"],
          ["#cecdcb", "Lamplight"],
          ["#e4e3e2", "Highlight"],
          ["#fdfcfb", "Practical"]
        ]
      ),
      storyboard: [
        {
          shot: "SH 02",
          final: "/projects/stills/leopolis-2.jpg",
          alt: "Leopolis Night — shot 02",
          note: "Drawn as the second street. Shot as the fourth.",
          time: 16
        },
        {
          shot: "SH 07A",
          final: "/projects/stills/leopolis-3.jpg",
          alt: "Leopolis Night — shot 07A",
          note: "The tram was boarded arriving. It leaves.",
          time: 29
        }
      ],
      notes: [{ text: "Cut to the length of the walk. Anything that moved faster than walking pace came out." }]
    },
    technical: [
      { label: "Camera", value: "Sony A7S3" },
      { label: "Lenses", value: "Nikkor Ai" },
      { label: "Format", value: "XAVC-S HD" },
      { label: "Aspect Ratio", value: "1.33:1" },
      { label: "Color", value: "HLG" },
      { label: "Editing System", value: "Adobe Premiere Pro" }
    ],
    credits: {
      cast: [
        { name: "Olha-Anna Kapustiak" },
        { name: "Solomiia Kyrylova" },
        { name: "Mariia Kmit" },
        { name: "Nikon Romanchenko" }
      ],
      crew: [
        { role: "Director", name: "Nikon Romanchenko" },
        { role: "Director of Photography", name: "Oleksandr Korotun" },
        { role: "Editor", name: "Nikon Romanchenko" },
        { role: "Sound", name: "Mykhailo Zakutskiy" },
        { role: "Producer", name: "Kateryna Gornostai" }
      ]
    }
  },
  {
    slug: "papr",
    title: "PAPERUSHKA",
    year: 2020,
    type: "Short Film",
    runtime: "21 min",
    director: "Lilia Ostapovyčh",
    frames: frames("papr", "Paperushka"),
    logline: "A girl carries a paper doll up a mountain that has already been left.",
    synopsis:
      "Three cuts exist. The festival cut is eleven minutes shorter and loses the second descent entirely; the black-and-white version was made for a single screening and then kept.",
    festivals: [
      { name: "KINOKO – Short Film Competition", year: 2021, award: "Best Cinematography" },
      { name: "Molodist Kyiv International Film Festival", year: 2021, award: "Special Mention", note: "National Competition" },
      { name: "Batumi International Art-House Film Festival", year: 2021, note: "International Short Film Competition" },
      { name: "BRUKIVKA International Film Festival", year: 2021, note: "National Short Film Competition" },
      { name: "Bouquet Kyiv Stage", year: 2021, note: "30 Years of Ukrainian Cinema" },
      { name: "Bardak VII Short Film Festival", year: 2023, note: "Contemporary Ukrainian Cinema" }
    ],
    video: {
      src: master("loops/papr.mp4"),
      poster: "/showcase/papr-cover.jpg",
      duration: 99,
      aspectRatio: "16:9"
    },
    markers: [
      { time: 8, label: "Opening" },
      { time: 27, label: "Scene 04" },
      { time: 52, label: "Silence" },
      { time: 78, label: "Final sequence" }
    ],
    materials: {
      palette: palette(
        "Blue hour held past the point where it was still there, and pushed further in the grade. The pine is the only green the film keeps.",
        [
          ["#0d1318", "Black"],
          ["#102138", "Night"],
          ["#103160", "Deep blue"],
          ["#123c45", "Petrol"],
          ["#183e30", "Pine"],
          ["#1a4b56", "Teal"],
          ["#1a5482", "Blue hour"],
          ["#256c8c", "Water"],
          ["#30869f", "Sky"]
        ]
      ),
      versions: [
        {
          id: "final",
          name: "Final Cut",
          src: master("loops/papr.mp4"),
          poster: "/showcase/papr-cover.jpg",
          duration: 99,
          note: "Delivery master. 21 min."
        },
        {
          id: "festival",
          name: "Festival Cut",
          src: master("loops/leopolis.mp4"),
          poster: "/showcase/leopolis-cover.jpg",
          duration: 49,
          note: "Shortened for competition. Loses the second descent."
        },
        {
          id: "bw",
          name: "Black & White",
          src: master("loops/papr.mp4"),
          poster: "/showcase/papr-cover.jpg",
          duration: 99,
          treatment: "monochrome",
          note: "Made for one screening. Kept."
        }
      ],
      storyboard: [
        {
          shot: "SH 01A",
          final: "/projects/stills/blind-as-a-bat-1.jpg",
          alt: "Blind As A Bat — shot 01A",
          note: "Boarded as a push-in. Shot handheld; the push became a drift.",
          time: 5
        },
        {
          shot: "SH 04C",
          final: "/projects/stills/blind-as-a-bat-2.jpg",
          alt: "Blind As A Bat — shot 04C",
          note: "The only board that survived the edit intact.",
          time: 18
        },
        {
          shot: "SH 09",
          final: "/projects/stills/blind-as-a-bat-3.jpg",
          alt: "Blind As A Bat — shot 09",
          note: "Boarded wide, cut in tight — the wide plays under the chorus instead.",
          time: 33
        },
        {
          shot: "SH 12B",
          final: "/projects/stills/blind-as-a-bat-4.jpg",
          alt: "Blind As A Bat — shot 12B",
          note: "Added on the day. No board exists for it.",
          time: 47
        }
      ],
      notes: [
        { time: 27, text: "Scene 04 is the only place where the two cuts agree frame for frame." },
        { time: 52, text: "Held eleven seconds longer than anyone was comfortable with. It stayed." },
        { text: "The festival cut is not a trim of the final cut. It was assembled again from the rushes." }
      ]
    },
    technical: [
      { label: "Camera", value: "ARRI Alexa Mini" },
      { label: "Lenses", value: "Zeiss Super Speeds" },
      { label: "Format", value: "ARRIRAW 2.8K" },
      { label: "Aspect Ratio", value: "2:1" },
      { label: "Color", value: "Rec.709" },
      { label: "Editing System", value: "Adobe Premiere Pro" },
      { label: "Delivery", value: "DCP 24fps" }
    ],
    credits: {
      cast: [
        { name: "Olena Bohdan", character: "Iva" },
        { name: "Oleksandr Zhyla", character: "Borys" },
        { name: "Vadym Tambovtsev", character: "Mytiay" },
        { name: "Oleh Davydov", character: "Borys Friend" },
        { name: "Kateryna Lyapina", character: "Mother" },
        { name: "Oleh Loniankivskiy", character: "Father" },
        { name: "Maria Makara", character: "Grandmother" },
        { name: "Orest Chemerys", character: "Delivery Driver" },
      ],
      crew: [
        { role: "Director", name: "Lilia Ostapovyčh" },
        { role: "Cinematographer", name: "Oleksandr Korotun" },
        { role: "Editor", name: "Yuri Pidtserkovniy" },
        { role: "Sound", name: "Oleg Goloveshkin" },
        { role: "Color", name: "Maryna Tkachenko" },
        { role: "Producer", name: "Valeria Sochyvets, Taras Dron" }
      ]
    }
  }
]

export const getProject = (slug: string) => projects.find((project) => project.slug === slug)
