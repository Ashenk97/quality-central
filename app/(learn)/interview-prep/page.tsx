import type { Metadata } from "next"

import { CourseSectionCatalog } from "@/components/catalog/course-section-catalog"

export const metadata: Metadata = {
  title: "Interview Prep",
}

export default function InterviewPrepPage() {
  return <CourseSectionCatalog sectionHref="/interview-prep" />
}
