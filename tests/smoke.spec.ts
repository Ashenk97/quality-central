import { expect, test, type Page } from "@playwright/test"

import { AUTH_STATE_PATH, isAuthEnabled } from "../playwright/auth"

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

test.describe("signed-out visitors", () => {
  test("every learning route matches the auth configuration", async ({
    page,
  }) => {
    const routes = [
      ["/dashboard", null],
      ["/foundation", "/foundation"],
      ["/api-testing", "/api-testing"],
      ["/technical-core", "/technical-core"],
      ["/ui-automation", "/ui-automation"],
      ["/interview-prep", "/interview-prep"],
      ["/next-gen", "/next-gen"],
      ["/capstone", "/capstone"],
      ["/sandbox", "/sandbox"],
      ["/mock-server", "/mock-server"],
      ["/certificate", "/certificate"],
    ] as const

    if (isAuthEnabled()) {
      for (const [path, next] of routes) {
        await expectGated(page, path, next)
      }
      return
    }

    for (const [path] of routes) {
      await page.goto(path)
      const url = new URL(page.url())
      expect(url.pathname, `${path} should stay open without auth`).toBe(path)
    }
  })

  test("lessons and playgrounds match the auth configuration", async ({
    page,
  }) => {
    const routes = [
      "/courses/foundation/istqb",
      "/api-testing/playground",
      "/ui-automation/playground",
    ]

    if (isAuthEnabled()) {
      for (const path of routes) {
        await expectGated(page, path)
      }
      return
    }

    for (const path of routes) {
      await page.goto(path)
      expect(new URL(page.url()).pathname).toBe(path)
    }
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

test.describe("signed-in session", () => {
  test.use({ storageState: AUTH_STATE_PATH })

  test("sandbox loads without uncaught exceptions", async ({ page }) => {
    await gotoWithoutUncaughtExceptions(page, "/sandbox")
    await expect(page).toHaveURL(/\/sandbox/)
    await expect(page.getByRole("heading", { name: "The Sandbox" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Send Feedback" })).toBeVisible()
  })
})
