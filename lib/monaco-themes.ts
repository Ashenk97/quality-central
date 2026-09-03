import type { Monaco } from "@monaco-editor/react"

export const QC_DARK_THEME = "qc-dark"
export const QC_LIGHT_THEME = "qc-light"

export function defineQcEditorThemes(monaco: Monaco) {
  monaco.editor.defineTheme(QC_DARK_THEME, {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "71717a", fontStyle: "italic" },
      { token: "keyword", foreground: "a5b4fc" },
      { token: "type", foreground: "c4b5fd" },
      { token: "string", foreground: "6ee7b7" },
      { token: "number", foreground: "fbbf24" },
      { token: "regexp", foreground: "67e8f9" },
      { token: "delimiter", foreground: "a1a1aa" },
      { token: "string.key.json", foreground: "a5b4fc" },
      { token: "string.value.json", foreground: "6ee7b7" },
      { token: "number.json", foreground: "fbbf24" },
      { token: "keyword.json", foreground: "fbbf24" },
    ],
    colors: {
      "editor.background": "#0a0a0a",
      "editor.foreground": "#fafafa",
      "editorLineNumber.foreground": "#52525b",
      "editorLineNumber.activeForeground": "#a1a1aa",
      "editorCursor.foreground": "#6366f1",
      "editor.selectionBackground": "#6366f14d",
      "editor.inactiveSelectionBackground": "#19192a",
      "editor.lineHighlightBackground": "#19192a66",
      "editorWidget.background": "#111111",
      "editorWidget.border": "#ffffff1a",
      "editorIndentGuide.background1": "#ffffff14",
      "editorIndentGuide.activeBackground1": "#6366f166",
    },
  })

  monaco.editor.defineTheme(QC_LIGHT_THEME, {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "64748b", fontStyle: "italic" },
      { token: "keyword", foreground: "4338ca" },
      { token: "type", foreground: "6d28d9" },
      { token: "string", foreground: "047857" },
      { token: "number", foreground: "b45309" },
      { token: "regexp", foreground: "0e7490" },
      { token: "delimiter", foreground: "64748b" },
      { token: "string.key.json", foreground: "4338ca" },
      { token: "string.value.json", foreground: "047857" },
      { token: "number.json", foreground: "b45309" },
      { token: "keyword.json", foreground: "b45309" },
    ],
    colors: {
      "editor.background": "#f8fafc",
      "editor.foreground": "#0f172a",
      "editorLineNumber.foreground": "#94a3b8",
      "editorLineNumber.activeForeground": "#475569",
      "editorCursor.foreground": "#4f46e5",
      "editor.selectionBackground": "#c7d2fe80",
      "editor.inactiveSelectionBackground": "#e2e8f0",
      "editor.lineHighlightBackground": "#e2e8f066",
      "editorWidget.background": "#ffffff",
      "editorWidget.border": "#e2e8f0",
      "editorIndentGuide.background1": "#e2e8f0",
      "editorIndentGuide.activeBackground1": "#cbd5e1",
    },
  })
}
