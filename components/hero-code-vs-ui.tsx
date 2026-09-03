const SPEC_LINES = [
  { n: 1, parts: [
    { t: "import", c: "text-indigo-300" },
    { t: " { test, expect } ", c: "text-zinc-200" },
    { t: "from", c: "text-indigo-300" },
    { t: " '@playwright/test'", c: "text-emerald-400" },
  ]},
  { n: 2, parts: [{ t: "", c: "" }] },
  { n: 3, parts: [
    { t: "test", c: "text-sky-300" },
    { t: "(", c: "text-zinc-500" },
    { t: "'checkout applies SAVE20'", c: "text-emerald-400" },
    { t: ",", c: "text-zinc-500" },
  ]},
  { n: 4, parts: [
    { t: "  async ({ page }) => {", c: "text-zinc-300" },
  ]},
  { n: 5, parts: [
    { t: "    await", c: "text-indigo-300" },
    { t: " page.getByRole(", c: "text-zinc-200" },
  ]},
  { n: 6, parts: [
    { t: "      'button'", c: "text-emerald-400" },
    { t: ", { name: ", c: "text-zinc-400" },
    { t: "'Pay'", c: "text-emerald-400" },
    { t: " }", c: "text-zinc-400" },
  ]},
  { n: 7, parts: [
    { t: "    ).click()", c: "text-zinc-200" },
  ]},
  { n: 8, parts: [
    { t: "    await", c: "text-indigo-300" },
    { t: " expect", c: "text-violet-300" },
    { t: "(", c: "text-zinc-500" },
  ]},
  { n: 9, parts: [
    { t: "      page.getByText(", c: "text-zinc-200" },
    { t: "'$8.00'", c: "text-emerald-400" },
    { t: ")", c: "text-zinc-500" },
  ]},
  { n: 10, parts: [
    { t: "    ).toBeVisible()", c: "text-sky-300" },
  ]},
  { n: 11, parts: [
    { t: "  }", c: "text-zinc-400" },
    { t: ")", c: "text-zinc-500" },
  ]},
] as const

export function HeroCodeVsUi() {
  return (
    <div
      aria-hidden
      className="relative mx-auto w-full max-w-xl lg:max-w-none"
    >
      <div className="flex flex-col items-stretch gap-0 sm:flex-row sm:items-center">
        <div className="relative z-10 min-w-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0f] shadow-[0_0_40px_-12px_color-mix(in_srgb,var(--qa-primary)_45%,transparent)]">
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
            <span className="size-2 rounded-full bg-[#F43F5E]/80" />
            <span className="size-2 rounded-full bg-amber-400/80" />
            <span className="size-2 rounded-full bg-[#10B981]/80" />
            <span className="ml-2 font-mono text-[10px] tracking-wide text-zinc-500">
              checkout.spec.ts
            </span>
          </div>
          <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-5 sm:text-xs">
            {SPEC_LINES.map((line) => (
              <div key={line.n} className="flex gap-3">
                <span className="w-4 shrink-0 text-right text-zinc-600 select-none">
                  {line.n}
                </span>
                <span>
                  {line.parts.map((part, partIndex) => (
                    <span key={`${line.n}-${partIndex}`} className={part.c}>
                      {part.t}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </pre>
        </div>

        <div className="relative z-0 flex h-20 shrink-0 items-center justify-center sm:h-auto sm:w-28">
          <svg
            viewBox="0 0 112 160"
            className="h-20 w-full sm:h-40"
            fill="none"
          >
            <defs>
              <linearGradient id="qc-hero-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
              <filter id="qc-hero-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M8 86 C 44 86, 68 40, 104 40"
              className="hidden sm:block"
              stroke="url(#qc-hero-line)"
              strokeWidth="2"
              strokeOpacity="0.35"
              filter="url(#qc-hero-glow)"
            />
            <path
              d="M8 86 C 44 86, 68 40, 104 40"
              className="qc-dash-flow hidden sm:block"
              stroke="url(#qc-hero-line)"
              strokeWidth="2"
              filter="url(#qc-hero-glow)"
            />
            <path
              d="M56 10 C 56 34, 56 50, 56 78"
              className="sm:hidden"
              stroke="url(#qc-hero-line)"
              strokeWidth="2"
              strokeOpacity="0.35"
              filter="url(#qc-hero-glow)"
            />
            <path
              d="M56 10 C 56 34, 56 50, 56 78"
              className="qc-dash-flow sm:hidden"
              stroke="url(#qc-hero-line)"
              strokeWidth="2"
              filter="url(#qc-hero-glow)"
            />
            <circle
              r="4"
              fill="#10B981"
              className="qc-packet hidden sm:block"
              style={{ offsetPath: "path('M8 86 C 44 86, 68 40, 104 40')" }}
            />
          </svg>
        </div>

        <div className="relative z-10 w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/50 p-4 shadow-[0_0_40px_-16px_color-mix(in_srgb,var(--qa-success)_50%,transparent)] backdrop-blur-md sm:w-[220px]">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-heading text-sm font-semibold text-zinc-100">
              Nimbus checkout
            </p>
            <span className="rounded-full border border-qa-success/30 bg-qa-success/10 px-2 py-0.5 font-mono text-[10px] text-qa-success">
              passing
            </span>
          </div>
          <div className="space-y-2 rounded-lg border border-white/10 bg-[#111113] p-3">
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span>Ceramic mug</span>
              <span className="font-mono text-zinc-500 line-through">$10</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="rounded bg-qa-primary/15 px-1.5 py-0.5 font-mono text-[10px] text-indigo-200">
                SAVE20
              </span>
              <span className="font-mono text-emerald-300">$8.00</span>
            </div>
            <button
              type="button"
              tabIndex={-1}
              className="mt-1 flex h-8 w-full items-center justify-center rounded-md bg-qa-primary text-xs font-medium text-white shadow-[0_0_18px_-4px_var(--qa-primary)]"
            >
              Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
