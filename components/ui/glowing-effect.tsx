"use client"

import React, { useCallback, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface GlowingEffectProps {
  spread?: number
  glow?: boolean
  disabled?: boolean
  proximity?: number
  inactiveZone?: number
  borderWidth?: number
  className?: string
  children?: React.ReactNode
}

export function GlowingEffect({
  spread = 40,
  glow = true,
  disabled = false,
  proximity = 64,
  inactiveZone = 0.01,
  borderWidth = 2,
  className,
}: GlowingEffectProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current || disabled) return
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const cx = rect.width / 2
        const cy = rect.height / 2
        const dx = Math.abs(x - cx) / cx
        const dy = Math.abs(y - cy) / cy
        const isInactive = dx < inactiveZone && dy < inactiveZone
        if (isInactive) {
          ref.current.style.setProperty("--glow-opacity", "0")
          return
        }
        const dist = Math.sqrt(
          Math.max(0, Math.abs(e.clientX - rect.left - cx) - cx) ** 2 +
          Math.max(0, Math.abs(e.clientY - rect.top - cy) - cy) ** 2
        )
        if (dist > proximity) {
          ref.current.style.setProperty("--glow-opacity", "0")
          return
        }
        ref.current.style.setProperty("--glow-x", `${x}px`)
        ref.current.style.setProperty("--glow-y", `${y}px`)
        ref.current.style.setProperty("--glow-opacity", "1")
        ref.current.style.setProperty("--glow-spread", `${spread}px`)
      })
    },
    [disabled, proximity, spread, inactiveZone]
  )

  useEffect(() => {
    if (disabled) return
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [handleMouseMove, disabled])

  if (disabled) return null

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
      style={{
        borderWidth: `${borderWidth}px`,
        borderStyle: "solid",
        borderColor: "transparent",
        borderImage: glow
          ? `radial-gradient(var(--glow-spread, 40px) circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(31,206,126,calc(var(--glow-opacity, 0) * 0.9)), transparent 100%) 1`
          : "none",
      }}
    />
  )
}
