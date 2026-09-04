import type { Config } from "tailwindcss"

const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./content/**/*.{mdx,md}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "Inter Fallback",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        heading: [
          "Space Grotesk",
          "Space Grotesk Fallback",
          "ui-sans-serif",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "JetBrains Mono Fallback",
          "ui-monospace",
          "monospace",
        ],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        "qa-primary": "var(--qa-primary)",
        "qa-success": "var(--qa-success)",
        "qa-bug": "var(--qa-bug)",
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) * 0.8)",
        sm: "calc(var(--radius) * 0.6)",
      },
      boxShadow: {
        card: "0 0 0 1px rgb(255 255 255 / 0.06), 0 8px 32px rgb(0 0 0 / 0.45)",
        "card-hover":
          "0 0 0 1px color-mix(in srgb, var(--qa-primary) 35%, transparent), 0 0 28px color-mix(in srgb, var(--qa-primary) 22%, transparent)",
        glow: "0 0 24px color-mix(in srgb, var(--qa-primary) 40%, transparent)",
        "glow-success":
          "0 0 24px color-mix(in srgb, var(--qa-success) 40%, transparent)",
        "glow-bug":
          "0 0 24px color-mix(in srgb, var(--qa-bug) 40%, transparent)",
      },
      transitionDuration: {
        theme: "200ms",
      },
    },
  },
} satisfies Config

export default config
