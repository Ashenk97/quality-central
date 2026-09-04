import { expect, test } from "@playwright/test"

test.describe("smoke", () => {
  test("home introduces the learning hub", async ({ page }) => {
    await page.goto("/")
    await expect(
      page.getByRole("heading", {
        name: /Write tests that survive production/i,
      })
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

  test("mock server redirects unauthenticated users to login", async ({
    page,
  }) => {
    await page.goto("/mock-server")
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()
  })

  test("unknown custom mock slug returns 404", async ({ request }) => {
    const response = await request.get("/api/custom-mock/does-not-exist-qc")
    expect([404, 503]).toContain(response.status())
  })

  test("stripe webhook stays hidden when monetization is off", async ({
    request,
  }) => {
    const response = await request.post("/api/webhooks/stripe", {
      data: { type: "checkout.session.completed" },
      headers: { "stripe-signature": "t=1,v1=test" },
    })
    expect(response.status()).toBe(404)
  })

  test("chat API requires a signed-in user", async ({ request }) => {
    const response = await request.post("/api/chat", {
      data: { messages: [], questionId: "vending-machine" },
    })
    expect(response.status()).toBe(401)
  })

  test("lesson page offers Send Feedback", async ({ page }) => {
    await page.goto("/courses/foundation/istqb")
    await expect(
      page.getByRole("heading", { name: "ISTQB Foundation" })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Error, defect, failure" })
    ).toBeVisible()
    await expect(page.getByRole("button", { name: "Send Feedback" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Discussion" })).toBeVisible()
    await expect(
      page
        .getByRole("link", { name: "Sign in to join the discussion" })
        .or(page.getByRole("button", { name: "Post question" }))
    ).toBeVisible()
  })
})
