"use client"

import { type FormEvent, useCallback, useEffect, useId, useState } from "react"
import Link from "next/link"
import { ArrowBigUpIcon, MessageSquareIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { loginUrl } from "@/lib/auth/paths"
import {
  fetchLessonComments,
  postLessonComment,
  toggleLessonCommentVote,
  validateLessonCommentBody,
  type LessonComment,
  type LessonCommentThread,
} from "@/lib/lesson-comments"
import { cn } from "@/lib/utils"

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return "Q"
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function formatRelativeTime(iso: string) {
  const deltaSeconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  const abs = Math.abs(deltaSeconds)
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

  if (abs < 60) {
    return rtf.format(-Math.trunc(deltaSeconds), "second")
  }
  if (abs < 3600) {
    return rtf.format(-Math.trunc(deltaSeconds / 60), "minute")
  }
  if (abs < 86400) {
    return rtf.format(-Math.trunc(deltaSeconds / 3600), "hour")
  }
  if (abs < 86400 * 30) {
    return rtf.format(-Math.trunc(deltaSeconds / 86400), "day")
  }
  return rtf.format(-Math.trunc(deltaSeconds / (86400 * 30)), "month")
}

function applyVote(comment: LessonComment, nextVoted: boolean): LessonComment {
  const delta = nextVoted === comment.voted ? 0 : nextVoted ? 1 : -1
  return {
    ...comment,
    voted: nextVoted,
    voteCount: Math.max(0, comment.voteCount + delta),
  }
}

export function LessonComments({
  category,
  lessonId,
}: {
  category: string
  lessonId: string
}) {
  const [threads, setThreads] = useState<LessonCommentThread[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const lessonHref = `/courses/${category}/${lessonId}`

  const load = useCallback(async () => {
    const result = await fetchLessonComments(category, lessonId)
    setUserId(result.userId)
    setThreads(result.threads)
    setLoadError(result.ok ? null : result.message)
    setLoading(false)
  }, [category, lessonId])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void load()
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [load])

  async function onVote(comment: LessonComment) {
    if (!userId) {
      toast.message("Sign in required", {
        description: "Sign in to upvote discussion posts.",
        id: "lesson-vote",
      })
      return
    }
    if (comment.userId === userId) {
      toast.message("Can't upvote yourself", {
        description: "Upvotes are for other learners' posts.",
        id: "lesson-vote",
      })
      return
    }

    const nextVoted = !comment.voted
    setThreads((current) =>
      current.map((thread) => {
        if (thread.id === comment.id) {
          return { ...applyVote(thread, nextVoted), replies: thread.replies }
        }
        return {
          ...thread,
          replies: thread.replies.map((reply) =>
            reply.id === comment.id ? applyVote(reply, nextVoted) : reply
          ),
        }
      })
    )

    const result = await toggleLessonCommentVote(comment.id, comment.voted)
    if (!result.ok) {
      toast.error("Vote failed", {
        description: result.message,
        id: "lesson-vote",
      })
      void load()
    }
  }

  async function onPosted(comment: LessonComment) {
    if (comment.parentId) {
      setThreads((current) =>
        current.map((thread) =>
          thread.id === comment.parentId
            ? { ...thread, replies: [...thread.replies, comment] }
            : thread
        )
      )
      setReplyingTo(null)
      return
    }

    setThreads((current) => [...current, { ...comment, replies: [] }])
  }

  const questionCount = threads.length
  const replyCount = threads.reduce((sum, thread) => sum + thread.replies.length, 0)

  return (
    <section
      aria-labelledby="lesson-discussion-heading"
      className="border-t border-border pt-8"
    >
      <header className="mb-5 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <MessageSquareIcon className="size-4 text-qa-primary" aria-hidden />
          <h2
            id="lesson-discussion-heading"
            className="font-heading text-xl font-semibold tracking-tight"
          >
            Discussion
          </h2>
          <p className="font-mono text-xs text-muted-foreground">
            {questionCount} {questionCount === 1 ? "question" : "questions"}
            {replyCount > 0
              ? ` · ${replyCount} ${replyCount === 1 ? "reply" : "replies"}`
              : null}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Ask about this lesson, reply to others, and upvote useful answers.
        </p>
      </header>

      {loadError ? (
        <p role="status" className="mb-4 text-sm text-muted-foreground">
          {loadError}
        </p>
      ) : null}

      {userId ? (
        <CommentComposer
          category={category}
          lessonId={lessonId}
          placeholder="What is still unclear after this lesson?"
          submitLabel="Post question"
          onPosted={onPosted}
        />
      ) : (
        <p className="mb-6 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
          <Link
            href={loginUrl(lessonHref)}
            className="font-medium text-foreground underline underline-offset-4"
          >
            Sign in to join the discussion
          </Link>
          <span className="text-muted-foreground">
            {" "}
            — questions, replies, and upvotes sync to your account.
          </span>
        </p>
      )}

      {loading ? (
        <p role="status" className="text-sm text-muted-foreground">
          Loading discussion…
        </p>
      ) : threads.length === 0 ? (
        loadError ? null : (
          <p className="text-sm text-muted-foreground">
            Be the first to ask a question about this lesson.
          </p>
        )
      ) : (
        <ol className="grid gap-4">
          {threads.map((thread) => (
            <li key={thread.id}>
              <article className="rounded-xl border border-border bg-card/60 p-4 shadow-card">
                <CommentBody
                  comment={thread}
                  currentUserId={userId}
                  kind="question"
                  onVote={() => void onVote(thread)}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {userId ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-expanded={replyingTo === thread.id}
                      onClick={() =>
                        setReplyingTo((current) =>
                          current === thread.id ? null : thread.id
                        )
                      }
                    >
                      Reply
                    </Button>
                  ) : null}
                </div>

                {replyingTo === thread.id ? (
                  <div className="mt-3 pl-2 sm:pl-4">
                    <CommentComposer
                      category={category}
                      lessonId={lessonId}
                      parentId={thread.id}
                      placeholder="Share an answer or a follow-up."
                      submitLabel="Post reply"
                      onPosted={onPosted}
                      onCancel={() => setReplyingTo(null)}
                    />
                  </div>
                ) : null}

                {thread.replies.length > 0 ? (
                  <ol className="mt-4 grid gap-3 border-l border-border pl-3 sm:pl-4">
                    {thread.replies.map((reply) => (
                      <li key={reply.id}>
                        <article>
                          <CommentBody
                            comment={reply}
                            currentUserId={userId}
                            kind="answer"
                            onVote={() => void onVote(reply)}
                          />
                        </article>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </article>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

function CommentBody({
  comment,
  currentUserId,
  kind,
  onVote,
}: {
  comment: LessonComment
  currentUserId: string | null
  kind: "question" | "answer"
  onVote: () => void
}) {
  const own = comment.userId === currentUserId
  const voteLabel = comment.voted
    ? `Remove upvote, ${comment.voteCount} ${comment.voteCount === 1 ? "vote" : "votes"}`
    : `Upvote this ${kind}, ${comment.voteCount} ${comment.voteCount === 1 ? "vote" : "votes"}`

  return (
    <div className="flex gap-3">
      <div
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-qa-primary/15 font-heading text-xs font-semibold text-qa-primary"
      >
        {initials(comment.authorName)}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <p className="text-sm font-medium">{comment.authorName}</p>
          {own ? (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
              You
            </span>
          ) : null}
          <time
            dateTime={comment.createdAt}
            className="font-mono text-[11px] text-muted-foreground"
          >
            {formatRelativeTime(comment.createdAt)}
          </time>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
          {comment.body}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          aria-pressed={comment.voted}
          aria-label={voteLabel}
          disabled={!currentUserId || own}
          onClick={onVote}
          className={cn(
            "mt-1 gap-1 text-muted-foreground",
            comment.voted && "text-qa-primary"
          )}
        >
          <ArrowBigUpIcon
            className={cn("size-3.5", comment.voted && "fill-current")}
            aria-hidden
          />
          {comment.voteCount}
        </Button>
      </div>
    </div>
  )
}

function CommentComposer({
  category,
  lessonId,
  parentId = null,
  placeholder,
  submitLabel,
  onPosted,
  onCancel,
}: {
  category: string
  lessonId: string
  parentId?: string | null
  placeholder: string
  submitLabel: string
  onPosted: (comment: LessonComment) => void
  onCancel?: () => void
}) {
  const fieldId = useId()
  const errorId = useId()
  const [body, setBody] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextError = validateLessonCommentBody(body)
    if (nextError) {
      setError(nextError)
      return
    }

    setPending(true)
    const result = await postLessonComment({
      category,
      lessonId,
      body,
      parentId,
    })
    setPending(false)

    if (!result.ok) {
      setError(result.message)
      return
    }

    setBody("")
    setError(null)
    onPosted(result.comment)
    toast.success(parentId ? "Reply posted" : "Question posted", {
      description: parentId
        ? "Your reply is live on this lesson."
        : "Your question is live on this lesson.",
      id: "lesson-comment-post",
    })
  }

  return (
    <form onSubmit={onSubmit} className="mb-6 grid gap-2">
      <Label htmlFor={fieldId} className="sr-only">
        {submitLabel}
      </Label>
      <Textarea
        id={fieldId}
        value={body}
        onChange={(event) => {
          setBody(event.target.value)
          setError(null)
        }}
        placeholder={placeholder}
        rows={parentId ? 3 : 4}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-qa-bug">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Posting…" : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  )
}
