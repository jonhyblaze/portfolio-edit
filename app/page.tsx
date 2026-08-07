import Link from "next/link"
import LightRays from "@/components/LightRays"
import CommandPaletteHint from "@/components/animations/command-palette-hint"
import { Arrow } from "@/components/svg/arrow"
import { IconGlow } from "@/components/gradients/icon-glow"
import { Button } from "@/components/ui/button"
import { VideoShowcase } from "@/components/showcase/video-showcase"
import { showcaseSlides } from "@/data/showcase"
import { cn } from "@/lib/utils"
import { addGradientHover } from "@/lib/helpers"
import { RiBracesLine, RiExpandDiagonalLine, RiLoopRightLine, RiShapeLine } from "@remixicon/react"

export default function HomePage() {
  return (
    <div className="relative z-10 -mt-16 max-w-7xl pb-24">
      {/*<Hero className="min-h-screen" />*/}
      {/* Full-bleed hero layer: the wrapper is centred and max-w-7xl, so break out of it
                 with left-1/2 + -translate-x-1/2 before spanning the viewport. */}
      {/*<div className="pointer-events-none absolute top-0 left-1/2 h-dvh w-screen -translate-x-1/2 z-10">
        <LightRays
          raysOrigin="top-left"
          raysColor="#FCAD70"
          raysSpeed={0.3}
          lightSpread={1.5}
          rayLength={1.1}
          pulsating={false}
          fadeDistance={3}
          saturation={5}
          followMouse
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.0}
        />
      </div>
      <div className="pointer-events-none absolute top-0 left-1/2 h-dvh w-screen -translate-x-1/2 z-10">
        <LightRays
          raysOrigin="bottom-right"
          raysColor="#81C995"
          raysSpeed={0.5}
          lightSpread={3.5}
          rayLength={1.1}
          pulsating={false}
          fadeDistance={3}
          saturation={1}
          followMouse
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.0}
        />
      </div>*/}
      <VideoShowcase slides={showcaseSlides} />
    </div>
  )
}

const Hero = ({ className }: { className?: string }) => {
  return (
    <section className={cn("grid place-items-center text-center", className)}>
      <div className="pb-10 md:pb-24 lg:pb-32">
        <CommandPaletteHint className="button text-muted-foreground" />
        <div className="py-6">
          <h1 className="h1 leading-[1.1] pb-10 max-w-4xl mx-auto">Creating stories that resonates</h1>
          <p className="body-l text-foreground/70 mx-auto max-w-2xl text-balance">
            Video Editor with strong visual taste, attention to details and modern workflows.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 justify-center sm:flex-row">
          <Link href="/contact">
            <Button size="lg" className="button w-64 sm:w-44 gap-2 group rounded">
              Contact Me
              <Arrow className="-rotate-90 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
          <Link href="/about">
            <Button
              size="lg"
              variant="outline"
              className="button w-64 sm:w-44 rounded border-zinc-950 bg-transparent hover:bg-zinc-50 dark:border-zinc-100 dark:hover:bg-zinc-950/50">
              About
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

const Approach = ({ className }: { className: string }) => {
  const gradHoverStyles = addGradientHover()

  return (
    <section className={cn("space-y-12", className)}>
      <div className="flex flex-col gap-10 lg:justify-between lg:flex-row lg:gap-4">
        <h2 className="h2 lg:w-1/2">How I Build Things</h2>
        <article className="space-y-6 body-l lg:w-1/2">
          <p>
            I usually start by understanding the business goal and constraints, not just the feature request. Most of my work has
            been on evolving products, so I’m used to building with change in mind rather than aiming for a “perfect” first version.
          </p>
          <p> On the technical side, I prefer simple, maintainable solutions:</p>
        </article>
      </div>

      <div className="flex flex-col gap-0 [&>*+*]:-mt-px">
        <ul className="grid lg:grid-cols-3 [&>*+*]:-ml-px">
          {[
            {
              icon: RiShapeLine,
              title: "Clear Boundaries",
              desc: "Modular components that do one thing well and are easy to replace."
            },
            {
              icon: RiBracesLine,
              title: "Predictable State",
              desc: "Managing data flow so the UI is a direct, reliable reflection of the logic."
            },
            {
              icon: RiExpandDiagonalLine,
              title: "Scalable Styling",
              desc: "CSS systems that allow for rapid UI iteration without technical debt."
            }
          ].map((pillar, i) => {
            return (
              <li key={i} className="relative group border border-foreground/50 px-6 md:px-12 py-10">
                <div className={gradHoverStyles} />
                <header className="flex justify-between pb-6">
                  <figure className="relative">
                    <pillar.icon size={24} className="dark:text-muted-foreground" />
                    <IconGlow glowColor="bg-sky-300/40" className="top-0.5 left-0.5 h-5 w-5 blur-lg duration-300" />
                  </figure>
                  <span className="text-muted-foreground label-m">0{i + 1}</span>
                </header>
                <div className="space-y-2">
                  <h5 className="label-l">{pillar.title}</h5>
                  <p className="body-m text-muted-foreground">{pillar.desc}</p>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="relative border border-foreground/50 px-6 md:px-12 py-10 group">
          <div className={gradHoverStyles} />
          <div className="flex gap-16 justify-between">
            <div className="flex flex-col gap-6">
              <figure className="relative">
                <RiLoopRightLine size={24} className="dark:text-muted-foreground" />
                <IconGlow glowColor="bg-sky-300/40" className="top-0.5 left-0.5 h-5 w-5 blur-lg duration-300" />
              </figure>
              <h5 className="label-l">Pragmatic Iteration</h5>
            </div>
            <p className="text-muted-foreground body-m max-w-2xl hidden lg:block">
              I’m comfortable refactoring existing codebases — improving them when necessary while avoiding over-engineering. My
              path is usually:
              <span className="text-primary"> Ship the simplest viable path today, and improve later as requirements clarify.</span>
            </p>
            <p className="label-m text-muted-foreground justify-self-end">04</p>
          </div>
          <p className="text-muted-foreground body-m mt-2 block lg:hidden">
            I’m comfortable refactoring existing codebases — improving them when necessary while avoiding over-engineering. My path
            is usually: Ship the simplest viable path today, and improve later as requirements clarify.
          </p>
        </div>
      </div>
    </section>
  )
}
