"use client"
import { usePathname } from "next/navigation"

const HomePageGradient = () => {
  const pathname = usePathname()

  const deactivatedRoutes =  (["/projects", "/about"])

  if (deactivatedRoutes.some(route => pathname.startsWith(route))) {
      return null
  }

  if (pathname === "/") return null


  if (pathname === "/contact") {
    return (
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <HeroTopGradient />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      <TopGradient />
      <BottomGradient />
    </div>
  )
}

export default HomePageGradient

const HeroTopGradient = () => (
  <>
    {/* Top Glow - needs GPU hint for stacking */}
    <div className="absolute left-[10%] lg:left-1/3 -translate-y-2/3 w-160 h-160 opacity-100 hidden dark:block transform-gpu">
      <div className="absolute inset-0 bg-rose-50/50 blur-[96px] rounded-full will-change-transform" />
    </div>

    {/* Top Gradient - High blur */}
    <div className="absolute w-full h-screen hidden dark:block transform-gpu">
      <div
        className="absolute inset-0 bg-red-600/90 w-full -translate-y-1/3 lg:-translate-y-1/2 mx-auto blur-[280px] rounded-full will-change-transform
        [@supports(-moz-appearance:none)]:w-[97%]
         [@supports(-moz-appearance:none)]:bg-red-600/40
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
          saturate-90
           [@supports(-moz-appearance:none)]:dark:bg-sky-50
          "
        style={{ WebkitBackfaceVisibility: "hidden" }}
      />
    </div>
  </>
)

const TopGradient = () => (
  <>
    {/* Top Glow */}
    <div className="absolute left-[37%] translate-y-[-40%] w-160 h-160 opacity-50 hidden dark:block transform-gpu">
      <div className="absolute inset-0 bg-rose-50/50 blur-[92px] rounded-full will-change-transform" />
    </div>

    {/* Top Gradient */}
    <div className="absolute top-[3%] left-[5%] w-full h-375 opacity-50 hidden dark:block transform-gpu">
      <div
        className="absolute inset-0 bg-sky-500 w-[95dvw] h-1/2 -translate-y-1/2 blur-[120px] rounded-xl mx-auto will-change-transform"
        style={{ WebkitBackfaceVisibility: "hidden" }}
      />
      {/* Optional for Safari */}
      <div className="absolute inset-0 bg-sky-500/50 w-[95dvw] h-1/2 -translate-y-1/2 blur-[240px] rounded-xl mx-auto" />
    </div>

    {/* Background */}
    <div className="absolute w-full h-[75dvh] opacity-30 transform-gpu">
      <div className="absolute inset-0 saturate-90 blur-[150px] bg-sky-950/10 dark:bg-sky-700" />
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

export const HeroBottomGradient = () => (
  <>
    {/* Bottom Gradients */}

    <div className="absolute bottom-[-15%] w-full h-screen opacity-100 hidden dark:block transform-gpu">
      <div
        className="absolute inset-0 bg-slate-900 blur-[180px] lg:blur-[120px] rounded-full will-change-transform"
        style={{ WebkitBackfaceVisibility: "hidden" }}
      />
    </div>

    {/* Bottom Glows */}
    <div className="absolute bottom-0 w-full h-52 hidden dark:block transform-gpu">
      <div className="absolute inset-0 bg-sky-950 blur-[144px] rounded will-change-transform" />
    </div>

    <div className="absolute inset-full left-0 -translate-y-40 w-full lg:translate-x-28 lg:w-[85dvw] h-150 rounded-full opacity-100 hidden dark:block transform-gpu">
      <div
        className="absolute inset-0 bg-orange-400 rounded-full blur-[96px] will-change-transform"
        style={{ WebkitBackfaceVisibility: "hidden" }}
      />
    </div>

    <div className="absolute inset-full -translate-y-16 w-[60%] left-[20%] h-50 rounded-full opacity-100 hidden dark:block transform-gpu">
      <div className="absolute inset-0 bg-orange-600/60 rounded-full blur-[144px] will-change-transform" />
    </div>
  </>
)
