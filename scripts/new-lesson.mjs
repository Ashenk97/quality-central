#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const contentDir = path.join(root, "content")
const templatePath = path.join(contentDir, "_templates", "lesson.mdx")

const TRACK_BY_CATEGORY = {
  foundation: "manual",
  "api-testing": "api",
  "ui-automation": "automation",
}

const DIFFICULTY_BY_CATEGORY = {
  foundation: "beginner",
  "api-testing": "intermediate",
  "ui-automation": "intermediate",
}

const SLUG = /^[a-z0-9-]+$/

function fail(message) {
  console.error(message)
  process.exit(1)
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function nextOrder(categoryDir) {
  if (!fs.existsSync(categoryDir)) {
    return 1
  }

  const orders = fs
    .readdirSync(categoryDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(categoryDir, file), "utf8")
      const match = raw.match(/^order:\s*(\d+)/m)
      return match ? Number.parseInt(match[1], 10) : 0
    })

  return (orders.length ? Math.max(...orders) : 0) + 1
}

function render(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) {
      fail(`Template placeholder {{${key}}} has no value`)
    }
    return String(values[key])
  })
}

const [, , category, lessonId, ...titleParts] = process.argv

if (!category || !lessonId) {
  fail(
    "Usage: node scripts/new-lesson.mjs <category> <lessonId> [title]\n" +
      "Categories: foundation | api-testing | ui-automation"
  )
}

if (!SLUG.test(category) || !SLUG.test(lessonId)) {
  fail("category and lessonId must be lowercase slugs (a-z, 0-9, hyphen).")
}

const track = TRACK_BY_CATEGORY[category]
if (!track) {
  fail(
    `Unknown category "${category}". Expected ${Object.keys(TRACK_BY_CATEGORY).join(", ")}.`
  )
}

if (!fs.existsSync(templatePath)) {
  fail(`Missing template at ${path.relative(root, templatePath)}`)
}

const categoryDir = path.join(contentDir, category)
const dest = path.join(categoryDir, `${lessonId}.mdx`)

if (fs.existsSync(dest)) {
  fail(`Lesson already exists: ${path.relative(root, dest)}`)
}

const title = titleParts.join(" ").trim() || titleFromSlug(lessonId)
const template = fs.readFileSync(templatePath, "utf8")
const body = render(template, {
  title,
  description: `${title} — replace this description.`,
  category,
  lessonId,
  track,
  order: nextOrder(categoryDir),
  difficulty: DIFFICULTY_BY_CATEGORY[category],
  readingTime: 8,
})

fs.mkdirSync(categoryDir, { recursive: true })
fs.writeFileSync(dest, body, "utf8")

console.log(`Created ${path.relative(root, dest)}`)
console.log(
  "Next: add the topic to lib/curriculum.ts and seed public.modules if you persist progress."
)
