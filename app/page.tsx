import { VideoShowcase } from "@/components/showcase/video-showcase"
import { ScrollLock } from "@/components/scroll-lock"
import { showcaseSlides } from "@/data/showcase"


export default function HomePage() {
  return (
    <div className="relative z-10 -mt-16 max-w-7xl pb-24">
      {/* One screen, navigated by gesture — nothing here scrolls. */}
      <ScrollLock />
      <VideoShowcase slides={showcaseSlides} />
    </div>
  )
}
