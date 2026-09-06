import { existsSync } from "node:fs"

import { defineConfig, devices } from "@playwright/test"

import { AUTH_STATE_PATH, writeEmptyAuthState } from "./playwright/auth"

// `next dev` reads .env.local on its own, but the test process does not. Load it
// so specs can tell whether the app under test is running with auth enabled.
if (existsSync(".env.local") && typeof process.loadEnvFile === "function") {
  process.loadEnvFile(".env.local")
}

// Only seed an empty file if setup has not written a session yet. Calling this
// on every config load would wipe the cookies the setup project just saved.
if (!existsSync(AUTH_STATE_PATH)) {
  writeEmptyAuthState()
}

const port = 3000
const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "setup",
      testDir: "./e2e",
      testMatch: /auth\.setup\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "smoke",
      testDir: "./tests",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "e2e",
      testDir: "./e2e",
      testIgnore: /auth\.setup\.ts/,
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: process.env.CI ? "npm run start" : "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
