"use client"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

const HomePageGradient = () => {
  const pathname = usePathname()

  if (pathname === "/") {
    return (
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <HeroTopGradient />
        <HeroBottomGradient />
        <NoisePattern className="dark:hidden" />
      </div>
    )
  }

  if (pathname === "/contact") {
    return (
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <HeroTopGradient />
        <NoisePattern className="dark:hidden" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      <TopGradient />
      <BottomGradient />
      <NoisePattern className="dark:hidden" />
    </div>
  )
}

export default HomePageGradient

const HeroTopGradient = () => (
  <>
    {/* Top Glow - needs GPU hint for stacking */}
    <div className="absolute left-[10%] lg:left-1/3 -translate-y-2/3 w-[640px] h-[640px] opacity-100 hidden dark:block transform-gpu">
      <div className="absolute inset-0 bg-rose-50/50 blur-[96px] rounded-full will-change-transform" />
    </div>

    {/* Top Gradient - High blur */}
    <div className="absolute w-full h-screen hidden dark:block transform-gpu">
      <div
        className="absolute inset-0 bg-sky-500/90 w-full -translate-y-1/3 lg:-translate-y-1/2 mx-auto blur-[180px] rounded-full will-change-transform
        [@supports(-moz-appearance:none)]:w-[97%]
         [@supports(-moz-appearance:none)]:bg-sky-500/40
         [@supports(-moz-appearance:none)]:-translate-y-1/4"
        style={{ WebkitBackfaceVisibility: "hidden" }}
      />
      {/* Optional for Safari */}
      {/*<div className="absolute inset-0 bg-sky-500/40 w-1/2 -translate-y-1/3 lg:-translate-y-1/2 mx-auto blur-[240px] rounded-3xl" />*/}
    </div>

    {/* Background */}
    <div className="absolute w-full h-[95dvh] opacity-10 lg:opacity-5 transform-gpu">
      <div
        className="absolute inset-0 bg-sky-950 blur-[200px] dark:bg-sky-500 will-change-transform
          saturate-[90%]
           [@supports(-moz-appearance:none)]:dark:bg-sky-50/100
          "
        style={{ WebkitBackfaceVisibility: "hidden" }}
      />
    </div>
  </>
)

const TopGradient = () => (
  <>
    {/* Top Glow */}
    <div className="absolute left-[37%] -translate-y-[40%] w-[640px] h-[640px] opacity-50 hidden dark:block transform-gpu">
      <div className="absolute inset-0 bg-rose-50/50 blur-[92px] rounded-full will-change-transform" />
    </div>

    {/* Top Gradient */}
    <div className="absolute top-[3%] left-[5%] w-full h-[1500px] opacity-50 hidden dark:block transform-gpu">
      <div
        className="absolute inset-0 bg-sky-500 w-[95dvw] h-1/2 -translate-y-1/2 blur-[120px] rounded-xl mx-auto will-change-transform"
        style={{ WebkitBackfaceVisibility: "hidden" }}
      />
      {/* Optional for Safari */}
      <div className="absolute inset-0 bg-sky-500/50 w-[95dvw] h-1/2 -translate-y-1/2 blur-[240px] rounded-xl mx-auto" />
    </div>

    {/* Background */}
    <div className="absolute w-full h-[75dvh] opacity-30 transform-gpu">
      <div className="absolute inset-0 saturate-[90%] blur-[150px] bg-sky-950/10 dark:bg-sky-700" />
    </div>
  </>
)

const BottomGradient = () => (
  <>
    <div className="absolute bottom-0 translate-y-4 w-full h-64 opacity-100 hidden dark:block ">
      <div className="absolute inset-0 bg-slate-900 blur-[96px] rounded-full" />
    </div>

    <div className="absolute bottom-0 translate-y-72 translate-x-24 w-3/4 h-96 md:translate-x-40  md:translate-y-96 opacity-100 hidden dark:block ">
      <div className="absolute inset-0 bg-sky-500 blur-[96px] rounded-full" />
    </div>
  </>
)

const HeroBottomGradient = () => (
  <>
    {/* Bottom Gradients */}
    <div className="absolute -bottom-[7%] w-full h-[60dvh] opacity-100 hidden dark:block transform-gpu">
      <div
        className="absolute inset-0 bg-sky-500/80 blur-[180px] lg:blur-[200px] rounded will-change-transform"
        style={{ WebkitBackfaceVisibility: "hidden" }}
      />
    </div>

    <div className="absolute -bottom-[15%] w-full h-screen opacity-100 hidden dark:block transform-gpu">
      <div
        className="absolute inset-0 bg-slate-900 blur-[180px] lg:blur-[120px] rounded-full will-change-transform"
        style={{ WebkitBackfaceVisibility: "hidden" }}
      />
    </div>

    {/* Bottom Glows */}
    <div className="absolute bottom-0 w-[100%] h-52 hidden dark:block transform-gpu">
      <div className="absolute inset-0 bg-sky-950 blur-[144px] rounded will-change-transform" />
    </div>

    <div className="absolute inset-full left-0 -translate-y-40 w-full lg:translate-x-28 lg:w-[85dvw] h-[600px] rounded-full opacity-100 hidden dark:block transform-gpu">
      <div
        className="absolute inset-0 bg-orange-400 rounded-full blur-[96px] will-change-transform"
        style={{ WebkitBackfaceVisibility: "hidden" }}
      />
    </div>

    <div className="absolute inset-full -translate-y-16 w-[60%] left-[20%] h-[200px] rounded-full opacity-100 hidden dark:block transform-gpu">
      <div className="absolute inset-0 bg-orange-600/60 rounded-full blur-[144px] will-change-transform" />
    </div>

    <div className="absolute inset-full -translate-y-0 w-[25%] left-[40%] h-[100px] rounded-full opacity-100 hidden dark:block transform-gpu">
      <div className="absolute inset-0 bg-teal-50 rounded-full blur-[64px] will-change-transform" />
    </div>
  </>
)

const NoisePattern = ({ className }: { className?: string }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000">
    <filter id="noise" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.3"/>
      </feComponentTransfer>
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)"/>
  </svg>`

  const noise = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`

  return (
    <div
      className={cn(
        "absolute inset-0 mix-blend-soft-light pointer-events-none transform-gpu dark:hidden",
        className,
      )}
      style={{
        backgroundImage: noise,
        backgroundRepeat: "repeat",
        WebkitBackfaceVisibility: "hidden", // Forces Safari to render as a hardware layer
      }}
    />
  )
}
