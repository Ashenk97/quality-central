<div align="center">

# 🧪 Quality Central

<img
  src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&weight=600&size=26&duration=3200&pause=900&color=22C55E&center=true&vCenter=true&multiline=true&width=720&height=90&lines=Zero+%E2%86%92+Advanced+QA+Engineering;Hunt+bugs.+Ship+confidence.+Level+up."
  alt="Zero to Advanced QA Engineering — Hunt bugs. Ship confidence. Level up."
/>

<br />

**A gamified learning hub for Manual QA, API testing, UI automation, and interactive bug hunting.**

<br />

![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=black)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

<img
  src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=14&duration=2800&pause=1200&color=A3A3A3&center=true&vCenter=true&width=680&height=40&lines=%F0%9F%94%8D+Find+the+bug+%E2%86%92+%F0%9F%93%9D+Write+the+report+%E2%86%92+%F0%9F%8E%AF+Pass+the+quiz+%E2%86%92+%F0%9F%8E%89+Unlock+the+next+node"
  alt="Find the bug → Write the report → Pass the quiz → Unlock the next node"
/>

</div>

---

## ✨ What’s inside?

Quality Central is not a pile of PDFs — it’s a **hands-on QA career path** with progress unlocks, playgrounds, and a buggy sandbox that wants to be broken.

| 🎮 Feature | 💬 What you get |
| --- | --- |
| 📚 **MDX lessons** | Foundation → API → Technical Core → UI Automation → Interview → Capstone → Next-Gen |
| 🔒 **Sequential unlocks** | Finish a module to open the next — no skipping ahead |
| 🧪 **The Sandbox** | Seeded defects to hunt, report, and score |
| 📡 **API Playground** | Hit endpoints live and inspect responses |
| 🖥️ **Automation Playground** | Write / explore Playwright-style flows |
| 🛠️ **Custom Mock Server** | Spin up your own mock APIs |
| 🌳 **Skill tree + badges** | Visual path, Bug Hunter / API Wizard vibes |
| 🔥 **Daily challenge** | Keep the streak alive |
| 🎤 **Mock Interviewer** | Practice-style QA interview practice (AI Gateway) |
| 💬 **Lesson discussion** | Nested comments + upvotes on lessons |
| 🐛 **Site bug reporter** | Found a bug *on this site*? File it in-app |
| 📊 **Dashboard** | Progress rings, tracks, quiz averages, sandbox score |
| 🔄 **Reset progress** | Wipe lessons / quizzes / sandbox / badges and start over |
| ♿ **A11y linting** | `lint:a11y` + CI so accessibility stays in the build |
| 💎 **Pro (feature-flagged)** | Stripe checkout + premium lesson gating — off by default |

---

## 🗺️ Learning path

```text
  🏁 Foundation
       │
       ▼
  🌐 API Testing ──► 🛠️ Mock Server / Playground
       │
       ▼
  🗄️ Technical Core (SQL · Git · Agile)
       │
       ▼
  🤖 UI Automation ──► Automation Playground
       │
       ▼
  🎤 Interview Prep
       │
       ▼
  🐞 The Sandbox ──► 🏆 Capstone
       │
       ▼
  ✨ Next-Gen QA (AI in testing)
```

<img
  src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&size=16&duration=3500&pause=800&color=38BDF8&center=true&vCenter=true&width=620&height=36&lines=From+first+test+case+to+capstone+sprint+%E2%80%94+one+path.+Lots+of+bugs."
  alt="From first test case to capstone sprint — one path. Lots of bugs."
/>

---

## 🧰 Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** + **Framer Motion**
- **Supabase** (auth, progress, badges, comments, streaks)
- **MDX** lessons under `content/`
- **Playwright** smoke / e2e
- **Vercel AI Gateway** for Mock Interviewer
- **Stripe** (optional Pro tier behind `NEXT_PUBLIC_ENABLE_MONETIZATION`)

---

## 🚀 Getting started

```bash
# 1. Install
npm install

# 2. Env — copy and fill Supabase keys
cp .env.example .env.local

# 3. Apply SQL migrations in your Supabase project
#    (files in supabase/migrations/)

# 4. Run
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** and start hunting 🕵️‍♂️

### 🔑 Environment highlights

| Variable | Required? | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Anon key (RLS protects data) |
| `NEXT_PUBLIC_SITE_URL` | optional | OAuth / email redirects |
| `AI_GATEWAY_API_KEY` | optional | Local Mock Interviewer |
| `NEXT_PUBLIC_ENABLE_MONETIZATION` | optional | Only `"true"` enables Pro |
| Stripe + `SUPABASE_SERVICE_ROLE_KEY` | Pro only | Checkout + webhook membership |

> 💡 Progress works in the browser without sign-in. Sign in to sync across devices.

---

## 📜 Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | 🔥 Local Next.js server |
| `npm run build` | 📦 Production build |
| `npm run lint` | 🧹 ESLint |
| `npm run lint:a11y` | ♿ Accessibility lint gate |
| `npm run typecheck` | 🧮 `tsc --noEmit` |
| `npm run test:smoke` | 💨 Playwright smoke |
| `npm run test:e2e` | 🎭 Full Playwright suite |
| `npm run new-lesson` | 📝 Scaffold a new MDX lesson |

---

## 📁 Repo map (the fun tour)

```text
app/                 → routes (learn, auth, certificate, APIs)
components/          → UI, sandbox, skill tree, dashboard, discussions
content/             → MDX lessons by track
lib/                 → curriculum, progress, badges, Stripe, Supabase
supabase/migrations/ → schema + RLS (run these in Supabase!)
e2e/                 → Playwright smoke & flows
scripts/             → lesson scaffolding
```

---

## 🗄️ Supabase migrations

Apply everything under `supabase/migrations/` in order (or via CLI). Highlights:

- 📈 `user_progress` + modules
- 🏅 `user_badges`
- 🔥 daily challenge streaks
- 💬 lesson comments & votes
- 🐛 site bug reports
- 💎 Pro membership columns
- 🔄 delete policies for **Reset progress**

---

## 🤝 Contributing vibe

1. Fork / branch (`feat/…`, `fix/…`)
2. Keep commits conventional (`feat`, `fix`, `docs`, …)
3. Run `npm run lint` · `npm run typecheck` · `npm run test:smoke`
4. Open a PR and tell us which bug you crushed 🪲

---

<div align="center">

### 💚 Ship quality. Break things on purpose. Learn faster.

<img
  src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=15&duration=2500&pause=1500&color=22C55E&center=true&vCenter=true&width=520&height=32&lines=assert.soft(career).toBe(%27leveled+up%27)"
  alt="assert.soft(career).toBe('leveled up')"
/>

**Built for aspiring QA engineers who learn by doing.**

</div>
