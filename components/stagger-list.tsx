"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
}

export function StaggerList({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={listVariants}
      // The initial variant has to be the same on the server and on the first
      // client render, so reduced motion collapses the timing instead.
      initial="hidden"
      animate="show"
      transition={
        reduceMotion ? { staggerChildren: 0, delayChildren: 0 } : undefined
      }
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={itemVariants}
      transition={reduceMotion ? { duration: 0 } : undefined}
    >
      {children}
    </motion.div>
  )
}
