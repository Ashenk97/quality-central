import { expect, test as setup } from "@playwright/test"

import {
  AUTH_STATE_PATH,
  getE2EUser,
  isAuthEnabled,
  writeEmptyAuthState,
} from "../playwright/auth"

setup("save a signed-in storage state", async ({ page }) => {
  if (!isAuthEnabled()) {
    writeEmptyAuthState()
    return
  }

  const user = getE2EUser()
  if (!user) {
    throw new Error(
      "Auth is on, so signed-in tests need E2E_USER_EMAIL and E2E_USER_PASSWORD in .env.local. Use a confirmed email/password account — GitHub OAuth cannot be automated here."
    )
  }

  await page.goto("/login")
  await page.getByLabel("Email").fill(user.email)
  await page.getByLabel("Password").fill(user.password)
  await page.getByRole("button", { name: "Sign in", exact: true }).click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 })
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible()

  // First sign-in opens a full-screen welcome that intercepts clicks and hides
  // the rest of the page from the accessibility tree. Dismiss it here so the
  // saved session includes the "already seen" flag.
  const welcome = page.getByRole("heading", {
    name: /Welcome to the Quality Central beta/i,
  })
  await welcome.waitFor({ state: "visible", timeout: 10_000 }).catch(() => undefined)
  if (await welcome.isVisible()) {
    await page.getByRole("button", { name: /I.ll look around/i }).click()
    await expect(welcome).toBeHidden()
  }

  await page.context().storageState({ path: AUTH_STATE_PATH })
})
