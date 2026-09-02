import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { CurriculumTopic } from "@/lib/curriculum"

export function LessonPlaceholder({
  title,
  description,
  topics,
}: {
  title: string
  description: string
  topics?: CurriculumTopic[]
}) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="max-w-2xl text-muted-foreground">{description}</p>
        </div>
        <Badge variant="secondary">Coming soon</Badge>
      </div>

      {topics && topics.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {topics.map((topic) => (
            <Card key={topic.href} size="sm">
              <CardHeader>
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <Link href={topic.href}>
                    Open skeleton
                    <ArrowRightIcon data-icon="inline-end" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lesson outline</CardTitle>
            <CardDescription>
              Content for this module has not been written yet. This page
              reserves the route and layout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-4 h-32 w-full" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
