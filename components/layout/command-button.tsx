import { Button } from "@/components/ui/button"

export default function CommandButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="button rounded-sm ml-2 gap-2 text-muted-foreground bg-transparent border-black/25 dark:border-white/25 hover:border-black dark:hover:border-white/50 hover:bg-transparent dark:hover:bg-transparent"
      onClick={() => {
        const event = new KeyboardEvent("keydown", {
          key: "k",
          metaKey: true,
          bubbles: true
        })
        document.dispatchEvent(event)
      }}>
      <p>Search</p>
      <p className="flex gap-0.5 items-center border rounded px-2">
        <span className="relative text-md top-px">⌘</span>
        <span>K</span>
      </p>
    </Button>
  )
}
