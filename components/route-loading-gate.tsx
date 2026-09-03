"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"

import { RouteLoading } from "@/components/route-loading"

export function RouteLoadingGate({
  children,
  fullScreen = false,
}: {
  children: React.ReactNode
  fullScreen?: boolean
}) {
  const reduceMotion = useReducedMotion()
  const [ready, setReady] = useState(Boolean(reduceMotion))

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setReady(true),
      reduceMotion ? 0 : 820
    )
    return () => window.clearTimeout(timeout)
  }, [reduceMotion])

  if (!ready) {
    return <RouteLoading fullScreen={fullScreen} />
  }

  return children
}
