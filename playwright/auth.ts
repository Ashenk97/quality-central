import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"

export const AUTH_STATE_PATH = path.join(
  process.cwd(),
  "playwright",
  ".auth",
  "user.json"
)

export const emptyStorageState = {
  cookies: [] as [],
  origins: [] as [],
}

export function isAuthEnabled() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  )
}

export function getE2EUser() {
  const email = process.env.E2E_USER_EMAIL?.trim()
  const password = process.env.E2E_USER_PASSWORD
  if (!email || !password) {
    return null
  }
  return { email, password }
}

export function writeEmptyAuthState() {
  mkdirSync(path.dirname(AUTH_STATE_PATH), { recursive: true })
  writeFileSync(AUTH_STATE_PATH, JSON.stringify(emptyStorageState, null, 2))
}
