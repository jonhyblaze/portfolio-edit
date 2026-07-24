"use client"

import { motion } from "framer-motion"

const Letter = ({ char, index }: { char: string; index: number }) => (
  <motion.span
    initial={{ opacity: 0 }}
    animate={{
      // Sequence: Start invisible -> Fade in -> Stay visible -> Fade out (quick reset)
      opacity: [0.33, 1, 1, 0.33]
    }}
    transition={{
      duration: 6,             // Total loop length (exactly 7s)
      repeat: Infinity,        // Native infinite loop
      ease: "linear",
      times: [0, 0.1, 0.9, 1], // Timing percentages (0%, 10%, 90%, 100%)
      delay: index * 0.03,     // Your original stagger
    }}
  >
    {char === " " ? "\u00A0" : char}
  </motion.span>
)

export default Letter
