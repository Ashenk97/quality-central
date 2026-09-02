"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { CheckIcon, CircleHelpIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  correctOptionIndex,
  normalizeQuizQuestions,
  scoreQuiz,
  type QuizProps,
} from "@/lib/quiz"
import { useProgress } from "@/lib/progress"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export type { QuizProps, QuizQuestion } from "@/lib/quiz"

export function Quiz(props: QuizProps) {
  const questions = normalizeQuizQuestions(props)
  const params = useParams<{ category?: string; lessonId?: string }>()
  const category = props.category ?? params.category
  const lessonId = props.lessonId ?? params.lessonId
  const passingScore = props.passingScore ?? 70
  const { saveQuizScore, getQuizScore } = useProgress()

  const [selected, setSelected] = useState<Array<number | null>>(
    () => questions.map(() => null)
  )
  const [submitted, setSubmitted] = useState(false)

  const savedScore =
    category && lessonId ? getQuizScore(category, lessonId) : null
  const result = submitted ? scoreQuiz(questions, selected) : null
  const allAnswered = selected.every((value) => value !== null)

  function submit() {
    const scored = scoreQuiz(questions, selected)
    setSubmitted(true)
    if (category && lessonId) {
      saveQuizScore(category, lessonId, scored.percent)
    }
    if (scored.percent >= passingScore) {
      toast.success(`Quiz passed · ${scored.percent}%`, {
        description: `${scored.correctCount} of ${questions.length} correct.`,
      })
    } else {
      toast.warning(`Score ${scored.percent}%`, {
        description: `Passing score is ${passingScore}%. Try again when you are ready.`,
      })
    }
  }

  function retry() {
    setSelected(questions.map(() => null))
    setSubmitted(false)
  }

  if (questions.length === 0) {
    return null
  }

  return (
    <section className="my-8 overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b bg-card px-4 py-3">
        <div>
          <p className="font-heading text-sm font-semibold">
            {props.title ?? "Knowledge check"}
          </p>
          <p className="text-xs text-muted-foreground">
            {questions.length} question{questions.length === 1 ? "" : "s"} ·
            passing score {passingScore}%
          </p>
        </div>
        {savedScore != null ? (
          <p className="font-mono text-xs text-muted-foreground">
            Last score {savedScore}%
          </p>
        ) : null}
      </div>

      <div className="space-y-6 bg-background px-4 py-5">
        {questions.map((question, questionIndex) => {
          const correctIndex = correctOptionIndex(question)
          const choice = selected[questionIndex]
          const showResult = submitted && choice !== null

          return (
            <fieldset key={question.question} className="space-y-3">
              <legend className="font-medium text-foreground">
                {questionIndex + 1}. {question.question}
              </legend>
              <div className="grid gap-2">
                {question.options.map((option, optionIndex) => {
                  const isSelected = choice === optionIndex
                  const isCorrect = optionIndex === correctIndex
                  const showCorrect = showResult && isCorrect
                  const showWrong = showResult && isSelected && !isCorrect

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={submitted}
                      onClick={() => {
                        setSelected((current) => {
                          const next = [...current]
                          next[questionIndex] = optionIndex
                          return next
                        })
                      }}
                      className={cn(
                        "flex items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-all duration-200",
                        isSelected &&
                          !submitted &&
                          "border-primary/50 bg-primary/5 shadow-sm",
                        !isSelected &&
                          !submitted &&
                          "border-border hover:border-primary/30 hover:bg-muted/60",
                        showCorrect &&
                          "border-success/50 bg-success/10 text-foreground",
                        showWrong &&
                          "border-destructive/50 bg-destructive/10 text-foreground",
                        submitted && "cursor-default"
                      )}
                      aria-pressed={isSelected}
                    >
                      <span className="mt-0.5 size-4 shrink-0">
                        {showCorrect ? (
                          <CheckIcon className="size-4" />
                        ) : showWrong ? (
                          <XIcon className="size-4" />
                        ) : (
                          <span
                            className={cn(
                              "mt-0.5 block size-3.5 rounded-full border",
                              isSelected
                                ? "border-foreground bg-foreground"
                                : "border-muted-foreground/50"
                            )}
                          />
                        )}
                      </span>
                      <span>{option}</span>
                    </button>
                  )
                })}
              </div>
              {showResult ? (
                <p className="flex gap-2 text-sm text-muted-foreground">
                  <CircleHelpIcon className="mt-0.5 size-4 shrink-0" />
                  <span>
                    <span className="font-medium text-foreground">
                      {choice === correctIndex ? "Correct. " : "Not quite. "}
                    </span>
                    {question.explanation}
                  </span>
                </p>
              ) : null}
            </fieldset>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-card px-4 py-3">
        {result ? (
          <p className="text-sm">
            Score{" "}
            <span className="font-mono font-medium">{result.percent}%</span>
            <span
              className={
                result.percent >= passingScore
                  ? "text-success"
                  : "text-warning"
              }
            >
              {" "}
              ({result.correctCount}/{questions.length})
              {result.percent >= passingScore ? " · Passed" : " · Try again"}
            </span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Choose an answer for each question, then check your work.
          </p>
        )}
        {submitted ? (
          <Button
            variant="outline"
            onClick={retry}
            className="transition-transform duration-200 active:scale-[0.97]"
          >
            Retry quiz
          </Button>
        ) : (
          <Button
            onClick={submit}
            disabled={!allAnswered}
            className="transition-transform duration-200 active:scale-[0.97]"
          >
            Check answers
          </Button>
        )}
      </div>
    </section>
  )
}

export default Quiz
