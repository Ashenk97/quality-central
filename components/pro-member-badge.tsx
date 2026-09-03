"use client"

import { motion, useReducedMotion } from "framer-motion"

export function ProMemberBadge() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      aria-label="Pro member"
      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 backdrop-blur-md"
      animate={
        reduceMotion
          ? { boxShadow: "0px 0px 8px #6366F1" }
          : {
              boxShadow: [
                "0px 0px 4px #6366F1",
                "0px 0px 12px #6366F1",
                "0px 0px 4px #6366F1",
              ],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : { repeat: Infinity, duration: 2, ease: "easeInOut" }
      }
    >
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#6366F1]"
      />
      <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text font-heading text-[10px] font-semibold tracking-[0.16em] text-transparent uppercase">
        PRO
      </span>
    </motion.div>
  )
}
