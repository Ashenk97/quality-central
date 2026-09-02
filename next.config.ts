import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    const lessons = [
      ["foundation", "manual-qa"],
      ["foundation", "sdlc"],
      ["foundation", "stlc"],
      ["api-testing", "rest"],
      ["api-testing", "http-methods"],
      ["ui-automation", "frameworks"],
      ["ui-automation", "dom"],
    ] as const

    return lessons.map(([category, lessonId]) => ({
      source: `/${category}/${lessonId}`,
      destination: `/courses/${category}/${lessonId}`,
      permanent: false,
    }))
  },
}

export default nextConfig
