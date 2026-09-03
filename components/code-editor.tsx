"use client"

import dynamic from "next/dynamic"
import { useTheme } from "next-themes"

import {
  defineQcEditorThemes,
  QC_DARK_THEME,
  QC_LIGHT_THEME,
} from "@/lib/monaco-themes"
import { cn } from "@/lib/utils"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      aria-live="polite"
      className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground"
    >
      Loading editor…
    </div>
  ),
})

type CodeEditorProps = {
  value: string
  language: "typescript" | "json" | "plaintext"
  onChange?: (value: string) => void
  readOnly?: boolean
  height?: number | string
  className?: string
  ariaLabel?: string
}

export function CodeEditor({
  value,
  language,
  onChange,
  readOnly = false,
  height = 360,
  className,
  ariaLabel,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === "light" ? QC_LIGHT_THEME : QC_DARK_THEME

  const label = ariaLabel ?? (readOnly ? "Read-only code editor" : "Code editor")

  return (
    <div
      role="region"
      aria-label={label}
      className={cn("overflow-hidden", className)}
    >
      <MonacoEditor
        height={height}
        language={language}
        theme={theme}
        value={value}
        onChange={(next) => onChange?.(next ?? "")}
        beforeMount={defineQcEditorThemes}
        options={{
          readOnly,
          ariaLabel: label,
          tabIndex: 0,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 12, bottom: 12 },
          wordWrap: "on",
          renderLineHighlight: readOnly ? "none" : "line",
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
        }}
      />
    </div>
  )
}
