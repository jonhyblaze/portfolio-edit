import React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CommandPalette } from "@/components/command-palette"
import { SoundProvider } from "@/components/sound/sound-provider"
import { SpaceKeyProvider } from "@/components/space-key-provider"
import "./globals.css"
import HomePageGradient from "@/components/gradients/full-page-grad"

// Not --font-sans: that name is Tailwind v4's own theme key, and pointing it at
// itself in @theme would be circular.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono" // Defines the CSS variable
})

export const metadata: Metadata = {
  title: "Video Editor Portfolio",
  description: "Modern video editor portfolio with keyboard-first navigation",
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Oleksandr Korotun",
  },

  icons: {
     icon: [
       { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
       { url: "/favicon.svg", type: "image/svg+xml" },
     ],
     shortcut: "/favicon.ico",
     apple: [
       { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
     ],
   },
}


export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} relative font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SoundProvider>
            {/* Site-wide: the space bar stops scrolling the page and stops firing
                whatever holds focus. Only a project page gives it a job. */}
            <SpaceKeyProvider>
              <HomePageGradient />
              <Header />
              <CommandPalette />
              {/* pt-16 clears the fixed header; pages with a full-bleed hero cancel it with -mt-16.
                  The column is pinned to minmax(0,1fr) because a bare `auto` track sizes itself to
                  the widest thing inside it — one horizontally scrollable child and the whole page
                  grows past the viewport. Centring is unaffected. */}
              <main className="grid grid-cols-[minmax(0,1fr)] place-items-center min-h-screen pt-16">{children}</main>
              <Footer />
            </SpaceKeyProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
