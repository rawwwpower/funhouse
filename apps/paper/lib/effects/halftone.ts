import { hexToRgb } from "@/lib/colors"
import type { HalftoneParams } from "./types"

const PAPER_COLOR = "#f2efe8"

export function applyHalftone(
  ctx: CanvasRenderingContext2D,
  source: ImageData,
  width: number,
  height: number,
  params: HalftoneParams
): ImageData {
  const { dotSize, spacing, angle, color } = params
  const [cr, cg, cb] = hexToRgb(color.hex)
  const maxRadius = dotSize / 2
  const minRadius = 0.2

  // Fill with paper
  ctx.fillStyle = PAPER_COLOR
  ctx.fillRect(0, 0, width, height)

  // Put source data into a temp canvas to sample from
  const pixels = source.data

  // Apply rotation
  ctx.save()
  ctx.translate(width / 2, height / 2)
  ctx.rotate((angle * Math.PI) / 180)
  ctx.translate(-width / 2, -height / 2)

  // Expand bounds for rotation coverage
  const diag = Math.sqrt(width * width + height * height)
  const startX = Math.floor((width - diag) / 2)
  const startY = Math.floor((height - diag) / 2)
  const endX = Math.ceil((width + diag) / 2)
  const endY = Math.ceil((height + diag) / 2)

  for (let y = startY; y < endY; y += spacing) {
    for (let x = startX; x < endX; x += spacing) {
      // Sample brightness from original (unrotated) coordinates
      // Inverse-rotate the point to find the source pixel
      const cos = Math.cos((-angle * Math.PI) / 180)
      const sin = Math.sin((-angle * Math.PI) / 180)
      const cx = width / 2
      const cy = height / 2
      const sx = Math.round(cos * (x - cx) - sin * (y - cy) + cx)
      const sy = Math.round(sin * (x - cx) + cos * (y - cy) + cy)

      if (sx < 0 || sx >= width || sy < 0 || sy >= height) continue

      // Sample area brightness
      let totalBrightness = 0
      let samples = 0
      const sampleR = Math.floor(spacing / 2)

      for (let dy = -sampleR; dy <= sampleR; dy++) {
        for (let dx = -sampleR; dx <= sampleR; dx++) {
          const px = Math.min(Math.max(sx + dx, 0), width - 1)
          const py = Math.min(Math.max(sy + dy, 0), height - 1)
          const idx = (py * width + px) * 4
          const lum = pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114
          totalBrightness += lum
          samples++
        }
      }

      const darkness = 1 - totalBrightness / samples / 255
      const radius = minRadius + darkness * (maxRadius - minRadius)

      if (radius > minRadius + 0.1) {
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgb(${cr},${cg},${cb})`
        ctx.fill()
      }
    }
  }

  ctx.restore()
  return ctx.getImageData(0, 0, width, height)
}
