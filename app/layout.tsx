import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google"

import { GridBackground } from "@/components/layout/grid-background"
import { Providers } from "@/components/layout/providers"

import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Quality Central",
    template: "%s · Quality Central",
  },
  description:
    "Zero to Advanced QA Engineering — a structured learning hub for manual QA, API testing, UI automation, and hands-on bug hunting.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark h-full`}
      suppressHydrationWarning
    >
      <body className="relative min-h-full bg-background font-sans text-foreground antialiased">
        <GridBackground />
        <div className="relative z-10 min-h-full overflow-x-clip">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  )
}
