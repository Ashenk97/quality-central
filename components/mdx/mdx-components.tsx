import type { MDXComponents } from "next-mdx-remote-client/rsc"
import Link from "next/link"

import { Quiz } from "@/components/Quiz"
import { cn } from "@/lib/utils"

export const mdxComponents: MDXComponents = {
  Quiz,
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "font-heading text-3xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-8 font-heading text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-6 font-heading text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("leading-7 text-muted-foreground", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "list-disc space-y-1 pl-5 text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "list-decimal space-y-1 pl-5 text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("leading-7", className)} {...props} />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn("font-medium text-foreground", className)} {...props} />
  ),
  a: ({ href, className, children, ...props }) => {
    const linkClass = cn(
      "font-medium text-foreground underline underline-offset-4",
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
        "rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em]",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "overflow-x-auto rounded-xl bg-muted p-4 font-mono text-sm",
        className
      )}
      {...props}
    />
  ),
}
