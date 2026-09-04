"use client"

import { motion, useReducedMotion } from "framer-motion"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      // Avoid Y transforms here — they break position:sticky descendants.
      // The initial state has to stay the same on the server and on the first
      // client render, so reduced motion collapses the duration instead.
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </motion.div>
  )
}
