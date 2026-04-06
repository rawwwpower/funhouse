import type { RisoColor } from "@/lib/colors"

export type HalftoneParams = {
  dotSize: number    // 2-10
  spacing: number    // 4-16
  angle: number      // 0-180
  color: RisoColor
}

export type DuotoneParams = {
  colorA: RisoColor
  colorB: RisoColor
  balance: number    // 0-100
}

export type GrainParams = {
  amount: number     // 0-100
  size: number       // 1-5
}

export type RegistrationParams = {
  offsetX: number    // -20 to 20
  offsetY: number    // -20 to 20
  channel: "red" | "green" | "blue"
}

export type EffectType = "duotone" | "halftone" | "grain" | "registration"

export type EffectConfig =
  | { type: "duotone"; enabled: boolean; params: DuotoneParams }
  | { type: "halftone"; enabled: boolean; params: HalftoneParams }
  | { type: "grain"; enabled: boolean; params: GrainParams }
  | { type: "registration"; enabled: boolean; params: RegistrationParams }

export type EffectFunction = (
  ctx: CanvasRenderingContext2D,
  source: ImageData,
  width: number,
  height: number,
  params: any
) => ImageData
