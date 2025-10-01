"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

export function ThankYouStep() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrame = 0
    let running = true

    const dpr = Math.max(1, window.devicePixelRatio || 1)
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = window.innerWidth + "px"
      canvas.style.height = window.innerHeight + "px"
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener("resize", resize)

    type Particle = {
      x: number
      y: number
      w: number
      h: number
      r: number
      vx: number
      vy: number
      rot: number
      vr: number
      color: string
      opacity: number
      decay: number
      shape: "rect" | "circle"
    }

    const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#a855f7", "#06b6d4"]
    const rand = (min: number, max: number) => Math.random() * (max - min) + min

    const particles: Particle[] = []
    const spawn = (count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = rand(-Math.PI, 0)
        const speed = rand(4, 10)
        particles.push({
          x: window.innerWidth * Math.random(),
          y: -20,
          w: rand(6, 10),
          h: rand(8, 14),
          r: rand(3, 6),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + rand(6, 10),
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.2, 0.2),
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 1,
          decay: rand(0.002, 0.006),
          shape: Math.random() > 0.5 ? "rect" : "circle",
        })
      }
    }

    // Initial burst + a few timed bursts for fullness
    spawn(180)
    const burst1 = setTimeout(() => spawn(120), 200)
    const burst2 = setTimeout(() => spawn(120), 400)

    const gravity = 0.15
    const drag = 0.995
    const duration = 4000
    const start = performance.now()

    const loop = () => {
      if (!running) return
      const now = performance.now()
      const elapsed = now - start
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.vy += gravity
        p.vx *= drag
        p.vy *= drag
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        if (elapsed > duration) p.opacity -= p.decay
        if (p.opacity <= 0 || p.y > window.innerHeight + 40) {
          particles.splice(i, 1)
          continue
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity))
        ctx.fillStyle = p.color
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        if (p.shape === "rect") {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.r, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      ctx.globalAlpha = 1
      if (particles.length > 0) {
        animationFrame = requestAnimationFrame(loop)
      } else {
        running = false
      }
    }

    animationFrame = requestAnimationFrame(loop)

    return () => {
      running = false
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", resize)
      clearTimeout(burst1)
      clearTimeout(burst2)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[60]" />
      <div className="w-full max-w-2xl mx-auto text-center space-y-8">
        <Image src="/bulqit-logo.png" alt="Bulqit Logo" width={200} height={200} className="mx-auto" />
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            {"Thank you for your interest!"}
          </h1>
          <div className="space-y-4">
            <p className="text-xl md:text-2xl text-primary font-semibold">{"Bulqit will come in 2026"}</p>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {
                "We're building now—your input helps decide what launches first. Invite your neighbors to grow demand, and we'll be in touch as we plan to launch in early 2026."
              }
            </p>
          </div>
        </div>
        <div className="pt-8 space-y-4">
          <p className="text-sm text-muted-foreground/70">{"We'll keep you updated on your Bulqit Block"}</p>
        </div>
      </div>
    </div>
  )
}