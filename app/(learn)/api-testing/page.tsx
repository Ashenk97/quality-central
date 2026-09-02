import type { Metadata } from "next"

import { CourseSectionCatalog } from "@/components/catalog/course-section-catalog"

export const metadata: Metadata = {
  title: "API Testing",
}

export default function ApiTestingPage() {
  return <CourseSectionCatalog sectionHref="/api-testing" />
}
