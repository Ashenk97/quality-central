"use client"

import { type FormEvent, useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { BriefcaseIcon, RotateCcwIcon, SendIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import {
  pickInterviewQuestion,
  type InterviewQuestion,
} from "@/lib/mock-interview"
import { cn } from "@/lib/utils"

function messageText(parts: { type: string; text?: string }[]) {
  return parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("")
}

function MockInterviewChat({ question }: { question: InterviewQuestion }) {
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({ questionId: question.id }),
    }),
  })

  const busy = status === "submitted" || status === "streaming"

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" })
  }, [messages, status])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = input.trim()
    if (!text || busy) {
      return
    }
    sendMessage({ text })
    setInput("")
  }

  return (
    <>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4">
        {messages.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border/80 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            Type your answer below. I will grade clarity, edge cases, and ISTQB
            thinking — then tell you hire / lean hire / no hire.
          </p>
        ) : null}
        {messages.map((message) => {
          const text = messageText(message.parts)
          if (!text) {
            return null
          }
          const isUser = message.role === "user"
          return (
            <div
              key={message.id}
              className={cn(
                "rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                isUser
                  ? "ml-6 bg-primary/10 text-foreground"
                  : "mr-6 border border-border/80 bg-card text-card-foreground"
              )}
            >
              <p className="mb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                {isUser ? "You" : "Hiring manager"}
              </p>
              {text}
            </div>
          )
        })}
        {status === "submitted" ? (
          <p className="text-xs text-muted-foreground">Scoring your answer…</p>
        ) : null}
        {error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error.message || "Something went wrong. Try again."}
          </p>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <SheetFooter className="border-t border-border/80">
        <form onSubmit={onSubmit} className="grid gap-2">
          <label htmlFor="mock-interview-answer" className="sr-only">
            Your interview answer
          </label>
          <Textarea
            id="mock-interview-answer"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={busy}
            rows={4}
            placeholder="Answer as you would in a live interview…"
          />
          <div className="flex items-center justify-end gap-2">
            {busy ? (
              <Button type="button" variant="outline" onClick={() => stop()}>
                Stop
              </Button>
            ) : null}
            <Button type="submit" disabled={busy || !input.trim()}>
              <SendIcon data-icon="inline-start" />
              Submit answer
            </Button>
          </div>
        </form>
      </SheetFooter>
    </>
  )
}

export function MockInterviewer() {
  const [open, setOpen] = useState(false)
  const [session, setSession] = useState(0)
  const [question, setQuestion] = useState<InterviewQuestion>(() =>
    pickInterviewQuestion()
  )

  function startSession(excludeId?: string) {
    setQuestion(pickInterviewQuestion(excludeId))
    setSession((value) => value + 1)
  }

  return (
    <>
      <Button
        type="button"
        size="lg"
        onClick={() => {
          startSession()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        className="print:hidden fixed right-4 bottom-20 z-40 gap-2 shadow-card md:right-6 md:bottom-24"
      >
        <BriefcaseIcon data-icon="inline-start" />
        Practice Interview
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full gap-0 overflow-hidden sm:max-w-lg"
        >
          <SheetHeader className="border-b border-border/80">
            <div className="flex items-start justify-between gap-3 pr-8">
              <div className="space-y-1">
                <SheetTitle>Mock interviewer</SheetTitle>
                <SheetDescription>
                  Strict Senior QA Hiring Manager. Answer the prompt, then get a
                  score.
                </SheetDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => startSession(question.id)}
              >
                <RotateCcwIcon data-icon="inline-start" />
                New question
              </Button>
            </div>
            <div className="rounded-lg border border-border/80 bg-muted/40 px-3 py-2">
              <Badge variant="secondary" className="mb-1.5">
                {question.topic}
              </Badge>
              <p className="text-sm font-medium text-foreground">
                {question.prompt}
              </p>
            </div>
          </SheetHeader>
          {open ? (
            <MockInterviewChat key={`${question.id}-${session}`} question={question} />
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  )
}
