/**
 * Projects: the strips on /projects, and the archive on /projects/[slug].
 *
 * The shape is deliberately flat — a CMS will fill these fields verbatim later,
 * including `frames`, where each entry carries its own `src` and `alt`.
 *
 * Everything here is placeholder. The stills in /public/projects/stills were cut
 * from the showcase loops (letterboxing removed, 720x405) purely so the strips
 * have real frames to hold; the titles and credits are invented. The alt text
 * says which frame it is rather than describing a picture that doesn't belong to
 * the project yet — real copy comes with the real stills.
 *
 * Everything past `frames` belongs to the project page and is mock in the same
 * way: the films are real, the records are not. `video` points at the showcase
 * loops on R2 because the finished films are not online — so a "cut" runs under
 * a minute and carries no audio track. Replacing those keys with the real
 * masters is the only change the page needs.
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
  character: string
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
  /** Exactly four landscape stills, in cut order. */
  frames: ProjectFrame[]
  /** One line, the way a festival catalogue would carry it. */
  logline?: string
  synopsis?: string
  festivals?: string[]
  video?: ProjectVideo
  markers?: ProjectMarker[]
  materials?: ProjectMaterials
  technical?: ProjectSpec[]
  credits?: ProjectCredits
}

const FRAMES_PER_STRIP = 4

/**
 * Video files live on Cloudflare R2 (see scripts/README.md); only the small
 * poster JPGs stay in git under /public/showcase. Same arrangement as the
 * showcase — NEXT_PUBLIC_MEDIA_BASE unset falls back to the on-disk copies.
 */
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE ?? ""

const master = (key: string) => `${MEDIA_BASE}/${key}`

/** /public/projects/stills/<prefix>-1.jpg … -4.jpg */
const frames = (prefix: string, title: string): ProjectFrame[] =>
  Array.from({ length: FRAMES_PER_STRIP }, (_, index) => ({
    src: `/projects/stills/${prefix}-${index + 1}.jpg`,
    alt: `${title} — frame ${index + 1} of ${FRAMES_PER_STRIP}`
  }))

/** The same four frames, read as a contact sheet. `times` is sparse on purpose. */
const stills = (prefix: string, title: string, times: (number | undefined)[] = []): ProjectStill[] =>
  frames(prefix, title).map((frame, index) => ({ ...frame, time: times[index] }))

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
    runtime: "03:45 min",
    director: "Oleksandr Korotun",
    frames: frames("hum", "Hum"),
    logline: "The ultimate act of escapism is vanishing into your own silence.",
    synopsis: `A visual adaptation of "Ballad of the Escape" by Vasyl Symonenko. Layering poetic Ukrainian voiceover, atmospheric sound design, and subtle imagery, the video portrays a human attempt to flee joy, pain, and the self—a quiet meditation on identity, loss, and the cost of emotional detachment from inner self.`,
    festivals: [`"CYCLOP" – International Videopoetry Competion (2021)`],
    video: {
      src: master("loops/hum.mp4"),
      poster: "/showcase/hum-cover.jpg",
      duration: 52,
      aspectRatio: "16:9"
    },
    markers: [
      { time: 3, label: "Opening" },
      { time: 14, label: "First verse" },
      { time: 27, label: "Break" },
      { time: 41, label: "Reprise" }
    ],
    materials: {
      stills: stills("hum", "Hum", [3, 12, 22.5, 43]),
      palette: palette(
        "Wet green and skin, under an overcast sky that fully opens just once. Nothing in the film is allowed to be warm except the people.",
        [
          ["#07080c", "Black"],
          ["#222d18", "Deep grass"],
          ["#364c2e", "Grass"],
          ["#705b50", "Skin"],
          ["#506758", "Moss"],
          ["#717973", "Overcast"],
          ["#7f9394", "Haze"],
          ["#a8bdb7", "Sage"],
          ["#cee3e5", "Sky"]
        ]
      )
    },
    technical: [
      { label: "Camera", value: "Sony A7SIII" },
      { label: "Lenses", value: "Zeiss Zf" },
      { label: "Format", value: "ARRIRAW 3.4K" },
      { label: "Aspect Ratio", value: "1.77:1" },
      { label: "Colour", value: "ACES" },
      { label: "Editing System", value: "DaVinci Resolve Studio" },
      { label: "Delivery", value: "ProRes 444 24fps" }
    ],
    credits: {
      cast: [
        { name: "Iryna Tychyna", character: "Woman" },
        { name: "Solomia Kyrylova", character: "Alter Ego" }
      ],
      crew: [
        { role: "Director / DoP", name: "Oleksandr Korotun" },
        { role: "Editor", name: "Oleksandr Korotun" },
        { role: "Compositor", name: "Maryana Klochko" },
        { role: "Designer", name: "Anna Vashulenko" },
        { role: "Producers", name: "Max Prodaniuk, Oleksandr Korotun" },

      ]
    }
  },
  {
    slug: "212-heroes",
    title: "212 HEROES",
    year: 2023,
    type: "Commercial",
    runtime: "1 min",
    director: "Oleksandr Korotun",
    frames: frames("212", "212 Heroes"),
    logline: "Kyiv from the last light to the first streetlamp, at skateboard height.",
    synopsis:
      "Shot across one city over several evenings and cut to run the light down with it — daylight, dusk, sodium. The grade is doing most of the work of holding that as one journey rather than four locations, which is why the plates are kept here shot by shot.",
    video: {
      src: master("loops/212.mp4"),
      poster: "/showcase/212-cover.jpg",
      duration: 45,
      aspectRatio: "4:3"
    },
    markers: [
      { time: 3, label: "Cold open" },
      { time: 15, label: "Descent" },
      { time: 27, label: "Speed" },
      { time: 38, label: "Night" }
    ],
    materials: {
      stills: stills("212", "212 Heroes", [3, 15, 27, 42, 46, 49]),
      palette: palette(
        "The film runs the light down: concrete daylight, an indigo hour, then sodium. The lilac is the only colour that belongs to none of the three, which is why the dusk shots carry it.",
        [
          ["#0a1313", "Asphalt"],
          ["#20145d", "Indigo"],
          ["#453d81", "Dusk"],
          ["#564515", "Sodium"],
          ["#637099", "Steel"],
          ["#a388c4", "Lilac"],
          ["#999896", "Concrete"],
          ["#b6b7a9", "Daylight"],
          ["#e0ded8", "Highlight"]
        ]
      ),
      // Six shots, one per lighting state the film passes through. `before` and
      // `after` point at the same frame for now and carry `simulated`; when the
      // ungraded plates are pulled, replace `before` and delete the flag.
      grades: [
        {
          shot: "SH 02",
          before: "/projects/grades/212-01.jpg",
          after: "/projects/grades/212-01.jpg",
          alt: "212 Heroes — shot 02, street in daylight",
          note: "Open-shade daylight. The grade warms the road and leaves the shirt where it is.",
          time: 6,
          simulated: true
        },
        {
          shot: "SH 07",
          before: "/projects/grades/212-02.jpg",
          after: "/projects/grades/212-02.jpg",
          alt: "212 Heroes — shot 07, low angle against a concrete facade",
          note: "Concrete wants to go green. Held neutral so the jacket stays the only blue in frame.",
          time: 12,
          simulated: true
        },
        {
          shot: "SH 11",
          before: "/projects/grades/212-03.jpg",
          after: "/projects/grades/212-03.jpg",
          alt: "212 Heroes — shot 11, aerial of the road",
          note: "Pushed cyan. The one shot in the film allowed to be cold.",
          time: 15,
          simulated: true
        },
        {
          shot: "SH 14",
          before: "/projects/grades/212-04.jpg",
          after: "/projects/grades/212-04.jpg",
          alt: "212 Heroes — shot 14, traffic light",
          note: "The green is a practical, not a grade. Everything around it came down to let it read.",
          time: 21,
          simulated: true
        },
        {
          shot: "SH 19",
          before: "/projects/grades/212-05.jpg",
          after: "/projects/grades/212-05.jpg",
          alt: "212 Heroes — shot 19, motion blur at dusk",
          note: "Magenta dusk, carried into the blur rather than corrected out of it.",
          time: 27,
          simulated: true
        },
        {
          shot: "SH 26",
          before: "/projects/grades/212-06.jpg",
          after: "/projects/grades/212-06.jpg",
          alt: "212 Heroes — shot 26, sodium-lit street at night",
          note: "Sodium left as sodium. Every attempt at white balance made it look like an office.",
          time: 36,
          simulated: true
        }
      ],
      notes: [
        { time: 15, text: "The descent is the hinge. Before it the film is a place; after it, it is a route." },
        { text: "Cut to the light, not to the music. The track was laid in last." }
      ]
    },
    technical: [
      { label: "Camera", value: "ARRI Alexa Mini LF" },
      { label: "Lenses", value: "Cooke Anamorphic/i" },
      { label: "Format", value: "ARRIRAW 4.5K" },
      { label: "Aspect Ratio", value: "1.33:1" },
      { label: "Colour", value: "Rec 2020" },
      { label: "Grade", value: "DaVinci Resolve Studio" },
      { label: "Editing System", value: "DaVinci Resolve Studio" },
      { label: "Delivery", value: "ProRes 4444 · H.264 social media cuts" }
    ],
    credits: {
      crew: [
        { role: "Director", name: "Oleksandr Korotun" },
        { role: "Director of Photography", name: "Oleksandr Korotun" },
        { role: "Editor", name: "Oleksandr Korotun" },
        { role: "Colourist", name: "Ihor Bondarenko" },
        { role: "Sound", name: "Yuliia Mazur" },
        { role: "Client", name: "Carolina Herrera" }
      ]
    }
  },
  {
    slug: "blind-as-a-bat",
    title: "BLIND AS A BAT",
    year: 2018,
    type: "Music Video",
    runtime: "5 min",
    director: "Oleksandr Korotun",
    frames: frames("blind-as-a-bat", "Blind As A Bat"),
    logline: "One continuous walk, cut so that it never quite continues.",
    synopsis:
      "Boarded shot for shot before the shoot, then rebuilt in the edit around the only take that had the right light. The boards are kept here next to the frames they became, because the difference between the two is most of what the film is.",
    video: {
      src: master("loops/blb.mp4"),
      poster: "/showcase/blb-cover.jpg",
      duration: 55,
      aspectRatio: "16:9"
    },
    markers: [
      { time: 5, label: "Cold open" },
      { time: 18, label: "Chorus" },
      { time: 33, label: "Match cut" },
      { time: 47, label: "Fade" }
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
      ]
    },
    technical: [
      { label: "Camera", value: "RED Epic Dragon" },
      { label: "Lenses", value: "Zeiss Super Speed MkIII" },
      { label: "Format", value: "REDCODE R3D 5K" },
      { label: "Aspect Ratio", value: "2.39:1" },
      { label: "Colour", value: "Rec.709" },
      { label: "Editing System", value: "Adobe Premiere Pro" }
    ],
    credits: {
      crew: [
        { role: "Director", name: "Oleksandr Korotun" },
        { role: "Director of Photography", name: "Oleksandr Korotun" },
        { role: "Editor", name: "Oleksandr Korotun" },
        { role: "Storyboards", name: "Kateryna Lysak" },
        { role: "Colour", name: "Ihor Bondarenko" }
      ]
    }
  },
  {
    slug: "icehole",
    title: "ICEHOLE",
    year: 2026,
    type: "Short Film",
    runtime: "14 min",
    director: "Anastasia Grüba",
    frames: frames("icehole", "Icehole"),
    logline: "A woman cuts a hole in the ice every morning. One morning she doesn't come back up.",
    synopsis:
      "Assembled long and then cut down over four passes. The festival cut and the black-and-white version are both delivered from the same conform; the trailer was built separately from the same bins.",
    festivals: ["Berlinale Shorts — in competition"],
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
      { label: "Camera", value: "ARRI Alexa 35" },
      { label: "Lenses", value: "Zeiss Supreme Prime" },
      { label: "Format", value: "ARRIRAW 4.6K" },
      { label: "Aspect Ratio", value: "1.66:1" },
      { label: "Colour", value: "ACEScct" },
      { label: "Resolution", value: "4.5K" },
      { label: "Editing System", value: "Avid Media Composer" },
      { label: "Sound", value: "5.1" },
      { label: "Delivery", value: "DCP 24fps · ProRes 4444 XQ" }
    ],
    credits: {
      cast: [
        { name: "Oksana Voitenko", character: "Halyna" },
        { name: "Danylo Kovalenko", character: "The Son" },
        { name: "Nina Prokopiv", character: "Neighbour" }
      ],
      crew: [
        { role: "Director", name: "Anastasia Grüba" },
        { role: "Director of Photography", name: "Oleksandr Korotun" },
        { role: "Editor", name: "Oleksandr Korotun" },
        { role: "Sound Design", name: "Yuliia Mazur" },
        { role: "Colour", name: "Ihor Bondarenko" },
        { role: "Producer", name: "Bosonfilm" }
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
    frames: frames("leopolis", "Leopolis Night"),
    logline: "Lviv between the last tram and the first one.",
    synopsis:
      "Shot over five nights in a 4:3 frame and cut to the length of the walk itself. The boards were drawn as a route rather than as shots, which is why so few of them survive the edit in order.",
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
      { label: "Camera", value: "ARRI Alexa Mini" },
      { label: "Lenses", value: "Lomo Round Front Anamorphic" },
      { label: "Format", value: "ProRes 4444 XQ" },
      { label: "Aspect Ratio", value: "1.33:1" },
      { label: "Colour", value: "Rec.709" },
      { label: "Editing System", value: "Final Cut Pro" }
    ],
    credits: {
      cast: [
        { name: "Andrii Sokil", character: "The Walker" },
        { name: "Iryna Chumak", character: "Woman at the Stop" }
      ],
      crew: [
        { role: "Director", name: "Nikon Rōmanchenko" },
        { role: "Director of Photography", name: "Oleksandr Korotun" },
        { role: "Editor", name: "Oleksandr Korotun" },
        { role: "Sound", name: "Taras Hnatiuk" },
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
    festivals: ["Molodist IFF — Grand Prix", "Clermont-Ferrand — Lab Competition"],
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
      notes: [
        { time: 27, text: "Scene 04 is the only place where the two cuts agree frame for frame." },
        { time: 52, text: "Held eleven seconds longer than anyone was comfortable with. It stayed." },
        { text: "The festival cut is not a trim of the final cut. It was assembled again from the rushes." }
      ]
    },
    technical: [
      { label: "Camera", value: "ARRI Amira" },
      { label: "Lenses", value: "Cooke S4" },
      { label: "Format", value: "ProRes 4444" },
      { label: "Aspect Ratio", value: "2.39:1" },
      { label: "Colour", value: "Rec.709" },
      { label: "Editing System", value: "Adobe Premiere Pro" },
      { label: "Delivery", value: "DCP 25fps" }
    ],
    credits: {
      cast: [
        { name: "Sofiia Marchenko", character: "Paperushka" },
        { name: "Halyna Rudenko", character: "Grandmother" }
      ],
      crew: [
        { role: "Director", name: "Lilia Ostapovyčh" },
        { role: "Director of Photography", name: "Oleksandr Korotun" },
        { role: "Editor", name: "Oleksandr Korotun" },
        { role: "Sound", name: "Taras Hnatiuk" },
        { role: "Colour", name: "Ihor Bondarenko" },
        { role: "Producer", name: "CUC" }
      ]
    }
  }
]

export const getProject = (slug: string) => projects.find((project) => project.slug === slug)
