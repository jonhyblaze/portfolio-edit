import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CommandPalette } from "@/components/command-palette"
import { SoundProvider } from "@/components/sound/sound-provider"
import { SpaceKeyProvider } from "@/components/space-key-provider"
import "./globals.css"
import HomePageGradient from "@/components/gradients/full-page-grad"
import profile from "@/data/profile"
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/metadata"

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

// Defaults for every page. Pages set their own description, canonical and
// preview text through pageMetadata(); the preview image comes from
// app/opengraph-image.tsx unless a segment brings its own.
export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title: {
    default: SITE_TITLE,
    template: `%s — ${profile.name}`
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: profile.name, url: profile.url }],
  creator: profile.name,
  openGraph: {
    type: "website",
    siteName: profile.name,
    locale: "en_US",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: profile.name,
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" }
  ]
}

/** Who the site is about, for search engines. `<` is escaped so the JSON can't close its own script tag. */
const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: profile.url,
  email: `mailto:${profile.email}`,
  image: `${profile.url}/shot.webp`,
  address: { "@type": "PostalAddress", addressLocality: "Kyiv", addressCountry: "UA" },
  sameAs: [profile.imdb, profile.instagram, profile.linkedIn, profile.telegram]
}).replace(/</g, "\\u003c")

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} relative font-sans antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd }} />
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
