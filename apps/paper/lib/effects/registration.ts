import type { RegistrationParams } from "./types"

const PAPER_RGB = [242, 239, 232] // #f2efe8

export function applyRegistration(
  ctx: CanvasRenderingContext2D,
  source: ImageData,
  width: number,
  height: number,
  params: RegistrationParams
): ImageData {
  const { offsetX, offsetY, channel } = params

  const output = ctx.createImageData(width, height)
  const src = source.data
  const dst = output.data

  const channelIdx = channel === "red" ? 0 : channel === "green" ? 1 : 2

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4

      // Copy all channels from source
      dst[i] = src[i]
      dst[i + 1] = src[i + 1]
      dst[i + 2] = src[i + 2]
      dst[i + 3] = src[i + 3]

      // Offset the selected channel
      const sx = x - offsetX
      const sy = y - offsetY

      if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
        const si = (sy * width + sx) * 4
        dst[i + channelIdx] = src[si + channelIdx]
      } else {
        // Fill with paper color for that channel
        dst[i + channelIdx] = PAPER_RGB[channelIdx]
      }
    }
  }

  ctx.putImageData(output, 0, 0)
  return output
}
