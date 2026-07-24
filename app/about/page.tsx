import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Arrow } from "@/components/svg/arrow"
import { RiPaletteFill, RiSpaceShip2Fill, RiStackFill, RiToolsFill } from "@remixicon/react"
import { cn } from "@/lib/utils"
import { addGradientHover } from "@/lib/helpers"
import profile from "@/data/profile"


export default function AboutPage() {
  const experience = [
    {
      period: "2013",
      title: "Bitter Harvest",
      country: "CAN",
      credits:
        "dir. Alena Demyanenko, dop. Vigen Vartanov, prod. Radioaktivefilm"
    },
    {
      period: "2012",
      title: "F63.9",
      country: "UA | FR",
      credits: "dir. Alena Demyanenko, dop. Vigen Vartanov, prod."
    },
    {
      period: "2012",
      title: "Green Jacket",
      country: "UA",
      credits: "dir. Volodymyr Tykhyi, dop. Serhii Stefan, prod. Arthouse Traffic"
    }
  ]

  const education = {
    period: "2006 — 2011",
    degree: "Master of Engineering in IT, Networks and Telecommunications",
    uni: "State University of Information and Communication Technologies",
    location: "Kyiv, Ukraine"
  }

  return (
    <div className="w-full py-12 md:py-28">
      {/* Hero Section */}
      <section className="flex flex-col items-start mx-auto gap-10 px-6 sm:px-16 md:flex-row md:gap-16 lg:pr-40 lg:max-w-6xl lg:gap-24">
        <div className="w-full h-96 md:w-52 md:h-74 relative place-self-center md:place-self-start">
          <img src="headshot.webp" alt="Headshot" className="rounded w-full h-full object-cover" />
        </div>

        <div className="flex-1 space-y-6 md:space-y-10">
          <article className="space-y-4 text-foreground">
            <p className="subtitle pb-2">
              I’m a Frontend developer specializing in React & Next.js, with full-stack experience shipping production apps,
              collaborating with designers, and turning complex requirements into clean, usable interfaces.
            </p>
            <p className="body-m">
              I have a formal background in IT engineering and have been building for the web in various forms for a long time.
              While my early career took me into film production and cinematography, working on complex creative projects sharpened
              my sense for structure, collaboration, and visual detail.
            </p>

            <p className="body-m">
              In 2022, I made a deliberate return to software development, this time focusing on building web applications properly
              — with modern tools, clear abstractions, and long-term maintainability in mind. That path quickly led to freelance
              work and, eventually, to owning frontend architecture on long-running production projects.
            </p>
            <div className="space-y-2">
              <p className="body-m">My work today focuses on:</p>
                SOME stuff that matters most
            </div>
            <p className="body-m">
              I’m comfortable working in environments where things evolve over time — iterating on existing codebases, improving UX,
              and refining technical decisions as products grow.
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
      <section className="max-w-[1240px] mx-auto px-5 sm:px-16 laptop:px-0 space-y-12 py-16 lg:py-28">
        <div className="space-y-6 lg:space-y-10 ">
          <h2 className="h2">Filmography</h2>

          <Frames>
            {experience.map((item, index) => (
              <FrameCard key={index} index={index} parentLength={experience.length}>
                <div className="px-6 py-10 md:p-12 grid grid-row-2 gap-4 md:gap-0 md:grid-cols-12">
                  <p className="row-[1] md:col-[1/3] text-muted-foreground label-m lg:label-l">{item.period}</p>
                  <div className="row-[2] col-span-2 md:row-auto md:col-[4/10] space-y-2 md:space-y-4">
                    <h4 className="h4">{item.title}</h4>
                    <p className="body-s text-muted-foreground leading-relaxed lg:body-m">{item.credits}</p>
                  </div>
                  <p className="row-[1] md:row-auto md:col-[11/13] w-full body-s text-right text-muted-foreground lg:body-m">
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
              <p className="row-[1] md:col-[1/3] text-muted-foreground label-m lg:label-l">{education.period}</p>
              <div className="row-[2] col-span-2 md:row-auto md:col-[4/10] space-y-2 md:space-y-4">
                <h4 className="h4">{education.uni}</h4>
                <p className="body-s text-muted-foreground leading-relaxed lg:body-m">{education.degree}</p>
              </div>
              <p className="row-[1] md:row-auto md:col-[11/13] w-full body-s text-right text-muted-foreground lg:body-m">
                {education.location}
              </p>
            </div>
          </FrameCard>
        </div>
      </section>
    </div>
  )
}

const cards = [
  {
    title: "Translating design into clean, accessible UI",
    icon: RiPaletteFill
  },
  {
    title: "Building maintainable, scalable systems",
    icon: RiStackFill
  },
  {
    title: "Choosing tools intentionally rather than by trend",
    icon: RiToolsFill
  },
  {
    title: "Shipping features that solve real business problems",
    icon: RiSpaceShip2Fill
  }
]


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
