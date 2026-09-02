export type QuizQuestion = {
  question: string
  options: string[]
  /** Zero-based index, or the exact option text */
  correctAnswer: number | string
  explanation: string
}

export type QuizProps = {
  questions: QuizQuestion[] | string[]
  options?: string[][]
  answers?: Array<number | string>
  correctAnswers?: Array<number | string>
  explanations?: string[]
  title?: string
  category?: string
  lessonId?: string
  passingScore?: number
}

export function normalizeQuizQuestions(props: QuizProps): QuizQuestion[] {
  const { questions, options, answers, correctAnswers, explanations } = props

  if (questions.length === 0) {
    return []
  }

  if (typeof questions[0] === "string") {
    return (questions as string[]).map((question, index) => ({
      question,
      options: options?.[index] ?? [],
      correctAnswer: (correctAnswers ?? answers)?.[index] ?? 0,
      explanation: explanations?.[index] ?? "",
    }))
  }

  return questions as QuizQuestion[]
}

export function correctOptionIndex(question: QuizQuestion) {
  if (typeof question.correctAnswer === "number") {
    return question.correctAnswer
  }

  return question.options.findIndex((option) => option === question.correctAnswer)
}

export function scoreQuiz(
  questions: QuizQuestion[],
  selected: Array<number | null>
) {
  const answered = questions.map((question, index) => {
    const correct = correctOptionIndex(question)
    return selected[index] === correct
  })
  const correctCount = answered.filter(Boolean).length
  const percent =
    questions.length === 0
      ? 0
      : Math.round((correctCount / questions.length) * 100)

  return { correctCount, percent, answered }
}
