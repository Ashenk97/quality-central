import { expect, test } from "@playwright/test"

test.describe("smoke", () => {
  test("home introduces the learning hub", async ({ page }) => {
    await page.goto("/")
    await expect(
      page.getByRole("heading", { name: /Zero to Advanced QA Engineering/i })
    ).toBeVisible()
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible()
  })

  test("login offers email and GitHub", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Continue with GitHub" })
    ).toBeVisible()
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByLabel("Password")).toBeVisible()
  })

  test("signup page is available", async ({ page }) => {
    await page.goto("/signup")
    await expect(
      page.getByRole("heading", { name: "Create an account" })
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Create account" })
    ).toBeVisible()
  })

  test("dashboard redirects unauthenticated users to login", async ({
    page,
  }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()
  })

  test("sandbox hunter is reachable", async ({ page }) => {
    await page.goto("/sandbox")
    await expect(page.getByRole("heading", { name: "The Sandbox" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Report Bug" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Send Feedback" })).toBeVisible()
  })

  test("API playground loads", async ({ page }) => {
    await page.goto("/api-testing/playground")
    await expect(
      page.getByRole("heading", { name: "API Playground" })
    ).toBeVisible()
    await expect(page.getByRole("button", { name: "Send" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Send Feedback" })).toHaveCount(0)
  })

  test("lesson page offers Send Feedback", async ({ page }) => {
    await page.goto("/courses/foundation/istqb")
    await expect(
      page.getByRole("heading", { name: "ISTQB Foundation" })
    ).toBeVisible()
    await expect(page.getByRole("button", { name: "Send Feedback" })).toBeVisible()
  })
})
