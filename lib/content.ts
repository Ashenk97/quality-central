import "server-only"

import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"

import type { Difficulty } from "@/lib/curriculum"
import type { Track } from "@/lib/db/types"

const CONTENT_DIR = path.join(process.cwd(), "content")
const SLUG_PATTERN = /^[a-z0-9-]+$/
const WORDS_PER_MINUTE = 200

export type LessonFrontmatter = {
  title: string
  description: string
  category: string
  lessonId: string
  track: Track
  order: number
  difficulty?: Difficulty
  readingTime?: number
  /** Alias for difficulty in beginner lesson files */
  level?: Difficulty | string
  /** Alias for readingTime, in minutes */
  estimatedTime?: number | string
}

export type Lesson = LessonFrontmatter & {
  content: string
}

function isSafeSlug(value: string) {
  return SLUG_PATTERN.test(value)
}

function lessonPath(category: string, lessonId: string) {
  return path.join(CONTENT_DIR, category, `${lessonId}.mdx`)
}

function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

function parseReadingTime(value: unknown, content: string) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.round(value)
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed
    }
  }

  return estimateReadingTime(content)
}

function parseCategory(value: unknown, fallback: string) {
  if (typeof value === "string" && value.trim()) {
    return value.trim().toLowerCase().replace(/\s+/g, "-")
  }

  return fallback
}

function parseDifficulty(value: unknown): Difficulty | undefined {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()
    if (
      normalized === "beginner" ||
      normalized === "intermediate" ||
      normalized === "advanced"
    ) {
      return normalized
    }
  }

  return undefined
}

export function getLesson(
  category: string,
  lessonId: string
): Lesson | null {
  if (!isSafeSlug(category) || !isSafeSlug(lessonId)) {
    return null
  }

  const filePath = lessonPath(category, lessonId)
  const resolved = path.resolve(filePath)

  if (!resolved.startsWith(path.resolve(CONTENT_DIR))) {
    return null
  }

  if (!fs.existsSync(resolved)) {
    return null
  }

  const raw = fs.readFileSync(resolved, "utf8")
  const { data, content } = matter(raw)
  const frontmatter = data as LessonFrontmatter

  return {
    title: frontmatter.title,
    description: frontmatter.description ?? frontmatter.title,
    category: parseCategory(frontmatter.category, category),
    lessonId: frontmatter.lessonId ?? lessonId,
    track: frontmatter.track ?? "manual",
    order: frontmatter.order ?? 0,
    difficulty: parseDifficulty(
      frontmatter.difficulty ?? frontmatter.level
    ),
    readingTime: parseReadingTime(
      frontmatter.readingTime ?? frontmatter.estimatedTime,
      content
    ),
    content,
  }
}

export function getAllLessons(): Lesson[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return []
  }

  const categories = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        isSafeSlug(entry.name) &&
        !entry.name.startsWith("_")
    )

  const lessons: Lesson[] = []

  for (const category of categories) {
    const files = fs
      .readdirSync(path.join(CONTENT_DIR, category.name))
      .filter((file) => file.endsWith(".mdx"))

    for (const file of files) {
      const lessonId = file.replace(/\.mdx$/, "")
      const lesson = getLesson(category.name, lessonId)
      if (lesson) {
        lessons.push(lesson)
      }
    }
  }

  return lessons.sort((a, b) => a.order - b.order)
}

export function getLessonParams() {
  return getAllLessons().map((lesson) => ({
    category: lesson.category,
    lessonId: lesson.lessonId,
  }))
}
