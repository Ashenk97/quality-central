import type { ReactNode } from "react"

import { Brand } from "@/components/brand"
import { ModeToggle } from "@/components/layout/mode-toggle"

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b pt-[env(safe-area-inset-top,0px)]">
        <div className="flex h-14 items-center justify-between px-4 md:px-8">
          <Brand />
          <ModeToggle />
        </div>
      </header>
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 pb-24"
      >
        {children}
      </main>
    </div>
  )
}
