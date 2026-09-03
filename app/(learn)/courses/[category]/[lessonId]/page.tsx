import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  MDXRemote,
  type MDXRemoteOptions,
} from "next-mdx-remote-client/rsc"
import remarkGfm from "remark-gfm"
import { ClockIcon } from "lucide-react"

import { MarkCompleteButton } from "@/components/mark-complete-button"
import { MDXWrapper } from "@/components/MDXWrapper"
import { mdxComponents } from "@/components/mdx/mdx-components"
import { MdxError } from "@/components/mdx/mdx-error"
import { DifficultyBadge } from "@/components/difficulty-badge"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getLesson, getLessonParams } from "@/lib/content"
import { findTopic } from "@/lib/curriculum"

type LessonPageProps = {
  params: Promise<{
    category: string
    lessonId: string
  }>
}

const mdxOptions: MDXRemoteOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
}

export async function generateStaticParams() {
  return getLessonParams()
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { category, lessonId } = await params
  const lesson = getLesson(category, lessonId)

  if (!lesson) {
    return { title: "Lesson not found" }
  }

  return {
    title: lesson.title,
    description: lesson.description,
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { category, lessonId } = await params
  const lesson = getLesson(category, lessonId)

  if (!lesson) {
    notFound()
  }

  const topic = findTopic(`/courses/${category}/${lessonId}`)
  const difficulty =
    lesson.difficulty ?? topic?.topic.difficulty ?? topic?.section.difficulty

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {lesson.track}
          </Badge>
          {difficulty ? <DifficultyBadge difficulty={difficulty} /> : null}
          {lesson.readingTime ? (
            <Badge variant="outline" className="gap-1 text-slate-600 dark:text-slate-300">
              <ClockIcon className="size-3" />
              {lesson.readingTime} min read
            </Badge>
          ) : null}
        </div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {lesson.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">{lesson.description}</p>
      </header>

      <Suspense fallback={<LessonBodySkeleton />}>
        <MDXWrapper>
          <MDXRemote
            source={lesson.content}
            components={mdxComponents}
            options={mdxOptions}
            onError={MdxError}
          />
        </MDXWrapper>
      </Suspense>

      <MarkCompleteButton category={category} lessonId={lessonId} />
    </article>
  )
}

function LessonBodySkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}
