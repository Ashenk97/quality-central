import { ImageResponse } from "next/og"

export const alt = "Quality Central: Zero to Advanced QA Engineering"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background:
            "radial-gradient(ellipse at top, #312e81 0%, #0b0b12 60%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <svg width="128" height="128" viewBox="0 0 64 64">
            <defs>
              <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#818cf8" />
                <stop offset="1" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            <rect width="64" height="64" rx="14" fill="url(#bg)" />
            <g
              transform="translate(8.6 8.2) scale(1.95)"
              fill="none"
              stroke="#fff"
              strokeWidth="2.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              <path d="m9 12 2 2 4-4" />
            </g>
          </svg>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2 }}>
            Quality Central
          </div>
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 44,
            fontWeight: 600,
            color: "#a5b4fc",
          }}
        >
          Zero to Advanced QA Engineering
        </div>
        <div style={{ marginTop: 20, fontSize: 30, color: "#a1a1aa" }}>
          Manual QA, API testing, UI automation, and hands-on bug hunting.
        </div>
      </div>
    ),
    size
  )
}
