"use client"

import { useEffect, useState } from "react"
import { FlameIcon, RotateCcwIcon, SparklesIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  applyDailyStreak,
  isChallengeCorrect,
  localDateKey,
  pickDailyChallenge,
  type DailyStreakState,
} from "@/lib/daily-challenge"
import {
  loadDailyStreak,
  saveDailyStreak,
} from "@/lib/supabase/daily-challenge"
import { cn } from "@/lib/utils"

export function DailyChallenge() {
  const challenge = pickDailyChallenge()
  const today = localDateKey()
  const [choice, setChoice] = useState("")
  const [flipped, setFlipped] = useState(false)
  const [streak, setStreak] = useState<DailyStreakState>({
    streakCount: 0,
    lastAnsweredOn: null,
    lastChallengeId: null,
  })
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)

  const answeredToday = streak.lastAnsweredOn === today
  const correct = isChallengeCorrect(challenge, choice)

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      const { state } = await loadDailyStreak()
      if (cancelled) {
        return
      }
      setStreak(state)
      if (state.lastAnsweredOn === localDateKey()) {
        setFlipped(true)
      }
      setReady(true)
    }

    void hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  async function reveal() {
    if (!choice.trim()) {
      toast.warning("Pick or type an answer first")
      return
    }

    setFlipped(true)
    if (answeredToday) {
      return
    }

    setSaving(true)
    const next = applyDailyStreak(streak, today, challenge.id)
    setStreak(next)
    const source = await saveDailyStreak(next)
    setSaving(false)
    toast.success(
      next.streakCount === 1 ? "Streak started" : `${next.streakCount} day streak`,
      {
        description:
          source === "supabase"
            ? "Saved to your account."
            : "Saved in this browser. Sign in to sync.",
      }
    )
  }

  return (
    <section className="rounded-2xl border border-indigo-500/20 bg-card shadow-sm ring-1 ring-foreground/5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 px-4 py-3 sm:px-5">
        <div>
          <p className="font-heading text-base font-semibold">Daily Challenge</p>
          <p className="text-xs text-muted-foreground">
            One quick-fire scenario. Same prompt until midnight, then a new draw.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{challenge.topic}</Badge>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm font-medium",
              streak.streakCount > 0
                ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                : "border-border text-muted-foreground"
            )}
            aria-label={`Daily streak ${ready ? streak.streakCount : 0} days`}
          >
            <FlameIcon
              className={cn(
                "size-4",
                streak.streakCount > 0 && "fill-amber-500 text-amber-500"
              )}
            />
            <span className="font-mono">
              {ready ? streak.streakCount : "—"}
            </span>
            <span className="text-xs font-normal">
              {streak.streakCount === 1 ? "day" : "day streak"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="[perspective:1280px]">
          <div
            className={cn(
              "grid transition-transform duration-500 [transform-style:preserve-3d]",
              flipped && "[transform:rotateY(180deg)]"
            )}
          >
            <div
              className={cn(
                "col-start-1 row-start-1 flex flex-col gap-4 [backface-visibility:hidden]",
                flipped && "pointer-events-none"
              )}
            >
              <p className="font-heading text-lg font-medium leading-snug">
                {challenge.prompt}
              </p>

              {challenge.kind === "mcq" && challenge.options ? (
                <div className="grid gap-2" role="radiogroup" aria-label="Daily challenge options">
                  {challenge.options.map((option) => {
                    const selected = choice === option
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setChoice(option)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                          selected
                            ? "border-indigo-500/50 bg-indigo-500/10"
                            : "border-border hover:border-indigo-400/40 hover:bg-muted/60"
                        )}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="daily-challenge-answer">Your answer</Label>
                  <Input
                    id="daily-challenge-answer"
                    value={choice}
                    onChange={(event) => setChoice(event.target.value)}
                    placeholder="Type a locator, status, or keyword"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        void reveal()
                      }
                    }}
                  />
                </div>
              )}

              <div className="mt-auto">
                <Button
                  type="button"
                  onClick={() => void reveal()}
                  disabled={saving}
                >
                  <SparklesIcon data-icon="inline-start" />
                  Reveal Answer
                </Button>
              </div>
            </div>

            <div
              className={cn(
                "col-start-1 row-start-1 flex flex-col gap-3 [backface-visibility:hidden] [transform:rotateY(180deg)]",
                !flipped && "pointer-events-none"
              )}
            >
              <p className="text-xs font-medium tracking-wide text-indigo-500 uppercase">
                {correct ? "Nice — that matches" : "Answer"}
              </p>
              <p className="font-heading text-xl font-semibold">{challenge.answer}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {challenge.explanation}
              </p>
              {answeredToday ? (
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Today already counts toward your streak.
                </p>
              ) : null}
              <div className="mt-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFlipped(false)}
                >
                  <RotateCcwIcon data-icon="inline-start" />
                  Back to question
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
