import { expect, test, type Page } from "@playwright/test"

// The app only enforces auth when Supabase is configured; without it there is no
// sign-in to complete, so every route stays open (see proxy.ts).
const AUTH_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
)

async function gotoWithoutUncaughtExceptions(page: Page, path: string) {
  const uncaught: string[] = []
  page.on("pageerror", (error) => {
    uncaught.push(error.stack ?? error.message)
  })

  const response = await page.goto(path, { waitUntil: "domcontentloaded" })
  await page.waitForLoadState("load")

  expect(response, `Expected a response for ${path}`).toBeTruthy()
  expect(
    response!.status(),
    `${path} returned HTTP ${response!.status()}`
  ).toBeLessThan(500)
  await expect(page.locator("body")).toBeVisible()
  expect(uncaught, uncaught.join("\n\n")).toEqual([])

  return response
}

async function expectGated(
  page: Page,
  path: string,
  expectedNext: string | null = path
) {
  await page.goto(path)
  const url = new URL(page.url())
  expect(url.pathname, `${path} should redirect to the login screen`).toBe(
    "/login"
  )
  expect(url.searchParams.get("next")).toBe(expectedNext)
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()
}

test.describe("core routing smoke", () => {
  test("landing page loads without uncaught exceptions", async ({ page }) => {
    await gotoWithoutUncaughtExceptions(page, "/")
    await expect(page).toHaveURL("/")
    await expect(
      page.getByRole("heading", {
        name: /Write tests that survive production/i,
      })
    ).toBeVisible()
  })

  test("dashboard route loads without uncaught exceptions", async ({ page }) => {
    await gotoWithoutUncaughtExceptions(page, "/dashboard")
    await expect(page).toHaveURL(/\/(dashboard|login)/)
    await expect(
      page.getByRole("heading", { name: /Dashboard|Sign in/i })
    ).toBeVisible()
  })

  test("mock server route redirects or loads without a 500", async ({
    page,
  }) => {
    const response = await page.goto("/mock-server", {
      waitUntil: "domcontentloaded",
    })
    expect(response?.status() ?? 200).toBeLessThan(500)
    await expect(page).toHaveURL(/\/(mock-server|login)/)
  })

  test("unknown custom mock slug returns 404", async ({ request }) => {
    const response = await request.get("/api/custom-mock/does-not-exist-qc")
    expect([404, 503]).toContain(response.status())
  })

  test("chat API rejects anonymous interview turns", async ({ request }) => {
    const response = await request.post("/api/chat", {
      data: { messages: [], questionId: "vending-machine" },
    })
    expect(response.status()).toBe(401)
  })
})

test.describe("signed-out visitors are gated", () => {
  test.skip(
    !AUTH_ENABLED,
    "Supabase is not configured, so the app runs without auth"
  )

  test("every learning route redirects to login", async ({ page }) => {
    await expectGated(page, "/dashboard", null)
    await expectGated(page, "/foundation")
    await expectGated(page, "/api-testing")
    await expectGated(page, "/technical-core")
    await expectGated(page, "/ui-automation")
    await expectGated(page, "/interview-prep")
    await expectGated(page, "/next-gen")
    await expectGated(page, "/capstone")
    await expectGated(page, "/sandbox")
    await expectGated(page, "/mock-server")
    await expectGated(page, "/certificate")
  })

  test("lessons and playgrounds redirect to login", async ({ page }) => {
    await expectGated(page, "/courses/foundation/istqb")
    await expectGated(page, "/api-testing/playground")
    await expectGated(page, "/ui-automation/playground")
  })

  test("landing page stays public", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL("/")
    await expect(
      page.getByRole("heading", {
        name: /Write tests that survive production/i,
      })
    ).toBeVisible()
  })
})

test.describe("open app when auth is not configured", () => {
  test.skip(AUTH_ENABLED, "Supabase is configured, so routes require a session")

  test("sandbox loads without uncaught exceptions", async ({ page }) => {
    await gotoWithoutUncaughtExceptions(page, "/sandbox")
    await expect(page).toHaveURL(/\/sandbox/)
    await expect(page.getByRole("heading", { name: "The Sandbox" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Send Feedback" })).toBeVisible()
  })
})
