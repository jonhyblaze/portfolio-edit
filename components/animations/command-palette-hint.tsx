import Letter from "./letter"
import { cn } from "@/lib/utils"

export default function CommandPaletteHint({ className }: { className?: string }) {
  let globalIndex = 0

  // Helper to turn strings into animated letter spans
  const renderLetters = (text: string) => {
    return text.split("").map((char) => {
      const index = globalIndex++
      return <Letter key={index} char={char} index={index} />
    })
  }

  return (
    <p className={cn(className)}>
      {renderLetters("[ Press ")}
      <span className="inline text-primary">
        <span className="relative top-[1px] text-[1.2em] mr-0.5">{renderLetters("⌘")}</span>
        <span className="tracking-tight">{renderLetters("K")}</span>
      </span>
      {renderLetters(" to open command palette ]")}
    </p>
  )
}
