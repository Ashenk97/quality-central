import "server-only"

import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"

import type { Track } from "@/lib/db/types"

const CONTENT_DIR = path.join(process.cwd(), "content")
const SLUG_PATTERN = /^[a-z0-9-]+$/

export type LessonFrontmatter = {
  title: string
  description: string
  category: string
  lessonId: string
  track: Track
  order: number
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
    description: frontmatter.description,
    category: frontmatter.category ?? category,
    lessonId: frontmatter.lessonId ?? lessonId,
    track: frontmatter.track,
    order: frontmatter.order ?? 0,
    content,
  }
}

export function getAllLessons(): Lesson[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return []
  }

  const categories = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && isSafeSlug(entry.name))

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
