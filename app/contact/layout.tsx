import type { ReactNode } from "react"
import { pageMetadata } from "@/lib/metadata"

// The contact page is a client component and can't export metadata itself.
export const metadata = pageMetadata({
  title: "Contact",
  description: "Have a film, music video or commercial that needs an editor? Write, or send a message through the form.",
  path: "/contact"
})

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}
