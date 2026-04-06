"use client";

import { useState } from "react";
import { Plus, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { ITEMS, OUTFITS, CATEGORIES } from "@/lib/mock-data";

function OutfitCard({ outfit }: { outfit: (typeof OUTFITS)[0] }) {
  const outfitItems = outfit.items.map((id) => ITEMS.find((i) => i.id === id)!).filter(Boolean);

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-[15px]">{outfit.name}</h3>
        {outfit.date && (
          <span className="text-xs text-muted">
            {new Date(outfit.date).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {outfitItems.map((item) => (
          <div
            key={item.id}
            className="w-20 h-20 rounded-xl bg-stone-100 flex items-center justify-center"
          >
            <span className="text-2xl">{item.image}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OutfitBuilder() {
  const [selectedCategory, setSelectedCategory] = useState("tops");
  const [canvas, setCanvas] = useState<string[]>([]);

  const availableItems = ITEMS.filter((i) => i.category === selectedCategory);
  const canvasItems = canvas.map((id) => ITEMS.find((i) => i.id === id)!).filter(Boolean);

  const cats = CATEGORIES.filter((c) => c.key !== "all");

  return (
    <div className="flex flex-col">
      {/* Canvas */}
      <div className="mx-5 rounded-2xl bg-stone-50 border border-dashed border-stone-200 min-h-[260px] flex flex-col items-center justify-center p-4 mb-4">
        {canvasItems.length === 0 ? (
          <p className="text-sm text-muted">Toca prendas para armar tu outfit</p>
        ) : (
          <div className="flex flex-wrap gap-3 justify-center">
            {canvasItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCanvas((prev) => prev.filter((id) => id !== item.id))}
                className="w-24 h-24 rounded-xl bg-white border border-border/50 flex flex-col items-center justify-center gap-1 hover:border-accent/50 transition-colors"
              >
                <span className="text-3xl">{item.image}</span>
                <span className="text-[10px] text-muted">{item.brand}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category pills */}
      <div className="px-5 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {cats.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              selectedCategory === cat.key
                ? "bg-foreground text-background"
                : "bg-stone-100 text-stone-500"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Item strip */}
      <div className="px-5 flex gap-2 overflow-x-auto no-scrollbar pb-4">
        {availableItems.map((item) => {
          const isSelected = canvas.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => {
                if (isSelected) {
                  setCanvas((prev) => prev.filter((id) => id !== item.id));
                } else {
                  setCanvas((prev) => [...prev, item.id]);
                }
              }}
              className={cn(
                "flex-shrink-0 w-[72px] h-[88px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all",
                isSelected
                  ? "bg-accent-soft border-2 border-accent"
                  : "bg-stone-100 border-2 border-transparent"
              )}
            >
              <span className="text-2xl">{item.image}</span>
              <span className="text-[10px] text-muted truncate w-full text-center px-1">{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Save button */}
      {canvas.length >= 2 && (
        <div className="px-5 mt-2">
          <button className="w-full py-3.5 bg-foreground text-background rounded-2xl font-semibold text-sm active:scale-[0.98] transition-transform">
            Guardar outfit
          </button>
        </div>
      )}
    </div>
  );
}

export function OutfitsScreen() {
  const [mode, setMode] = useState<"list" | "builder">("list");

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="px-5 pt-14 pb-2">
        <div className="flex items-end justify-between">
          <h1 className="text-[28px] font-bold tracking-tight">Outfits</h1>
          <button
            onClick={() => setMode(mode === "list" ? "builder" : "list")}
            className={cn(
              "px-4 py-2 rounded-full text-[13px] font-medium transition-colors",
              mode === "builder"
                ? "bg-foreground text-background"
                : "bg-stone-100 text-stone-600"
            )}
          >
            {mode === "builder" ? "Ver guardados" : "+ Nuevo outfit"}
          </button>
        </div>
      </div>

      {mode === "builder" ? (
        <div className="mt-4">
          <OutfitBuilder />
        </div>
      ) : (
        <div className="px-5 mt-4 space-y-3">
          {OUTFITS.map((outfit) => (
            <OutfitCard key={outfit.id} outfit={outfit} />
          ))}
        </div>
      )}
    </div>
  );
}
