import type { Metadata } from "next"

import { CourseSectionCatalog } from "@/components/catalog/course-section-catalog"

export const metadata: Metadata = {
  title: "UI Automation",
}

export default function UiAutomationPage() {
  return <CourseSectionCatalog sectionHref="/ui-automation" />
}
