import { expect, test } from "@playwright/test"

import { AUTH_STATE_PATH, isAuthEnabled } from "../playwright/auth"

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

  test("home sends signed-out visitors to sign up, not into the app", async ({
    page,
  }) => {
    await page.goto("/")

    await expect(
      page.getByRole("link", { name: "Create account" })
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: /Start Learning Free/i })
    ).toBeVisible()

    // Nothing on the page links into a gated route.
    await expect(page.locator("#features article a")).toHaveCount(0)
    await expect(page.getByRole("link", { name: /^View / })).toHaveCount(0)
  })

  test("home previews what a sign-in unlocks", async ({ page }) => {
    await page.goto("/")

    const features = page.locator("#features")
    await expect(
      features.getByRole("heading", { name: /What you unlock when you sign in/i })
    ).toBeVisible()

    for (const name of [
      /Every track, start to finish/i,
      /Your progress dashboard/i,
      /A skill tree that gates itself/i,
      /Daily challenge/i,
      /The Sandbox/i,
      /Live playgrounds/i,
      /AI mock interviewer/i,
      /Capstone and certificate/i,
    ]) {
      await expect(features.getByRole("heading", { name })).toBeVisible()
    }

    // The cards describe the app rather than linking into it.
    await expect(features.locator("article a")).toHaveCount(0)

    // The curriculum now lives here as a card, listing every track by name.
    const curriculumCard = features.locator("article", {
      hasText: "Every track, start to finish",
    })
    await expect(curriculumCard.getByText("Interview Prep")).toBeVisible()
    await expect(curriculumCard.getByText("Next-Gen QA")).toBeVisible()
    await expect(curriculumCard.getByText(/lessons?$/).first()).toBeVisible()

    // Counts are derived from the curriculum, so they should never render empty.
    await expect(page.getByText("Guided lessons")).toBeVisible()
    await expect(
      page.getByRole("link", { name: /Create a free account/i })
    ).toBeVisible()
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
})

test.describe("signed-out visitors", () => {
  test("dashboard matches the auth configuration", async ({ page }) => {
    await page.goto("/dashboard")
    if (isAuthEnabled()) {
      await expect(page).toHaveURL(/\/login/)
      await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()
      return
    }

    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible()
  })

  test("mock server matches the auth configuration", async ({ page }) => {
    await page.goto("/mock-server")
    if (isAuthEnabled()) {
      await expect(page).toHaveURL(/\/login/)
      await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()
      return
    }

    await expect(page).toHaveURL(/\/mock-server/)
  })

  test("a gated deep link is preserved for after sign-in", async ({ page }) => {
    await page.goto("/courses/foundation/istqb")
    if (isAuthEnabled()) {
      await expect(page).toHaveURL(
        `/login?next=${encodeURIComponent("/courses/foundation/istqb")}`
      )
      await expect(
        page.getByRole("link", { name: "Create an account" })
      ).toHaveAttribute(
        "href",
        `/signup?next=${encodeURIComponent("/courses/foundation/istqb")}`
      )
      return
    }

    await expect(page).toHaveURL(/\/courses\/foundation\/istqb/)
    await expect(
      page.getByRole("heading", { name: "ISTQB Foundation" })
    ).toBeVisible()
  })
})

test.describe("signed-in session", () => {
  test.use({ storageState: AUTH_STATE_PATH })

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
