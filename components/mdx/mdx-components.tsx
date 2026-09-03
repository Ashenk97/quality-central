import type { MDXComponents } from "next-mdx-remote-client/rsc"

import { Info, Warning, mdxTypography } from "@/components/MDXWrapper"
import { Quiz } from "@/components/Quiz"
import { CapstoneSubmit } from "@/components/CapstoneSubmit"

export const mdxComponents: MDXComponents = {
  ...mdxTypography,
  Info,
  Warning,
  Quiz,
  CapstoneSubmit,
}
