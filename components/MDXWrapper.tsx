import type { ReactNode } from "react"
import { InfoIcon, TriangleAlertIcon } from "lucide-react"
import Link from "next/link"
import type { MDXComponents } from "next-mdx-remote-client/rsc"

import { cn } from "@/lib/utils"

export function MDXWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="mdx-content space-y-4 text-slate-700 dark:text-slate-300">
      {children}
    </div>
  )
}

export function Info({
  title = "Info",
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <aside
      role="note"
      className="my-6 flex gap-3 rounded-xl border border-indigo-500/20 bg-indigo-50/80 px-4 py-3 text-sm text-slate-700 dark:bg-indigo-500/10 dark:text-slate-200"
    >
      <InfoIcon className="mt-0.5 size-4 shrink-0 text-indigo-600 dark:text-indigo-300" />
      <div className="min-w-0 space-y-1">
        <p className="font-heading font-semibold text-indigo-800 dark:text-indigo-200">
          {title}
        </p>
        <div className="leading-6 [&_p]:text-inherit [&_p]:leading-6">
          {children}
        </div>
      </div>
    </aside>
  )
}

export function Warning({
  title = "Watch out",
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <aside
      role="note"
      className="my-6 flex gap-3 rounded-xl border border-amber-500/30 bg-amber-50/90 px-4 py-3 text-sm text-slate-700 dark:border-warning/30 dark:bg-warning/10 dark:text-slate-200"
    >
      <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-warning" />
      <div className="min-w-0 space-y-1">
        <p className="font-heading font-semibold text-amber-800 dark:text-amber-200">
          {title}
        </p>
        <div className="leading-6 [&_p]:text-inherit [&_p]:leading-6">
          {children}
        </div>
      </div>
    </aside>
  )
}

export const mdxTypography = {
  h1: ({ className, children, ...props }) => (
    <h1
      className={cn(
        "font-heading text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ className, children, ...props }) => (
    <h2
      className={cn(
        "mt-10 scroll-mt-24 border-b border-indigo-500/15 pb-2 font-heading text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ className, children, ...props }) => (
    <h3
      className={cn(
        "mt-6 font-heading text-lg font-semibold tracking-tight text-indigo-800 dark:text-indigo-200",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn("leading-7 text-slate-700 dark:text-slate-300", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "list-decimal space-y-1 pl-5 text-slate-700 dark:text-slate-300",
        className
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("leading-7 marker:text-indigo-500", className)} {...props} />
  ),
  strong: ({ className, ...props }) => (
    <strong
      className={cn("font-semibold text-slate-900 dark:text-slate-100", className)}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-4 border-l-2 border-indigo-500/40 pl-4 text-slate-600 italic dark:text-slate-400",
        className
      )}
      {...props}
    />
  ),
  a: ({ href, className, children, ...props }) => {
    const linkClass = cn(
      "font-medium text-indigo-700 underline decoration-indigo-400/60 underline-offset-4 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200",
      className
    )

    if (href?.startsWith("/")) {
      return (
        <Link href={href} className={linkClass} {...props}>
          {children}
        </Link>
      )
    }

    return (
      <a
        href={href}
        className={linkClass}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  },
  code: ({ className, ...props }) => (
    <code
      className={cn(
        className?.includes("language-")
          ? "bg-transparent p-0 text-[0.9em] text-slate-100"
          : "rounded-md bg-indigo-50 px-1.5 py-0.5 font-mono text-[0.9em] text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-200",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-4 overflow-x-auto rounded-xl border border-indigo-500/15 bg-slate-950 p-4 font-mono text-sm text-slate-100 shadow-inner",
        className
      )}
      {...props}
    />
  ),
  table: ({ className, ...props }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table
        className={cn("w-full text-left text-sm text-slate-700 dark:text-slate-300", className)}
        {...props}
      />
    </div>
  ),
  thead: ({ className, ...props }) => (
    <thead
      className={cn(
        "bg-indigo-50 text-slate-900 dark:bg-indigo-500/10 dark:text-slate-100",
        className
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn("px-3 py-2 font-heading font-semibold", className)}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn("border-t border-border px-3 py-2", className)}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr
      className={cn("my-8 border-indigo-500/15", className)}
      {...props}
    />
  ),
} satisfies MDXComponents
