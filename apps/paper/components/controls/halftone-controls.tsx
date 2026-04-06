"use client"

import { Slider } from "@/components/ui/slider"
import { ColorPicker } from "@/components/ui/color-picker"
import type { HalftoneParams } from "@/lib/effects/types"

type Props = {
  params: HalftoneParams
  onChange: (params: HalftoneParams) => void
}

export function HalftoneControls({ params, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Slider
        label="Dot size"
        value={params.dotSize}
        min={2}
        max={10}
        step={0.5}
        onChange={(v) => onChange({ ...params, dotSize: v })}
      />
      <Slider
        label="Spacing"
        value={params.spacing}
        min={4}
        max={16}
        onChange={(v) => onChange({ ...params, spacing: v })}
      />
      <Slider
        label="Angle"
        value={params.angle}
        min={0}
        max={180}
        step={5}
        onChange={(v) => onChange({ ...params, angle: v })}
      />
      <ColorPicker
        label="Ink color"
        value={params.color}
        onChange={(c) => onChange({ ...params, color: c })}
      />
    </div>
  )
}
