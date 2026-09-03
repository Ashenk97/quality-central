import type { Metadata } from "next"

import { CourseSectionCatalog } from "@/components/catalog/course-section-catalog"

export const metadata: Metadata = {
  title: "Technical Core",
}

export default function TechnicalCorePage() {
  return <CourseSectionCatalog sectionHref="/technical-core" />
}
