export type SpecCheck = {
  ok: boolean
  output: string
}

type TestCase = {
  name: string
  line: number
}

export function checkPlaywrightSpec(source: string): SpecCheck {
  const syntax = findSyntaxError(source)
  if (syntax) {
    return {
      ok: false,
      output: [
        `Syntax error: ${syntax.message}`,
        `example.spec.ts:${syntax.line}`,
        "",
        "Fix the file, then check it again. No browser was opened.",
      ].join("\n"),
    }
  }

  const tests = findTests(source)
  if (tests.length === 0) {
    return {
      ok: false,
      output: [
        "No test() blocks found.",
        "Add test('name', async ({ page }) => { ... }).",
        "",
        "No browser was opened.",
      ].join("\n"),
    }
  }

  const lines = [
    `Parsed example.spec.ts`,
    `Found ${tests.length} test${tests.length === 1 ? "" : "s"}:`,
    ...tests.map(
      (testCase, index) =>
        `  ${index + 1}. ${testCase.name} (line ${testCase.line})`
    ),
    "",
    "Syntax check passed.",
    "Assertions run after you install Playwright and execute this file. This page does not open a browser.",
  ]

  return {
    ok: true,
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
