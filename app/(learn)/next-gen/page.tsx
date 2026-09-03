import type { Metadata } from "next"

import { CourseSectionCatalog } from "@/components/catalog/course-section-catalog"

export const metadata: Metadata = {
  title: "Next-Gen QA",
}

export default function NextGenPage() {
  return <CourseSectionCatalog sectionHref="/next-gen" />
}
