"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

type SliderProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  className?: string
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  className,
}: SliderProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{label}</span>
        <span className="text-xs font-mono text-muted tabular-nums">
          {value}
        </span>
      </div>
      <SliderPrimitive.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
      >
        <SliderPrimitive.Track className="bg-border relative grow rounded-full h-[3px]">
          <SliderPrimitive.Range className="absolute bg-foreground/40 rounded-full h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block w-3.5 h-3.5 bg-foreground rounded-full border-2 border-paper focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-shadow" />
      </SliderPrimitive.Root>
    </div>
  )
}
