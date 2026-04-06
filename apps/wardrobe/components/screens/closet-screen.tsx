"use client";

import { useState } from "react";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ITEMS, CATEGORIES, formatPrice, type ClothingItem } from "@/lib/mock-data";

function ItemCard({ item }: { item: ClothingItem }) {
  return (
    <button className="flex flex-col bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-border transition-colors text-left">
      <div className="aspect-square bg-stone-100 flex items-center justify-center">
        <span className="text-4xl">{item.image}</span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[11px] font-semibold text-muted tracking-wide uppercase">{item.brand}</p>
        <p className="text-sm font-medium text-foreground mt-0.5 truncate">{item.name}</p>
        <p className="text-xs text-muted mt-0.5">{item.color}</p>
      </div>
    </button>
  );
}

export function ClosetScreen() {
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = ITEMS.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.brand.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="px-5 pt-14 pb-2">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight">Tu armario</h1>
            <p className="text-sm text-muted mt-0.5">{ITEMS.length} prendas</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
            <Plus size={20} className="text-background" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 py-3">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Buscar prenda..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-stone-100 rounded-xl text-sm placeholder:text-muted outline-none focus:ring-2 focus:ring-accent/30 transition-shadow"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 pb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={cn(
                "px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors",
                category === cat.key
                  ? "bg-foreground text-background"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted text-sm">
            No se encontraron prendas
          </div>
        )}
      </div>
    </div>
  );
}
