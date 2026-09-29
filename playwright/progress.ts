import type { Page } from "@playwright/test"

import { getAllTopics, parseCourseHref } from "@/lib/curriculum"

import { isAuthEnabled } from "./auth"

const STORAGE_KEY = "quality-central.user_progress"

function allLessons() {
  return getAllTopics().flatMap((topic) => {
    const parsed = parseCourseHref(topic.href)
    return parsed ? [parsed] : []
  })
}

/** Makes the learner read as brand new for this page only. */
export async function startWithNoProgress(page: Page) {
  await page.addInitScript(
    (key) => window.localStorage.removeItem(key),
    STORAGE_KEY
  )

  if (!isAuthEnabled()) {
    return
  }

  await page.route("**/rest/v1/user_progress?*", async (route) => {
    if (route.request().method() !== "GET") {
      return route.fallback()
    }
    await route.fulfill({ json: [] })
  })
}

/**
 * Makes every lesson read as complete for this page only, so specs can open
 * modules that sit behind the curriculum's lock order. The test account's
 * stored progress is never written.
 */
export async function unlockAllLessons(page: Page) {
  const completedAt = new Date(0).toISOString()
  const lessons = allLessons()

  if (!isAuthEnabled()) {
    const entries = Object.fromEntries(
      lessons.map(({ category, lessonId }) => [
        `${category}/${lessonId}`,
        {
          moduleSlug: `${category}/${lessonId}`,
          completed: true,
          completedAt,
          quizScore: null,
        },
      ])
    )
    await page.addInitScript(
      ([key, value]) => window.localStorage.setItem(key, value),
      [STORAGE_KEY, JSON.stringify(entries)] as const
    )
    return
  }

  await page.route("**/rest/v1/user_progress?*", async (route) => {
    if (route.request().method() !== "GET") {
      return route.fallback()
    }
    await route.fulfill({
      json: lessons.map(({ category, lessonId }) => ({
        completed: true,
        completed_at: completedAt,
        quiz_score: null,
        modules: { category, lesson_id: lessonId },
      })),
    })
  })
}
