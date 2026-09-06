import { expect, test } from "@playwright/test"

import { AUTH_STATE_PATH } from "../playwright/auth"

test.describe("sandbox", () => {
  test.use({ storageState: AUTH_STATE_PATH })

  test("QA Mode drawer is always available and outlines seeded defects", async ({
    page,
  }) => {
    await page.goto("/sandbox")
    // The button is labelled "Open QA Mode" and gains ", currently on" once the
    // highlighting is active, so match the part that does not move.
    const qaMode = page.getByRole("button", { name: /^Open QA Mode/ })
    await expect(qaMode).toBeVisible()

    await qaMode.click()
    await expect(
      page.getByRole("heading", { name: "Instructor QA Mode" })
    ).toBeVisible()
    await expect(
      page.getByRole("switch", { name: "Highlight seeded defects" })
    ).toBeChecked()
    await expect(page.getByText("QA Mode is on")).toBeVisible()
    await expect(page.getByText("BUG-01 · Submit button overlaps CVC")).toBeVisible()
    await expect(page.getByText("BUG-02 · Blank email can be submitted")).toBeVisible()
    await expect(page.getByText("BUG-03 · Promo code stacks on every apply")).toBeVisible()
  })

  test("seeded defects still execute: stacking, HTML email required, mobile overlap class", async ({
    page,
  }) => {
    await page.goto("/sandbox")

    await page.getByLabel("Discount code").fill("SAVE20")
    await page.getByRole("button", { name: "Apply" }).click()
    await page.getByRole("button", { name: "Apply" }).click()
    await expect(page.getByText("SAVE20 applied. (2 times)")).toBeVisible()
    await expect(page.locator('[data-sandbox-total="true"]')).toHaveText("$51.60")

    await expect(page.getByLabel("Email")).toHaveAttribute("required", "")

    await page.setViewportSize({ width: 375, height: 800 })
    const submit = page.getByRole("button", { name: "Submit order" })
    await expect(submit).toHaveAttribute("data-sandbox-defect", "visual-overlap")
  })

  test("bug report validates fields and credits a matching stacking write-up", async ({
    page,
  }) => {
    await page.goto("/sandbox")
    await page.getByRole("button", { name: "Report Bug" }).click()
    await page.getByRole("button", { name: "Submit report" }).click()
    await expect(page.getByRole("alert").filter({ hasText: "Choose a bug category." })).toBeVisible()

    await page.getByLabel("Bug category").click()
    await page.getByRole("option", { name: "Calculation / pricing" }).click()
    await page.getByLabel("Where did you observe it?").click()
    await page.getByRole("option", { name: "Order summary — promo code" }).click()
    await page.getByLabel("Steps to reproduce").fill(
      "Apply SAVE20 once, then apply SAVE20 a second time on the promo field."
    )
    await page.getByLabel("Expected result").fill(
      "The 20% discount should apply only once and not stack."
    )
    await page.getByLabel("Actual result").fill(
      "The second apply stacks another 20% and the total drops to $51.60."
    )
    await page.getByRole("button", { name: "Submit report" }).click()

    await expect(page.getByText(/Bug Resolved: Promo code stacks/i)).toBeVisible()
    await expect(page.getByText(/Nice catch/i)).toBeVisible()
  })
})
