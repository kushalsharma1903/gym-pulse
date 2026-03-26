"use client"

import { useEffect, useRef } from "react"

interface Sparkle {
  x: number
  y: number
  size: number
  opacity: number
  speedX: number
  speedY: number
  life: number
  maxLife: number
}

export function Sparkles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparklesRef = useRef<Sparkle[]>([])
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const createSparkle = (): Sparkle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      opacity: 0,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3 - 0.1,
      life: 0,
      maxLife: Math.random() * 120 + 60,
    })

    // Seed initial sparkles
    for (let i = 0; i < 60; i++) {
      const s = createSparkle()
      s.life = Math.random() * s.maxLife
      sparklesRef.current.push(s)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (Math.random() < 0.3) sparklesRef.current.push(createSparkle())
      sparklesRef.current = sparklesRef.current.filter(s => s.life < s.maxLife)

      for (const s of sparklesRef.current) {
        s.life++
        s.x += s.speedX
        s.y += s.speedY
        const progress = s.life / s.maxLife
        s.opacity = progress < 0.3
          ? progress / 0.3
          : progress > 0.7
            ? 1 - (progress - 0.7) / 0.3
            : 1

        ctx.save()
        ctx.globalAlpha = s.opacity * 0.6
        ctx.fillStyle = "#1fce7e"
        ctx.shadowColor = "#1fce7e"
        ctx.shadowBlur = s.size * 3
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  )
}
