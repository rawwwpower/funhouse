"use client"

import { useRef, useState, useCallback } from "react"
import { Upload } from "lucide-react"

type CanvasAreaProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  hasImage: boolean
  onImageLoad: (imageData: ImageData, width: number, height: number) => void
}

export function CanvasArea({ canvasRef, hasImage, onImageLoad }: CanvasAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          // Use offscreen canvas to extract ImageData (visible canvas may not exist yet)
          const scale = Math.min(1200 / img.naturalWidth, 1)
          const w = Math.round(img.naturalWidth * scale)
          const h = Math.round(img.naturalHeight * scale)

          const offscreen = document.createElement("canvas")
          offscreen.width = w
          offscreen.height = h
          const ctx = offscreen.getContext("2d")
          if (!ctx) return

          ctx.drawImage(img, 0, 0, w, h)
          const data = ctx.getImageData(0, 0, w, h)
          onImageLoad(data, w, h)
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    },
    [onImageLoad]
  )

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith("image/")) processFile(file)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  if (!hasImage) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div
          className={`w-full max-w-lg aspect-[4/3] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
            isDragging
              ? "border-foreground/40 bg-paper-dark/40"
              : "border-border hover:border-foreground/30 hover:bg-paper-dark/20"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Upload className="w-6 h-6 text-muted" strokeWidth={1.5} />
          <div className="text-sm text-muted">
            Drop an image or click to upload
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
      <div className="bg-paper border border-border/50 rounded p-3 shadow-sm">
        <canvas
          ref={canvasRef}
          className="block max-w-full h-auto"
        />
      </div>
    </div>
  )
}
