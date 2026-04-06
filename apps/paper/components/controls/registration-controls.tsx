"use client"

import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import type { RegistrationParams } from "@/lib/effects/types"

type Props = {
  params: RegistrationParams
  onChange: (params: RegistrationParams) => void
}

const CHANNELS = [
  { key: "red" as const, label: "R", color: "bg-red-500" },
  { key: "green" as const, label: "G", color: "bg-green-500" },
  { key: "blue" as const, label: "B", color: "bg-blue-500" },
]

export function RegistrationControls({ params, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Slider
        label="Offset X"
        value={params.offsetX}
        min={-20}
        max={20}
        onChange={(v) => onChange({ ...params, offsetX: v })}
      />
      <Slider
        label="Offset Y"
        value={params.offsetY}
        min={-20}
        max={20}
        onChange={(v) => onChange({ ...params, offsetY: v })}
      />
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted">Channel</span>
        <div className="flex gap-1.5">
          {CHANNELS.map((ch) => (
            <button
              key={ch.key}
              onClick={() => onChange({ ...params, channel: ch.key })}
              className={cn(
                "flex-1 h-8 rounded text-xs font-medium transition-all cursor-pointer",
                params.channel === ch.key
                  ? "bg-foreground text-paper"
                  : "bg-paper-dark/50 text-muted hover:bg-paper-dark"
              )}
            >
              {ch.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
