"use client"

import { useState } from "react"

import { CodeEditor } from "@/components/code-editor"
import { HttpStatusBadge } from "@/components/http-status-badge"
import { Button } from "@/components/ui/button"
import { DEFAULT_INVALID_CHECKOUT } from "@/lib/capstone"

type ResponseView = {
  status: number
  statusText: string
  timeMs: number
  body: string
}

export function CapstoneCheckoutPlayground({
  onStatus,
}: {
  onStatus: (status: number) => void
}) {
  const [body, setBody] = useState(DEFAULT_INVALID_CHECKOUT)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ResponseView | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function sendRequest() {
    setLoading(true)
    setError(null)
    const started = performance.now()

    try {
      const result = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      })
      const text = await result.text()
      let pretty = text
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2)
      } catch {
        pretty = text || "(empty body)"
      }
      setResponse({
        status: result.status,
        statusText: result.statusText,
        timeMs: Math.round(performance.now() - started),
        body: pretty,
      })
      onStatus(result.status)
    } catch (caught) {
      setResponse(null)
      onStatus(0)
      setError(
        caught instanceof Error
          ? caught.message
          : "The request failed before a response was received."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-card px-3 py-2">
        <div>
          <p className="font-heading text-sm font-semibold">Checkout API</p>
          <p className="font-mono text-xs text-muted-foreground">
            POST /api/checkout
          </p>
        </div>
        <Button
          type="button"
          onClick={sendRequest}
          disabled={loading}
          className="transition-transform duration-200 active:scale-[0.97]"
        >
          {loading ? "Sending…" : "Send"}
        </Button>
      </div>
      <div className="grid lg:grid-cols-2">
        <section className="border-b lg:border-r lg:border-b-0">
          <p className="px-3 pt-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Invalid payload
          </p>
          <CodeEditor
            language="json"
            value={body}
            onChange={setBody}
            height={200}
            ariaLabel="Checkout JSON payload"
          />
        </section>
        <section>
          <div className="flex items-center justify-between gap-2 px-3 pt-3">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Response
            </p>
            {response ? (
              <div className="flex items-center gap-2">
                <HttpStatusBadge
                  status={response.status}
                  statusText={response.statusText}
                />
                <span className="font-mono text-xs text-muted-foreground">
                  {response.timeMs} ms
                </span>
              </div>
            ) : null}
          </div>
          <CodeEditor
            language={error ? "plaintext" : "json"}
            value={error ?? response?.body ?? "// Send the invalid payload."}
            readOnly
            height={200}
            ariaLabel="Checkout response body"
          />
        </section>
      </div>
    </div>
  )
}
