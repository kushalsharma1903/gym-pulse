"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface VerticalCutRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  splitBy?: "words" | "chars" | "lines"
}

export function VerticalCutReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  splitBy = "words",
}: VerticalCutRevealProps) {
  const text = typeof children === "string" ? children : String(children)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const units = splitBy === "words" ? text.split(" ") : text.split("")

  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`} aria-label={text}>
      {units.map((unit, i) => (
        <span key={i} className="overflow-hidden inline-block" aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : {}}
            transition={{
              duration,
              delay: delay + i * 0.06,
              ease: [0.215, 0.61, 0.355, 1],
            }}
          >
            {unit}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
