"use client"

import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import type { EffectType } from "@/lib/effects/types"
import { Circle, Palette, Grip, Move } from "lucide-react"

const EFFECT_META: Record<EffectType, { label: string; icon: typeof Circle }> = {
  duotone: { label: "Duotone", icon: Palette },
  halftone: { label: "Halftone", icon: Circle },
  grain: { label: "Grain", icon: Grip },
  registration: { label: "Offset", icon: Move },
}

type EffectCardProps = {
  type: EffectType
  enabled: boolean
  selected: boolean
  onToggle: (enabled: boolean) => void
  onSelect: () => void
}

export function EffectCard({
  type,
  enabled,
  selected,
  onToggle,
  onSelect,
}: EffectCardProps) {
  const meta = EFFECT_META[type]
  const Icon = meta.icon

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
        selected
          ? "bg-paper-dark/60"
          : "hover:bg-paper-dark/30"
      )}
      onClick={onSelect}
    >
      <Icon
        className={cn(
          "w-4 h-4 shrink-0 transition-colors",
          enabled ? "text-foreground" : "text-muted/50"
        )}
        strokeWidth={1.5}
      />
      <span
        className={cn(
          "text-sm flex-1 transition-colors",
          enabled ? "text-foreground" : "text-muted/50"
        )}
      >
        {meta.label}
      </span>
      <SwitchPrimitive.Root
        checked={enabled}
        onCheckedChange={onToggle}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-8 h-[18px] rounded-full relative transition-colors cursor-pointer",
          enabled ? "bg-foreground" : "bg-border"
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "block w-3.5 h-3.5 rounded-full transition-transform",
            enabled
              ? "translate-x-[17px] bg-paper"
              : "translate-x-[2px] bg-muted"
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  )
}
