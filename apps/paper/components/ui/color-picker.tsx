"use client"

import { useState } from "react"
import { RISO_COLORS, isValidHex, type RisoColor } from "@/lib/colors"
import { cn } from "@/lib/utils"

type ColorPickerProps = {
  value: RisoColor
  onChange: (color: RisoColor) => void
  label?: string
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [hexInput, setHexInput] = useState("")

  function handleHexChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace("#", "")
    setHexInput(raw)
    if (raw.length === 6 && isValidHex(raw)) {
      onChange({ name: "Custom", hex: `#${raw}` })
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-xs text-muted">{label}</span>}

      {/* Swatch grid */}
      <div className="flex flex-wrap gap-1.5">
        {RISO_COLORS.map((c) => (
          <button
            key={c.hex}
            onClick={() => {
              onChange(c)
              setHexInput("")
            }}
            className={cn(
              "w-6 h-6 rounded-full cursor-pointer transition-all",
              value.hex === c.hex
                ? "ring-2 ring-foreground ring-offset-2 ring-offset-paper scale-110"
                : "hover:scale-110"
            )}
            style={{ backgroundColor: c.hex }}
            title={c.name}
          />
        ))}
      </div>

      {/* Hex input */}
      <div className="flex items-center gap-1.5">
        <div
          className="w-5 h-5 rounded border border-border shrink-0"
          style={{ backgroundColor: value.hex }}
        />
        <div className="flex items-center bg-surface border border-border rounded px-2 h-7 text-xs flex-1">
          <span className="text-muted">#</span>
          <input
            type="text"
            value={hexInput || value.hex.replace("#", "")}
            onChange={handleHexChange}
            maxLength={6}
            className="bg-transparent outline-none w-full font-mono ml-0.5"
            placeholder="FF48B0"
          />
        </div>
      </div>
    </div>
  )
}
