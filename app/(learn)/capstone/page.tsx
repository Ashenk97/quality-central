import type { Metadata } from "next"

import { CourseSectionCatalog } from "@/components/catalog/course-section-catalog"

export const metadata: Metadata = {
  title: "Capstone",
}

export default function CapstonePage() {
  return <CourseSectionCatalog sectionHref="/capstone" />
}
