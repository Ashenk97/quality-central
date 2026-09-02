"use client"

export function MdxError({ error }: { error: unknown }) {
  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : "Unable to render this lesson."

  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
      <p className="font-medium">MDX failed to render</p>
      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-xs">
        {message}
      </pre>
    </div>
  )
}
