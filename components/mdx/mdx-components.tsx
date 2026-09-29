import type { MDXComponents } from "next-mdx-remote-client/rsc"

import { Info, Warning, mdxTypography } from "@/components/mdx/mdx-wrapper"
import { Quiz } from "@/components/mdx/quiz"
import { CapstoneCheckoutPlayground } from "@/components/capstone/checkout-playground"
import { CapstoneSubmit } from "@/components/capstone/capstone-submit"

export const mdxComponents: MDXComponents = {
  ...mdxTypography,
  Info,
  Warning,
  Quiz,
  CapstoneSubmit,
  CheckoutPlayground: CapstoneCheckoutPlayground,
}
