import { cn } from "@/lib/utils"

export const IconGlow = ({
  glowColor,
  variant = "hover",
  className
}: {
  glowColor: string
  variant?: "hover" | "permanent"
  className?: string
}) => {
  if (variant === "hover") {
    return (
      <div
        className={cn(
          "hidden -z-10 absolute inset-0 -top-1 -left-1 w-8 h-8 drop-shadow-xl rounded-full blur-xl opacity-0 group-hover:opacity-100 dark:block",
          glowColor,
          className
        )}
      />
    )
  } else {
    return (
      <div
        className={cn(
          "hidden -z-10 absolute inset-0 -top-1 -left-1 w-8 h-8 drop-shadow-xl rounded-full blur-xl dark:block",
          glowColor,
          className
        )}
      />
    )
  }
}
