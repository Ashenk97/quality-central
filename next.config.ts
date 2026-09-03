import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    const lessons = [
      ["foundation", "01-introduction-to-qa"],
      ["foundation", "02-test-design-techniques"],
      ["foundation", "03-bug-life-cycle"],
      ["foundation", "04-agile-and-scrum-qa"],
      ["foundation", "05-writing-test-cases"],
      ["foundation", "istqb"],
      ["foundation", "sdlc"],
      ["foundation", "stlc"],
      ["foundation", "manual-qa"],
      ["api-testing", "01-introduction-to-api-testing"],
      ["api-testing", "02-http-methods-status-codes"],
      ["api-testing", "03-intro-to-postman"],
      ["api-testing", "03-rest-and-json"],
      ["api-testing", "04-postman-collections"],
      ["api-testing", "rest"],
      ["api-testing", "http-methods"],
      ["api-testing", "postman"],
      ["technical-core", "01-sql-for-qa"],
      ["technical-core", "02-git-and-agile"],
      ["ui-automation", "01-dom-and-locators"],
      ["ui-automation", "02-first-playwright-test"],
      ["ui-automation", "03-page-object-model"],
      ["ui-automation", "01-introduction-to-ui-automation"],
      ["ui-automation", "02-dom-and-locators"],
      ["ui-automation", "03-automation-frameworks"],
      ["ui-automation", "04-playwright-first-test"],
      ["ui-automation", "frameworks"],
      ["ui-automation", "dom"],
      ["interview-prep", "01-cracking-the-qa-interview"],
      ["capstone", "01-sandbox-challenge"],
      ["next-gen", "01-ai-in-testing"],
    ] as const

    return [
      ...lessons.map(([category, lessonId]) => ({
        source: `/${category}/${lessonId}`,
        destination: `/courses/${category}/${lessonId}`,
        permanent: false,
      })),
      {
        source: "/api-testing/02-http-methods-and-status-codes",
        destination: "/courses/api-testing/02-http-methods-status-codes",
        permanent: false,
      },
      {
        source: "/courses/api-testing/02-http-methods-and-status-codes",
        destination: "/courses/api-testing/02-http-methods-status-codes",
        permanent: false,
      },
    ]
  },
}

export default nextConfig
