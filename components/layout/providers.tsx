"use client"

import { ThemeProvider } from "next-themes"

import { GamificationWatcher } from "@/components/gamification-watcher"
import { SiteBugReporter } from "@/components/feedback/site-bug-reporter"
import { SkipToContent } from "@/components/layout/skip-to-content"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { ProgressProvider } from "@/lib/progress"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      storageKey="qc-theme"
      value={{ light: "light", dark: "dark" }}
    >
      <TooltipProvider delayDuration={0}>
        <ProgressProvider>
          <SkipToContent />
          {children}
          <SiteBugReporter />
          <GamificationWatcher />
          <Toaster position="top-right" closeButton />
        </ProgressProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
