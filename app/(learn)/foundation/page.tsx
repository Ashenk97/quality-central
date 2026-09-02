import type { Metadata } from "next"

import { CourseSectionCatalog } from "@/components/catalog/course-section-catalog"

export const metadata: Metadata = {
  title: "Foundation",
}

export default function FoundationPage() {
  return <CourseSectionCatalog sectionHref="/foundation" />
}
