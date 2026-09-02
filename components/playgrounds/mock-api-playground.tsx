"use client"

import { useState } from "react"

import { CodeEditor } from "@/components/code-editor"
import { HttpStatusBadge } from "@/components/http-status-badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DUMMY_API_PATH } from "@/lib/dummy-api"
import { cn } from "@/lib/utils"

type Method = "GET" | "POST"

type Example = {
  label: string
  method: Method
  url: string
  body: string
  status: 200 | 404 | 500
}

const EXAMPLES: Example[] = [
  {
    label: "200 OK",
    method: "GET",
    url: DUMMY_API_PATH,
    body: '{\n  "status": 200\n}',
    status: 200,
  },
  {
    label: "404",
    method: "GET",
    url: `${DUMMY_API_PATH}?status=404`,
    body: '{\n  "status": 404\n}',
    status: 404,
  },
  {
    label: "500",
    method: "POST",
    url: DUMMY_API_PATH,
    body: '{\n  "status": 500\n}',
    status: 500,
  },
]

type ResponseView = {
  status: number
  statusText: string
  timeMs: number
  body: string
  language: "json" | "plaintext"
}

const EMPTY_RESPONSE = "// Hit Send to see status codes and JSON."

export function MockApiPlayground() {
  const [method, setMethod] = useState<Method>("GET")
  const [url, setUrl] = useState(DUMMY_API_PATH)
  const [body, setBody] = useState('{\n  "status": 200\n}')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ResponseView | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function sendRequest() {
    setLoading(true)
    setError(null)
    const started = performance.now()

    try {
      const init: RequestInit = {
        method,
        headers:
          method === "POST"
            ? { "Content-Type": "application/json" }
            : undefined,
        body: method === "POST" ? body : undefined,
      }

      const result = await fetch(url, init)
      const text = await result.text()
      let pretty = text
      let language: ResponseView["language"] = "plaintext"

      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2)
        language = "json"
      } catch {
        pretty = text || "(empty body)"
      }

      setResponse({
        status: result.status,
        statusText: result.statusText,
        timeMs: Math.round(performance.now() - started),
        body: pretty,
        language,
      })
    } catch (caught) {
      setResponse(null)
      setError(
        caught instanceof Error
          ? caught.message
          : "The request failed before a response was received."
      )
    } finally {
      setLoading(false)
    }
  }

  const responseValue = error
    ? error
    : response
      ? response.body
      : EMPTY_RESPONSE

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-card px-3 py-2">
        <p className="font-heading text-sm font-semibold">Mock API Playground</p>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLES.map((example) => (
            <Button
              key={example.label}
              type="button"
              size="xs"
              variant="outline"
              className={cn(
                "font-mono transition-colors duration-200",
                example.status === 200
                  ? "text-success hover:text-success"
                  : "text-destructive hover:text-destructive"
              )}
              onClick={() => {
                setMethod(example.method)
                setUrl(example.url)
                setBody(example.body)
              }}
            >
              {example.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-b bg-muted/30 p-3 sm:flex-row sm:items-center">
        <Select
          value={method}
          onValueChange={(value) => setMethod(value as Method)}
        >
          <SelectTrigger
            size="sm"
            aria-label="HTTP method"
            className={cn(
              "w-[7.5rem] font-mono",
              method === "GET" && "text-success",
              method === "POST" && "text-warning"
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          aria-label="Request URL"
          className="font-mono"
          placeholder={DUMMY_API_PATH}
        />
        <Button
          onClick={sendRequest}
          disabled={loading || !url.trim()}
          className="transition-transform duration-200 active:scale-[0.97]"
        >
          {loading ? "Sending…" : "Send"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2">
        <section className="border-b lg:border-r lg:border-b-0">
          <p className="px-3 pt-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Body
          </p>
          <CodeEditor
            language="json"
            value={body}
            onChange={setBody}
            readOnly={method === "GET"}
            height={220}
            ariaLabel="JSON payload"
          />
          <p className="px-3 pb-3 text-xs text-muted-foreground">
            GET uses the URL only. POST sends this JSON. Set{" "}
            <code className="font-mono">status</code> to 200, 404, or 500.
          </p>
        </section>

        <section>
          <div className="flex items-center justify-between gap-2 px-3 pt-3">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Response
            </p>
            {response ? (
              <div className="flex items-center gap-2">
                <HttpStatusBadge
                  key={`${response.status}-${response.timeMs}`}
                  status={response.status}
                  statusText={response.statusText}
                  className="animate-in fade-in zoom-in-95 duration-200"
                />
                <span className="font-mono text-xs text-muted-foreground">
                  {response.timeMs} ms
                </span>
              </div>
            ) : null}
          </div>
          <CodeEditor
            language={error ? "plaintext" : (response?.language ?? "json")}
            value={responseValue}
            readOnly
            height={220}
            ariaLabel="Response body"
          />
        </section>
      </div>
    </div>
  )
}
