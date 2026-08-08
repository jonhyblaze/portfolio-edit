import React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CommandPalette } from "@/components/command-palette"
import { SoundProvider } from "@/components/sound/sound-provider"
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
            <HomePageGradient />
            <Header />
            <CommandPalette />
            {/* pt-16 clears the fixed header; pages with a full-bleed hero cancel it with -mt-16 */}
            <main className="grid place-items-center min-h-screen pt-16">{children}</main>
            <Footer />
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
