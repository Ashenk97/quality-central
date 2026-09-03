export type QuizQuestion = {
  question: string
  options: string[]
  /** Zero-based index, or the exact option text */
  correctAnswer: number | string
  explanation: string
}

export type QuizProps = {
  questions?: QuizQuestion[] | string[]
  /** Single-question authoring: used when `questions` is omitted */
  question?: string
  options?: string[] | string[][]
  correctIndex?: number
  explanation?: string
  answers?: Array<number | string>
  correctAnswers?: Array<number | string>
  explanations?: string[]
  title?: string
  category?: string
  lessonId?: string
  passingScore?: number
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}

export function normalizeQuizQuestions(props: QuizProps): QuizQuestion[] {
  const {
    questions,
    question,
    options,
    correctIndex,
    explanation,
    answers,
    correctAnswers,
    explanations,
  } = props
  const normalized: QuizQuestion[] = []

  if (typeof question === "string" && question.trim()) {
    normalized.push({
      question,
      options: isStringList(options) ? options : [],
      correctAnswer: correctIndex ?? 0,
      explanation: explanation ?? "",
    })
  }

  if (!questions || questions.length === 0) {
    return normalized
  }

  if (typeof questions[0] === "string") {
    const optionMatrix = Array.isArray(options) && Array.isArray(options[0])
      ? (options as string[][])
      : []

    normalized.push(
      ...(questions as string[]).map((item, index) => ({
        question: item,
        options: optionMatrix[index] ?? [],
        correctAnswer: (correctAnswers ?? answers)?.[index] ?? 0,
        explanation: explanations?.[index] ?? "",
      }))
    )
    return normalized
  }

  normalized.push(...(questions as QuizQuestion[]))
  return normalized
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
