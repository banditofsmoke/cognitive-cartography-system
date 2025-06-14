"use client"

import { useEffect, useRef } from "react"

type ActivationGraphProps = {
  type: "heatmap" | "temporal"
  activeRegions: string[]
}

// Map region IDs to colors and positions for visualization
const REGION_VISUALIZATION: Record<string, { color: string; position: [number, number] }> = {
  "attention-head-1": { color: "#4cc9f0", position: [0.7, 0.3] },
  "attention-head-2": { color: "#4cc9f0", position: [0.3, 0.3] },
  "attention-head-3": { color: "#4cc9f0", position: [0.5, 0.2] },
  "reasoning-module-1": { color: "#3a0ca3", position: [0.5, 0.3] },
  "reasoning-module-2": { color: "#3a0ca3", position: [0.5, 0.4] },
  "language-processing": { color: "#7209b7", position: [0.2, 0.5] },
  "embedding-layer-1": { color: "#4361ee", position: [0.3, 0.7] },
  "embedding-layer-2": { color: "#4361ee", position: [0.7, 0.7] },
  "visual-processing": { color: "#f72585", position: [0.5, 0.8] },
  "multimodal-integration": { color: "#ff9e00", position: [0.5, 0.6] },
  "fine-tuning": { color: "#06d6a0", position: [0.5, 0.9] },
}

export function ActivationGraph({ type, activeRegions }: ActivationGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * 2 // For higher resolution
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2) // Scale drawing operations

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (type === "heatmap") {
      drawHeatmap(ctx, canvas.offsetWidth, canvas.offsetHeight, activeRegions)
    } else {
      drawTemporalGraph(ctx, canvas.offsetWidth, canvas.offsetHeight, activeRegions)
    }
  }, [type, activeRegions])

  const drawHeatmap = (ctx: CanvasRenderingContext2D, width: number, height: number, activeRegions: string[]) => {
    // Draw background
    ctx.fillStyle = "#1a1a2e"
    ctx.fillRect(0, 0, width, height)

    // Draw brain outline
    ctx.beginPath()
    ctx.ellipse(width / 2, height / 2, width * 0.4, height * 0.35, 0, 0, Math.PI * 2)
    ctx.strokeStyle = "#2a2a3a"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw cerebellum
    ctx.beginPath()
    ctx.ellipse(width / 2, height * 0.75, width * 0.25, height * 0.15, 0, 0, Math.PI)
    ctx.strokeStyle = "#2a2a3a"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw hemisphere division
    ctx.beginPath()
    ctx.moveTo(width / 2, height * 0.25)
    ctx.lineTo(width / 2, height * 0.75)
    ctx.strokeStyle = "#2a2a3a"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw activation spots for each active region
    activeRegions.forEach((region) => {
      const regionInfo = REGION_VISUALIZATION[region]
      if (!regionInfo) return

      const { color, position } = regionInfo
      const x = position[0] * width
      const y = position[1] * height

      // Create gradient for glow effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, width * 0.15)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, "transparent")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, width * 0.15, 0, Math.PI * 2)
      ctx.fill()

      // Add small label
      ctx.fillStyle = "#ffffff"
      ctx.font = "8px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(region.split("-")[0], x, y - 10)
    })

    // Add brain region labels
    const regions = [
      { name: "Frontal", x: width / 2, y: height * 0.2 },
      { name: "Parietal", x: width / 2, y: height * 0.4 },
      { name: "Temporal", x: width * 0.2, y: height * 0.5 },
      { name: "Occipital", x: width / 2, y: height * 0.7 },
      { name: "Cerebellum", x: width / 2, y: height * 0.85 },
    ]

    ctx.fillStyle = "#4a4a5a"
    ctx.font = "8px sans-serif"
    ctx.textAlign = "center"

    regions.forEach((region) => {
      ctx.fillText(region.name, region.x, region.y)
    })
  }

  const drawTemporalGraph = (ctx: CanvasRenderingContext2D, width: number, height: number, activeRegions: string[]) => {
    // Draw background
    ctx.fillStyle = "#1a1a2e"
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "#2a2a3a"
    ctx.lineWidth = 0.5

    // Vertical grid lines
    for (let x = 0; x <= width; x += width / 10) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let y = 0; y <= height; y += height / 5) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Generate temporal data for each active region
    const timePoints = 50
    const regionData: Record<string, { values: number[]; color: string }> = {}

    activeRegions.forEach((region) => {
      const regionInfo = REGION_VISUALIZATION[region]
      if (!regionInfo) return

      const values = []
      let value = Math.random() * 0.5

      for (let i = 0; i < timePoints; i++) {
        // Create somewhat realistic brain activity patterns
        value += (Math.random() - 0.5) * 0.2
        value = Math.max(0.1, Math.min(0.9, value))

        // Add occasional spikes based on region type
        if (region.includes("attention") && Math.random() < 0.15) {
          value = Math.min(0.9, value + Math.random() * 0.4)
        } else if (region.includes("reasoning") && Math.random() < 0.1) {
          value = Math.min(0.9, value + Math.random() * 0.3)
        } else if (Math.random() < 0.05) {
          value = Math.min(0.9, value + Math.random() * 0.2)
        }

        values.push(value)
      }

      regionData[region] = {
        values,
        color: regionInfo.color,
      }
    })

    // Draw lines for each region
    Object.entries(regionData).forEach(([region, data]) => {
      const { values, color } = data

      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      // Draw the line
      values.forEach((value, index) => {
        const x = (index / (timePoints - 1)) * width
        const y = height - value * height

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Add glow effect
      ctx.shadowColor = color
      ctx.shadowBlur = 5
      ctx.stroke()
      ctx.shadowBlur = 0

      // Add region label
      const lastValue = values[values.length - 1]
      const x = width - 5
      const y = height - lastValue * height

      ctx.fillStyle = color
      ctx.font = "8px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(region.split("-")[0], x, y - 5)
    })

    // Add time labels
    ctx.fillStyle = "#4a4a5a"
    ctx.font = "8px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Time (ms)", width / 2, height - 5)

    // Add activation labels
    ctx.save()
    ctx.translate(10, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = "center"
    ctx.fillText("Activation", 0, 0)
    ctx.restore()
  }

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
}
