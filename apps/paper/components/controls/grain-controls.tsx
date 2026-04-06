"use client"

import { Slider } from "@/components/ui/slider"
import type { GrainParams } from "@/lib/effects/types"

type Props = {
  params: GrainParams
  onChange: (params: GrainParams) => void
}

export function GrainControls({ params, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Slider
        label="Amount"
        value={params.amount}
        min={0}
        max={100}
        onChange={(v) => onChange({ ...params, amount: v })}
      />
      <Slider
        label="Size"
        value={params.size}
        min={1}
        max={5}
        onChange={(v) => onChange({ ...params, size: v })}
      />
    </div>
  )
}
