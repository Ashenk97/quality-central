"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { ScanSearchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  SANDBOX_COORDINATES,
  SANDBOX_DEFECTS,
  sandboxDefectAnchor,
  type SandboxDefectId,
} from "@/lib/sandbox-defects"
import { cn } from "@/lib/utils"

type SandboxQaContextValue = {
  qaMode: boolean
  drawerOpen: boolean
  setQaMode: (on: boolean) => void
  setDrawerOpen: (open: boolean) => void
  revealDefect: (id: SandboxDefectId) => void
}

const SandboxQaContext = createContext<SandboxQaContextValue | null>(null)

export function SandboxQaProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [qaMode, setQaModeState] = useState(
    () => searchParams.get("qa") === "1"
  )
  const [drawerOpen, setDrawerOpen] = useState(false)

  const setQaMode = useCallback(
    (on: boolean) => {
      setQaModeState(on)
      const params = new URLSearchParams(searchParams.toString())
      if (on) {
        params.set("qa", "1")
      } else {
        params.delete("qa")
      }
      const query = params.toString()
      window.history.replaceState(
        null,
        "",
        query ? `${pathname}?${query}` : pathname
      )
    },
    [pathname, searchParams]
  )

  const revealDefect = useCallback(
    (id: SandboxDefectId) => {
      setQaMode(true)
      setDrawerOpen(true)
      window.requestAnimationFrame(() => {
        document
          .getElementById(sandboxDefectAnchor(id))
          ?.scrollIntoView({ behavior: "smooth", block: "center" })
      })
    },
    [setQaMode]
  )

  const value = useMemo(
    () => ({
      qaMode,
      drawerOpen,
      setQaMode,
      setDrawerOpen,
      revealDefect,
    }),
    [drawerOpen, qaMode, revealDefect, setQaMode]
  )

  return (
    <SandboxQaContext.Provider value={value}>
      {children}
      <QaModeDrawer />
    </SandboxQaContext.Provider>
  )
}

export function useSandboxQa() {
  const value = useContext(SandboxQaContext)
  if (!value) {
    throw new Error("useSandboxQa must be used within SandboxQaProvider")
  }
  return value
}

export function QaModeToggle({ className }: { className?: string }) {
  const { qaMode, drawerOpen, setQaMode, setDrawerOpen } = useSandboxQa()

  return (
    <Button
      type="button"
      variant={qaMode ? "destructive" : "outline"}
      aria-pressed={qaMode}
      aria-expanded={drawerOpen}
      onClick={() => {
        setDrawerOpen(true)
        if (!qaMode) {
          setQaMode(true)
        }
      }}
      className={cn("transition-transform duration-200 active:scale-[0.97]", className)}
    >
      <ScanSearchIcon data-icon="inline-start" />
      QA Mode
      <span
        aria-hidden
        className={cn(
          "ml-1 size-2 rounded-full",
          qaMode ? "bg-white" : "bg-muted-foreground/50"
        )}
      />
    </Button>
  )
}

function QaModeDrawer() {
  const { qaMode, drawerOpen, setQaMode, setDrawerOpen, revealDefect } =
    useSandboxQa()

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Instructor QA Mode</SheetTitle>
          <SheetDescription>
            Reveals the three seeded defects in place. This is not part of the
            student scenario — do not repair the checkout.
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center justify-between gap-3 px-4">
          <div>
            <p className="text-sm font-medium">Highlight defects</p>
            <p className="text-xs text-muted-foreground">
              Outlines stay on until you turn this off.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={qaMode}
            aria-label="Highlight seeded defects"
            onClick={() => setQaMode(!qaMode)}
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              qaMode ? "bg-destructive" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform",
                qaMode ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </button>
        </div>

        <ul className="grid gap-3 px-4 pb-6">
          {SANDBOX_DEFECTS.map((defect, index) => {
            const coordinate = SANDBOX_COORDINATES.find(
              (item) => item.id === defect.coordinateId
            )

            return (
              <li
                key={defect.id}
                className="rounded-xl border border-border bg-card p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-heading text-sm font-semibold">
                      BUG-0{index + 1} · {defect.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {coordinate?.label}
                      {coordinate?.viewport ? ` · ${coordinate.viewport}` : ""}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {defect.category}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  {defect.instructorNote}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => revealDefect(defect.id)}
                >
                  Jump to location
                </Button>
              </li>
            )
          })}
        </ul>
      </SheetContent>
    </Sheet>
  )
}
