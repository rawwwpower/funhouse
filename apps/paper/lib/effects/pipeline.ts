import type { EffectConfig } from "./types"
import { applyDuotone } from "./duotone"
import { applyHalftone } from "./halftone"
import { applyGrain } from "./grain"
import { applyRegistration } from "./registration"

const EFFECT_FNS = {
  duotone: applyDuotone,
  halftone: applyHalftone,
  grain: applyGrain,
  registration: applyRegistration,
} as const

export function runPipeline(
  source: ImageData,
  effects: EffectConfig[],
  canvas: HTMLCanvasElement
) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const { width, height } = canvas

  // Start from source
  let current = source

  // Apply each enabled effect in order
  const enabledEffects = effects.filter((e) => e.enabled)

  if (enabledEffects.length === 0) {
    // No effects — just show the original
    ctx.putImageData(source, 0, 0)
    return
  }

  for (const effect of enabledEffects) {
    const fn = EFFECT_FNS[effect.type]
    current = fn(ctx, current, width, height, effect.params as any)
  }
}
