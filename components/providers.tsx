"use client"

import { ThemeProvider } from "next-themes"

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
    >
      <TooltipProvider delayDuration={0}>
        <ProgressProvider>
          {children}
          <Toaster position="bottom-right" closeButton />
        </ProgressProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
