import { hexToRgb } from "@/lib/colors"
import type { DuotoneParams } from "./types"

export function applyDuotone(
  ctx: CanvasRenderingContext2D,
  source: ImageData,
  width: number,
  height: number,
  params: DuotoneParams
): ImageData {
  const { colorA, colorB, balance } = params
  const [ar, ag, ab] = hexToRgb(colorA.hex)
  const [br, bg, bb] = hexToRgb(colorB.hex)

  // Balance shifts the midpoint: 50 = linear, <50 more colorA, >50 more colorB
  const mid = balance / 100

  const output = ctx.createImageData(width, height)
  const src = source.data
  const dst = output.data

  for (let i = 0; i < src.length; i += 4) {
    const lum = (src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114) / 255

    // Map luminance through a curve shifted by balance
    // Dark pixels -> colorA, light pixels -> colorB
    let t: number
    if (lum < mid) {
      t = (lum / mid) * 0.5
    } else {
      t = 0.5 + ((lum - mid) / (1 - mid)) * 0.5
    }

    dst[i] = Math.round(ar + (br - ar) * t)
    dst[i + 1] = Math.round(ag + (bg - ag) * t)
    dst[i + 2] = Math.round(ab + (bb - ab) * t)
    dst[i + 3] = src[i + 3]
  }

  ctx.putImageData(output, 0, 0)
  return output
}
