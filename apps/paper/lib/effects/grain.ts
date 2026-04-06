import type { GrainParams } from "./types"

export function applyGrain(
  ctx: CanvasRenderingContext2D,
  source: ImageData,
  width: number,
  height: number,
  params: GrainParams
): ImageData {
  const { amount, size } = params

  // Draw the source first
  ctx.putImageData(source, 0, 0)

  // Overlay random noise grains
  const count = Math.floor(width * height * (amount / 100) * 0.08)

  for (let i = 0; i < count; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const isDark = Math.random() > 0.3 // bias toward dark noise (ink feel)
    const alpha = Math.random() * 0.12

    if (isDark) {
      ctx.fillStyle = `rgba(0,0,0,${alpha})`
    } else {
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.6})`
    }

    ctx.fillRect(x, y, size, size)
  }

  return ctx.getImageData(0, 0, width, height)
}
