import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Arrow } from "@/components/svg/arrow"
import { FilmGrain } from "@/components/film-grain"
import { RiExternalLinkLine } from "@remixicon/react"
import { cn } from "@/lib/utils"
import { addGradientHover } from "@/lib/helpers"
import profile from "@/data/profile"

type FilmFormat = "Short" | "Feature" | "TVS"

type Film = {
  period: string
  title: string
  country: string
  credits: string
  format: FilmFormat
  /** IMDb title id, e.g. "tt9455468" */
  imdb?: string
}

const experience: Film[] = [
  {
    period: "2026",
    title: "Good Thing Mom Doesn’t Know",
    country: "UA",
    credits: "dir. Sasha Lýtvýnenko, dop. Herman Shobukhov, prod. Eugene Lývýnenko",
    format: "Feature",
    imdb: "tt39389313"
  },
  {
    period: "2026",
    title: "Icehole",
    country: "UA",
    credits: "dir. Anastasia Grüba, dop. Oleksandr Korotun, prod. Bosonfilm",
    format: "Short"
  },
  {
    period: "2026",
    title: "Polly Trip",
    country: "UA",
    credits: "dir. Nazar Onufriv, dop. Oleksandr Korotun, prod. DIM",
    format: "Short"
  },
  {
    period: "2025",
    title: "Silent Flood",
    country: "UA | FR",
    credits: "dir. Dmytro Sukholytky-Sobchuk, dop. Oleksandr Korotun, I.Marorash, S.Tsvetkov prod. TABOR",
    format: "Feature",
    imdb: "tt38732117"
  },
  {
    period: "2025",
    title: "Goodbye Paris",
    country: "UA",
    credits: "dir/dop Oleksandr Korotun, prod. Blue Velvet Underground",
    format: "Short"
  },
  {
    period: "2025",
    title: "Animals in War",
    country: "UA | DE",
    credits: "dir. Sviatoslav Kostiuk, dop. Sashcko Roshchyn, prod. SOTA",
    format: "Feature",
    imdb: "tt38732117"
  },
  {
    period: "2024",
    title: "Crazy Neighbours",
    country: "UA",
    credits: "dir. Oleh Borshchevskyi, dop. Danyl Dedkøv, prod. FILM.UA",
    format: "TVS"
  },
  {
    period: "2024",
    title: "More Than a Fight",
    country: "UK",
    credits: "dir. Kevin Macdonald / Edgar Dubrovskiy, dop. Oleksandr Korotun /  Edgar Dubrobskiy",
    format: "Feature",
    imdb: "tt31451157"
  },
  {
    period: "2024",
    title: "Malevich",
    country: "UA",
    credits: "dir. Daria Onyshchenko, dop. Oleksandr Roshchyn, prod. Anna Palenchuk, 435 FILMS",
    format: "Feature",
    imdb: "tt27549741"
  },
  {
    period: "2024",
    title: "U Are the Universe",
    country: "UA",
    credits: "dir. Pavlo Ostrikov, dop. Nikita Kuzmenko, prod. Forefilms",
    format: "Feature",
    imdb: "tt19783734"
  },
  {
    period: "2023",
    title: "Those Who Stayed",
    country: "UA",
    credits: "showrun. Anastasiia Lodkina, dop. Sashcko Roshchyn, prod. NETFLIX",
    format: "TVS",
    imdb: "tt21627590"
  },
  {
    period: "2022",
    title: "Pamfir",
    country: "UA | FR",
    credits: "dir. Dmytro Sukholytkyy-Sobchuk, dop. Nikita Kuzmenko, prod. Bosonfilm",
    format: "Feature",
    imdb: "tt9455468"
  },

  {
    period: "2021",
    title: "Leopolis Night",
    country: "UA",
    credits: "dir. Nikon Romanchenko, dop. Oleksandr Korotun, prod. Kateryna Gornostai",
    format: "Short",
    imdb: "tt15100850"
  },
  {
    period: "2021",
    title: "Stop-Zemlia",
    country: "UA",
    credits: "dir. Kateryna Gornostai, dop. Oleksandr Roshchyn, prod. ESSE",
    format: "Feature",
    imdb: "tt14028890"
  },
  {
    period: "2020",
    title: "Paperushka",
    country: "UA",
    credits: "dir. Liliia Ostapovych, dop. Oleksandr Korotun, prod. CUC",
    format: "Short",
    imdb: "tt14638272"
  },
  {
    period: "2020",
    title: "Between Us",
    country: "UA",
    credits: "dir. Solomiia Tomashchuk, dop. Yurii Dunai, prod. UPUA Studio",
    format: "Feature",
    imdb: "tt15331466"
  },
  {
    period: "2020",
    title: "Numbers",
    country: "UA | POL",
    credits: "dir. Oleh Sentsov, Akhtem Seitablaiev, dop. Adam Sikora, prod. 435FILMS",
    format: "Feature",
    imdb: "tt11771626"
  },
  {
    period: "2019",
    title: "Atlantis",
    country: "UA",
    credits: "dir/dop Valentyn Vasyanovych, prod. Iya Myslytska, Volodymyr Yatsenko",
    format: "Feature",
    imdb: "tt10749786"
  },
  {
    period: "2019",
    title: "U311 Cherkasy",
    country: "UA",
    credits: "dir. Tymur Yashchenko, dop. Yuriy Dunay, prod. Marta Łotysz, Iryna Klymenko",
    format: "Feature",
    imdb: "tt8205656"
  },
  {
    period: "2019",
    title: "Intolerance",
    country: "UA",
    credits: "dir. Stanislav Bytiutskyi, dop. Vadim Ilkov",
    format: "Short",
    imdb: "tt13134692"
  },
  {
    period: "2019",
    title: "Three Months Before Winter",
    country: "UA",
    credits: "dir. Stas Gurenko, dop. Sasha Bojko",
    format: "Short"
  },
  {
    period: "2019",
    title: "140 Decibels of Silence",
    country: "UA",
    credits: "dir. Röman Synchuk, dop. Sashcko Roshchyn",
    format: "Short"
  },
  {
    period: "2019",
    title: "Eroïca",
    country: "UA",
    credits: "dir. Rōman Khimei, dop. Sashcko Roshchyn, prod. Radarfilm ",
    format: "Short"
  },
  {
    period: "2019",
    title: "99 Songs",
    country: "IND",
    credits: "dir. Vishwesh Krishnamoorthy, dop. Tanay Satam, prod. A. R. Rahman",
    format: "Feature",
    imdb: "tt7559180"
  },
  {
    period: "2019",
    title: "Gas Station",
    country: "UA",
    credits: "dir. Yuliia Hontaruk, dop. Sashcko Roshchyn, prod. Pronto Film",
    format: "Short"
  },
  {
    period: "2019",
    title: "Walk on Water",
    country: "UA",
    credits: "dir. Solomiia Tomashchuk, dop. Yurii Dunai, prod. Pronto Film",
    format: "Short"
  },
  { period: "2019", title: "Dzherya", country: "UA", credits: "dir. Iryna Pravylo, dop. Sashcko Roshchyn", format: "Short" },
  { period: "2019", title: "The Valley", country: "UA", credits: "dir. Zagoruiko Vitalii, dop. Serhiy Stefan", format: "Short" },
  {
    period: "2018",
    title: "Utopia",
    country: "AUT | UA",
    credits: "dir. Juri Rechinsky, dop. Sebastian Thaler, prod. Pronto Film",
    format: "Short"
  },
  {
    period: "2018",
    title: "DZIDZIO. First Time",
    country: "UA",
    credits: "dir. Taras Dron, dop. Oleksandr Roshchyn, prod. Anatolii Bezukh",
    format: "Feature",
    imdb: "tt8706874"
  },
  { period: "2018", title: "Heartbreaker", country: "UA", credits: "dop. Sasha Bojko", format: "Short" },

  {
    period: "2018",
    title: "Falling",
    country: "UA",
    credits: "dir. Maryna Stepanska, dop. Sebastian Thaler, prod. Katerina Lachena",
    format: "Feature",
    imdb: "tt6296278"
  },
  {
    period: "2018",
    title: "Stepne",
    country: "UA | DE",
    credits: "dir. Maryna Vroda, dop. Marco Müller, prod. Vrodastudio",
    format: "Feature",
    imdb: "tt28291829"
  },
  {
    period: "2018",
    title: "Crocodile",
    country: "UA",
    credits: "dir. Kateryna Gornostai, dop. Sashcko Roshchyn, prod. Viktoria Khomenko",
    format: "Short"
  },
  {
    period: "2018",
    title: "Julia Blue",
    country: "US | UA",
    credits: "dir. Roxy Toporowych, dop. Sashcko Roshchyn, prod. Nilou Safinya",
    format: "Feature",
    imdb: "tt6057574"
  },
  {
    period: "2018",
    title: "Weightlifter",
    country: "UA | POL",
    credits: "dir. Dmytro Sukholytkyy-Sobchuk, dop. Michał Rytel-Przełomiec, prod. Ewa Jastrzębska, Jerzy Kapuściński",
    format: "Short",
    imdb: "tt8768514"
  },
  {
    period: "2017",
    title: "Lilac",
    country: "UA",
    credits: "dir. Kateryna Gornostai, dop. Sashcko Roshchyn, prod. Yuiriy Minzyanov",
    format: "Short",
    imdb: "tt7643478"
  },

  {
    period: "2017",
    title: "Bitter Harvest",
    country: "CAN",
    credits: "dir. George Mendeluk, dop. Douglas Milsome, prod. Radioaktivefilm",
    format: "Feature",
    imdb: "tt3182620"
  },
  {
    period: "2017",
    title: "Frost",
    country: "LT | FR | UA",
    credits: "dir. Šarūnas Bartas, dop. Eitvydas Doškus, prod. Studija Kinema",
    format: "Feature",
    imdb: "tt6464290"
  },
  {
    period: "2016",
    title: "Pryputni",
    country: "UA",
    credits: "dir. Arkadiy Nepytaliuk, dop. Oleksandr Roshchyn, prod. Star Media",
    format: "Feature",
    imdb: "tt7478494"
  },

  {
    period: "2016",
    title: "Lew",
    country: "UA | POL",
    credits: "dir. Tymur Yashchenko, dop. Tato Kotetishvili, prod. Olexiy Karpenko",
    format: "Short",
    imdb: "tt8669058"
  },
  { period: "2016", title: "Ekil Sherib Neyim", country: "LB", credits: "dir. Boudy Sfeir, dop. Sergo Klèpach", format: "Feature" },
  {
    period: "2015",
    title: "Parade",
    country: "GEO",
    credits: "dir. Nino Zvania, dop. Gigi Samsonadze, prod. Nika Abramishvili",
    format: "Feature",
    imdb: "tt10165168"
  },
  {
    period: "2013",
    title: "Cello",
    country: "UA",
    credits: "dir. Olesia Morhunets-Isaienko, dop. Serhiy Stefan, prod. Dovzhenko Film Studio",
    format: "Short"
  },

  {
    period: "2013",
    title: "F63.9",
    country: "UA | FR",
    credits: "dir. Alena Demyanenko, dop. Vigen Vartanov, prod. Gagarin Media",
    format: "Feature",
    imdb: "tt3030452"
  },
  {
    period: "2013",
    title: "Green Jacket",
    country: "UA",
    credits: "dir. Volodymyr Tykhyi, dop. Serhii Stefan, prod. Arthouse Traffic",
    format: "Feature",
    imdb: "tt3175580"
  },
  {
    period: "2012",
    title: "Mom, I Love a Pilot",
    country: "UA",
    credits: "dir. Oleksandr Ihnatusha, dop. Vasiliy Borodin, prod. Dovzhenko Film Studio",
    format: "Feature",
    imdb: "tt10097664"
  }
]

const education = {
  period: "2006 — 2011",
  degree: "Master of Engineering in IT, Networks and Telecommunications",
  uni: "State University of Information and Communication Technologies",
  location: "Kyiv, Ukraine"
}

export default function AboutPage() {
  return (
    <div className="relative -mt-16 w-full py-12 md:py-28">
      <FilmGrain />
      {/* Hero Section */}
      <section className="flex flex-col items-start mx-auto gap-10 mt-16 px-6 sm:px-16 md:flex-row md:gap-16 lg:pr-40 lg:max-w-7xl lg:gap-24">
        <div className="w-full h-96 md:w-52 md:h-84 relative place-self-center md:place-self-start">
          <img src="shot.webp" alt="Headshot" className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 space-y-6 md:space-y-10">
          <article className="space-y-4 text-foreground">
            <p className="body-l pb-2">
              I’m a Video Editor with a deep background in visual storytelling, specializing in rhythm, narrative pacing, and
              seamless post-production workflows that bring complex visual concepts into tight, compelling cuts.
            </p>

            <p className="body-l">
              My approach to editing is shaped by years spent across virtually every stage of film production—from camera department
              and lighting to directing and technical engineering. Having experienced sets from every angle, I bring a keen eye for
              visual continuity, spatial pacing, and technical precision directly to the edit suite.
            </p>

            <p className="body-l">
              Whether crafting documentary narratives, commercial edits, or narrative shorts, I focus on building a clear structure
              and emotional arc. That hands-on history on set means I instinctively understand how footage was captured, how to
              solve continuity puzzles, and how to protect the vision of the film throughout post-production.
            </p>

            <div className="space-y-2">
              <p className="body-l">Besides that, I am avid at:</p>
              <ul className="list-disc pl-5 space-y-1 body-l">
                <li>Editing with a strong sense of rhythm, timing and fresh look</li>
                <li>Comprehensive color workflows and precise technical finishing</li>
                <li>Streamlined post-production pipelines and media management</li>
              </ul>
            </div>

            <p className="body-l">
              I’m comfortable collaborating in dynamic, iterative environments—refining rough cuts, fine-tuning sound and visual
              pacing, and working closely with directors and producers to elevate the story at every pass.
            </p>
          </article>

          <Button variant="default" className="rounded button w-full md:w-48 hover:bg-foreground/80" asChild>
            <a href={profile.cv} download="/cv-oleksandr-korotun.pdf">
              CV Download
              <Arrow />
            </a>
          </Button>
        </div>
      </section>

      {/* Experience */}
      <section className="max-w-7xl mx-auto px-5 sm:px-16 laptop:px-0 space-y-12 py-16 lg:py-28">
        <div className="space-y-6 lg:space-y-10 ">
          <h2 className="h2">Full Filmography</h2>

          <Frames>
            {experience.map((item, index) => (
              <FrameCard key={`${item.period}-${item.title}`} index={index} parentLength={experience.length}>
                <div className="px-6 py-10 md:p-12 grid grid-row-2 gap-4 md:gap-0 md:grid-cols-12">
                  <div className="row-1 md:col-1 flex items-baseline gap-3 md:block md:space-y-2">
                    <p className="text-muted-foreground label-m lg:label-l">{item.period}</p>
                    {item.format && <p className="text-muted-foreground/60 label-s">{item.format}</p>}
                  </div>
                  <div className="row-2 col-span-2 md:row-auto md:col-[3/11] space-y-2 md:space-y-4">
                    <div className="flex items-center gap-2">
                      <h4 className="h4">{item.title}</h4>
                      {item.imdb && (
                        <a
                          href={`https://www.imdb.com/title/${item.imdb}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${item.title} on IMDb`}
                          className="text-muted-foreground/40 transition-colors hover:text-foreground focus-visible:text-foreground">
                          <RiExternalLinkLine className="size-4" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                    <p className="body-s text-muted-foreground leading-relaxed lg:body-m">{item.credits}</p>
                  </div>
                  <p className="row-2 md:row-auto md:col-[11/13] w-full body-s text-right text-muted-foreground lg:body-m">
                    {item.country}
                  </p>
                </div>
              </FrameCard>
            ))}
          </Frames>
        </div>

        {/* Education */}
        <div className="space-y-6 lg:space-y-10 lg:py-28">
          <h2 className="h2">Education</h2>
          <FrameCard variant="single" index={0}>
            <div className="px-6 py-10 md:p-12 grid grid-row-2 gap-4 md:gap-0 md:grid-cols-12">
              <p className="row-1 md:col-[1/3] text-muted-foreground label-m lg:label-l">{education.period}</p>
              <div className="row-2 col-span-2 md:row-auto md:col-[4/10] space-y-2 md:space-y-4">
                <h4 className="h4">{education.uni}</h4>
                <p className="body-s text-muted-foreground leading-relaxed lg:body-m">{education.degree}</p>
              </div>
              <p className="row-1 md:row-auto md:col-[11/13] w-full body-s text-right text-muted-foreground lg:body-m">
                {education.location}
              </p>
            </div>
          </FrameCard>
        </div>
      </section>
    </div>
  )
}

const Frames = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <ul className={cn("border border-foreground/20", className)}>{children}</ul>
}

type FrameCardVariant = "single" | "default"

const FrameCard = ({
  index = 0,
  children,
  variant = "default",
  parentLength = 1,
  className = "",
  onClick,
  hoverable = false
}: {
  index: number
  children: ReactNode
  variant?: FrameCardVariant
  parentLength?: number
  className?: string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  hoverable?: boolean
}) => {
  const gradHoverStyle = hoverable ? addGradientHover() : ""

  const singleVariantStyles = cn(
    "border border-foreground/20 group overflow-hidden",
    "before:absolute before:-top-0.5 before:-left-0.5  before:bg-foreground before:w-1 before:h-1",
    "after:absolute after:-top-0.5 after:-right-0.5 after:bg-foreground after:w-1 after:h-1"
  )

  const isLastItem = variant === "single" || parentLength - 1 === index

  const defaultVariantStyles = cn(
    "border-b border-foreground/20 group overflow-hidden",
    isLastItem && "border-none",
    // top corners
    "before:absolute before:-top-0.5 before:-left-0.5  before:bg-foreground before:w-1 before:h-1",
    "after:absolute after:-top-0.5 after:-right-0.5 after:bg-foreground after:w-1 after:h-1"
  )

  const bottomCorners = (
    <>
      <span className="absolute -bottom-0.5 -left-0.5 bg-foreground w-1 h-1 pointer-events-none" />
      <span className="absolute -bottom-0.5 -right-0.5 bg-foreground w-1 h-1 pointer-events-none" />
    </>
  )

  if (variant === "single") {
    return (
      <div className={cn("relative", className)} onClick={onClick}>
        <div className={singleVariantStyles}>
          <div className={cn(gradHoverStyle)} />
          {children}
          {bottomCorners}
        </div>
      </div>
    )
  } else {
    return (
      <li className={cn("relative", className)} onClick={onClick}>
        <div className={defaultVariantStyles}>
          <div className={cn(gradHoverStyle)} />
          {children}
          {isLastItem && bottomCorners}
        </div>
      </li>
    )
  }
}

export { FrameCard, Frames }
