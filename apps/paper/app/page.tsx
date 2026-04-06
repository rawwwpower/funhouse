"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Download, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { CanvasArea } from "@/components/canvas-area"
import { runPipeline } from "@/lib/effects/pipeline"
import { RISO_COLORS } from "@/lib/colors"
import type { EffectConfig, EffectType } from "@/lib/effects/types"

const DEFAULT_EFFECTS: EffectConfig[] = [
  {
    type: "duotone",
    enabled: false,
    params: {
      colorA: RISO_COLORS[0],  // Black
      colorB: RISO_COLORS[5],  // Fluorescent Pink
      balance: 50,
    },
  },
  {
    type: "halftone",
    enabled: false,
    params: {
      dotSize: 4,
      spacing: 6,
      angle: 45,
      color: RISO_COLORS[0], // Black
    },
  },
  {
    type: "grain",
    enabled: false,
    params: {
      amount: 30,
      size: 2,
    },
  },
  {
    type: "registration",
    enabled: false,
    params: {
      offsetX: 3,
      offsetY: 2,
      channel: "red" as const,
    },
  },
]

export default function PaperPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sourceRef = useRef<ImageData | null>(null)
  const rafRef = useRef<number>(0)

  const [hasImage, setHasImage] = useState(false)
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null)
  const [effects, setEffects] = useState<EffectConfig[]>(DEFAULT_EFFECTS)
  const [selectedEffect, setSelectedEffect] = useState<EffectType | null>(null)

  // Set canvas dimensions + run pipeline after render
  useEffect(() => {
    if (!sourceRef.current || !canvasRef.current || !dimensions) return

    const canvas = canvasRef.current
    if (canvas.width !== dimensions.w || canvas.height !== dimensions.h) {
      canvas.width = dimensions.w
      canvas.height = dimensions.h
    }

    // Debounce via rAF
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      runPipeline(sourceRef.current!, effects, canvasRef.current!)
    })

    return () => cancelAnimationFrame(rafRef.current)
  }, [effects, hasImage, dimensions])

  const handleImageLoad = useCallback(
    (data: ImageData, w: number, h: number) => {
      sourceRef.current = data
      setDimensions({ w, h })
      setHasImage(true)
    },
    []
  )

  function handleToggle(type: EffectType, enabled: boolean) {
    setEffects((prev) =>
      prev.map((e) => (e.type === type ? { ...e, enabled } : e))
    )
    if (enabled && !selectedEffect) {
      setSelectedEffect(type)
    }
  }

  function handleSelect(type: EffectType) {
    setSelectedEffect((prev) => (prev === type ? null : type))
  }

  function handleParamsChange(type: EffectType, params: any) {
    setEffects((prev) =>
      prev.map((e) => (e.type === type ? { ...e, params } : e))
    )
  }

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "paper-riso.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  function handleReset() {
    sourceRef.current = null
    setHasImage(false)
    setEffects(DEFAULT_EFFECTS)
    setSelectedEffect(null)
  }

  return (
    <div className="h-screen flex flex-col relative z-10">
      {/* Top bar */}
      <header className="h-12 border-b border-border bg-surface/60 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
        <span className="text-sm font-medium tracking-tight">Paper</span>
        <div className="flex items-center gap-2">
          {hasImage && (
            <>
              <Button variant="ghost" size="icon" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />
                Download PNG
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 min-h-0">
        {hasImage && (
          <Sidebar
            effects={effects}
            selectedEffect={selectedEffect}
            onToggle={handleToggle}
            onSelect={handleSelect}
            onParamsChange={handleParamsChange}
          />
        )}
        <CanvasArea
          canvasRef={canvasRef}
          hasImage={hasImage}
          onImageLoad={handleImageLoad}
        />
      </div>
    </div>
  )
}
