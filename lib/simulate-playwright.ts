export type SimulatedRun = {
  ok: boolean
  output: string
}

type TestCase = {
  name: string
  line: number
}

export function simulatePlaywrightRun(source: string): SimulatedRun {
  const syntax = findSyntaxError(source)
  if (syntax) {
    return {
      ok: false,
      output: [
        `Error: ${syntax.message}`,
        `    at example.spec.ts:${syntax.line}:1`,
        "",
        "  1 failed",
        `    example.spec.ts:${syntax.line}:1 › (could not parse file)`,
      ].join("\n"),
    }
  }

  const tests = findTests(source)
  if (tests.length === 0) {
    return {
      ok: false,
      output: [
        "Error: No test() blocks found.",
        "Add a Playwright test('name', async ({ page }) => { ... }) call.",
        "",
        "  0 passed",
      ].join("\n"),
    }
  }

  const stamp = new Date().toLocaleTimeString()
  const lines = [
    `[${stamp}] Running ${tests.length} test${tests.length === 1 ? "" : "s"} using 1 worker`,
    "",
  ]

  let passed = 0
  let failed = 0

  tests.forEach((testCase, index) => {
    const duration = 180 + index * 95
    const shouldFail =
      /\bfail\b/i.test(testCase.name) || /expect\(\s*false\s*\)/.test(source)

    if (shouldFail) {
      failed += 1
      lines.push(
        `  ✗  ${index + 1} ${testCase.name} (${duration}ms)`,
        `     Error: Simulated assertion failed`
      )
      return
    }

    passed += 1
    lines.push(`  ✓  ${index + 1} ${testCase.name} (${duration}ms)`)
  })

  lines.push("", `  ${passed} passed${failed ? `  ${failed} failed` : ""}`)

  return {
    ok: failed === 0,
    output: lines.join("\n"),
  }
}

function findTests(source: string): TestCase[] {
  const tests: TestCase[] = []
  const pattern =
    /\btest(?:\.(?:only|skip|fail))?\s*\(\s*(['"`])([\s\S]*?)\1/g
  let match: RegExpExecArray | null

  while ((match = pattern.exec(source))) {
    const before = source.slice(0, match.index)
    if (/\btest\.describe\s*$/.test(before)) {
      continue
    }

    tests.push({
      name: match[2].replaceAll(/\s+/g, " "),
      line: before.split("\n").length,
    })
  }

  return tests
}

function findSyntaxError(
  source: string
): { line: number; message: string } | null {
  const stack: { closer: string; line: number }[] = []
  const openers: Record<string, string> = { "(": ")", "[": "]", "{": "}" }
  const closers: Record<string, string> = { ")": "(", "]": "[", "}": "{" }
  let line = 1
  let inSingle = false
  let inDouble = false
  let inTemplate = false
  let inLineComment = false
  let inBlockComment = false

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]
    const next = source[index + 1]

    if (char === "\n") {
      line += 1
      inLineComment = false
      continue
    }

    if (inLineComment) {
      continue
    }

    if (inBlockComment) {
      if (char === "*" && next === "/") {
        inBlockComment = false
        index += 1
      }
      continue
    }

    if ((inSingle || inDouble || inTemplate) && char === "\\") {
      index += 1
      continue
    }

    if (!inDouble && !inTemplate && char === "'" && !inSingle) {
      inSingle = true
      continue
    }
    if (inSingle && char === "'") {
      inSingle = false
      continue
    }

    if (!inSingle && !inTemplate && char === '"' && !inDouble) {
      inDouble = true
      continue
    }
    if (inDouble && char === '"') {
      inDouble = false
      continue
    }

    if (!inSingle && !inDouble && char === "`" && !inTemplate) {
      inTemplate = true
      continue
    }
    if (inTemplate && char === "`") {
      inTemplate = false
      continue
    }

    if (inSingle || inDouble || inTemplate) {
      continue
    }

    if (char === "/" && next === "/") {
      inLineComment = true
      index += 1
      continue
    }

    if (char === "/" && next === "*") {
      inBlockComment = true
      index += 1
      continue
    }

    if (char in openers) {
      stack.push({ closer: openers[char], line })
      continue
    }

    if (char in closers) {
      const last = stack.pop()
      if (!last || last.closer !== char) {
        return { line, message: `Unexpected token '${char}'` }
      }
    }
  }

  if (inSingle || inDouble || inTemplate) {
    return { line, message: "Unterminated string literal" }
  }

  if (inBlockComment) {
    return { line, message: "Unterminated comment" }
  }

  if (stack.length > 0) {
    const last = stack[stack.length - 1]
    return {
      line: last.line,
      message: `Missing '${last.closer}'`,
    }
  }

  return null
}
