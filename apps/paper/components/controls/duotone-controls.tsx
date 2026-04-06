"use client"

import { Slider } from "@/components/ui/slider"
import { ColorPicker } from "@/components/ui/color-picker"
import type { DuotoneParams } from "@/lib/effects/types"

type Props = {
  params: DuotoneParams
  onChange: (params: DuotoneParams) => void
}

export function DuotoneControls({ params, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <ColorPicker
        label="Shadow ink"
        value={params.colorA}
        onChange={(c) => onChange({ ...params, colorA: c })}
      />
      <ColorPicker
        label="Highlight ink"
        value={params.colorB}
        onChange={(c) => onChange({ ...params, colorB: c })}
      />
      <Slider
        label="Balance"
        value={params.balance}
        min={10}
        max={90}
        onChange={(v) => onChange({ ...params, balance: v })}
      />
    </div>
  )
}
