import { VideoShowcase } from "@/components/showcase/video-showcase"
import { showcaseSlides } from "@/data/showcase"



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
