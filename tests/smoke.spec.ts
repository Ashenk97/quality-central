import { expect, test, type Page } from "@playwright/test"

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

test.describe("core routing smoke", () => {
  test("landing page loads without uncaught exceptions", async ({ page }) => {
    await gotoWithoutUncaughtExceptions(page, "/")
    await expect(page).toHaveURL("/")
    await expect(
      page.getByRole("heading", { name: /Zero to Advanced QA Engineering/i })
    ).toBeVisible()
  })

  test("dashboard route loads without uncaught exceptions", async ({ page }) => {
    await gotoWithoutUncaughtExceptions(page, "/dashboard")
    await expect(page).toHaveURL(/\/(dashboard|login)/)
    await expect(
      page.getByRole("heading", { name: /Dashboard|Sign in/i })
    ).toBeVisible()
  })

  test("sandbox loads without uncaught exceptions", async ({ page }) => {
    await gotoWithoutUncaughtExceptions(page, "/sandbox")
    await expect(page).toHaveURL(/\/sandbox/)
    await expect(page.getByRole("heading", { name: "The Sandbox" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Send Feedback" })).toBeVisible()
  })
})
