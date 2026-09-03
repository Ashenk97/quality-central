import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"

import { getCurrentUser } from "@/lib/auth/session"
import { isAiGatewayConfigured } from "@/lib/env"
import {
  getInterviewQuestion,
  MOCK_INTERVIEW_SYSTEM_PROMPT,
} from "@/lib/mock-interview"

export const maxDuration = 30

const MAX_MESSAGES = 16
const MAX_ANSWER_CHARS = 4000

type ChatBody = {
  messages?: unknown
  questionId?: unknown
}

function jsonError(status: number, message: string) {
  return Response.json({ error: message }, { status })
}

function isUiMessage(value: unknown): value is UIMessage {
  if (!value || typeof value !== "object") {
    return false
  }
  const message = value as UIMessage
  return (
    (message.role === "user" || message.role === "assistant") &&
    Array.isArray(message.parts)
  )
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return jsonError(401, "Sign in to practice interviews.")
  }

  if (!isAiGatewayConfigured()) {
    return jsonError(
      503,
      "AI Gateway is not configured. Add AI_GATEWAY_API_KEY locally, or enable AI Gateway on the Vercel project."
    )
  }

  let body: ChatBody
  try {
    body = (await request.json()) as ChatBody
  } catch {
    return jsonError(400, "Body must be JSON.")
  }

  const questionId = typeof body.questionId === "string" ? body.questionId : ""
  const question = getInterviewQuestion(questionId)
  if (!question) {
    return jsonError(400, "Unknown interview question.")
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return jsonError(400, "messages is required.")
  }

  if (body.messages.length > MAX_MESSAGES) {
    return jsonError(400, "This interview turn is too long. Start a new question.")
  }

  if (!body.messages.every(isUiMessage)) {
    return jsonError(400, "messages must be chat turns.")
  }

  const messages = body.messages
  const last = messages[messages.length - 1]
  if (!last || last.role !== "user") {
    return jsonError(400, "The last message must be the candidate answer.")
  }

  const answerLength = last.parts
    .filter((part) => part.type === "text")
    .reduce((sum, part) => sum + (part.type === "text" ? part.text.length : 0), 0)

  if (answerLength === 0) {
    return jsonError(400, "Answer cannot be empty.")
  }

  if (answerLength > MAX_ANSWER_CHARS) {
    return jsonError(400, "Answer is too long.")
  }

  const result = streamText({
    model: "openai/gpt-5.4-mini",
    instructions: `${MOCK_INTERVIEW_SYSTEM_PROMPT}

Assigned question (${question.topic}): ${question.prompt}`,
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
