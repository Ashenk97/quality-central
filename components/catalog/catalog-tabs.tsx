"use client"

import Link from "next/link"

import {
  CATALOG_TABS,
  type CatalogFilterId,
} from "@/lib/catalog"
import { cn } from "@/lib/utils"

const tabClassName = (active: boolean) =>
  cn(
    "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200",
    active
      ? "bg-background text-foreground shadow-sm ring-1 ring-border"
      : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
  )

const listClassName =
  "flex flex-wrap gap-1 rounded-xl border border-border/80 bg-muted/50 p-1"

export function CatalogNavTabs({ active }: { active: CatalogFilterId }) {
  return (
    <nav aria-label="Course categories" className={listClassName}>
      {CATALOG_TABS.map((tab) => {
        const isActive = tab.id === active

        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={tabClassName(isActive)}
          >
            <tab.icon className="size-3.5" />
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function CatalogFilterTabs({
  value,
  onChange,
}: {
  value: CatalogFilterId | "all"
  onChange: (value: CatalogFilterId | "all") => void
}) {
  return (
    <div role="tablist" aria-label="Filter modules" className={listClassName}>
      <button
        type="button"
        role="tab"
        aria-selected={value === "all"}
        className={tabClassName(value === "all")}
        onClick={() => onChange("all")}
      >
        All
      </button>
      {CATALOG_TABS.map((tab) => {
        const isActive = value === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={tabClassName(isActive)}
            onClick={() => onChange(tab.id)}
          >
            <tab.icon className="size-3.5" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
