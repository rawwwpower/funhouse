"use client"

import { EffectCard } from "./effect-card"
import { HalftoneControls } from "./controls/halftone-controls"
import { DuotoneControls } from "./controls/duotone-controls"
import { GrainControls } from "./controls/grain-controls"
import { RegistrationControls } from "./controls/registration-controls"
import type { EffectConfig, EffectType } from "@/lib/effects/types"

type SidebarProps = {
  effects: EffectConfig[]
  selectedEffect: EffectType | null
  onToggle: (type: EffectType, enabled: boolean) => void
  onSelect: (type: EffectType) => void
  onParamsChange: (type: EffectType, params: any) => void
}

const EFFECT_ORDER: EffectType[] = ["duotone", "halftone", "grain", "registration"]

export function Sidebar({
  effects,
  selectedEffect,
  onToggle,
  onSelect,
  onParamsChange,
}: SidebarProps) {
  const selected = effects.find((e) => e.type === selectedEffect)

  return (
    <div className="w-[260px] shrink-0 border-r border-border bg-surface/50 flex flex-col h-full">
      {/* Effect list */}
      <div className="p-3 flex flex-col gap-0.5">
        <span className="text-[10px] font-medium text-muted uppercase tracking-wider px-3 mb-1">
          Effects
        </span>
        {EFFECT_ORDER.map((type) => {
          const effect = effects.find((e) => e.type === type)!
          return (
            <EffectCard
              key={type}
              type={type}
              enabled={effect.enabled}
              selected={selectedEffect === type}
              onToggle={(enabled) => onToggle(type, enabled)}
              onSelect={() => onSelect(type)}
            />
          )
        })}
      </div>

      {/* Controls for selected effect */}
      {selected && (
        <div className="border-t border-border p-4 flex-1 overflow-y-auto">
          <span className="text-[10px] font-medium text-muted uppercase tracking-wider mb-3 block">
            Settings
          </span>
          {selected.type === "halftone" && (
            <HalftoneControls
              params={selected.params}
              onChange={(p) => onParamsChange("halftone", p)}
            />
          )}
          {selected.type === "duotone" && (
            <DuotoneControls
              params={selected.params}
              onChange={(p) => onParamsChange("duotone", p)}
            />
          )}
          {selected.type === "grain" && (
            <GrainControls
              params={selected.params}
              onChange={(p) => onParamsChange("grain", p)}
            />
          )}
          {selected.type === "registration" && (
            <RegistrationControls
              params={selected.params}
              onChange={(p) => onParamsChange("registration", p)}
            />
          )}
        </div>
      )}
    </div>
  )
}
