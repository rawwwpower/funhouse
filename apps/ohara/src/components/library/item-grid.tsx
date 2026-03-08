"use client";

import { AnimatePresence } from "framer-motion";
import { ItemCard } from "./item-card";
import type { Item } from "@/types/items";
import { Inbox } from "lucide-react";

interface ItemGridProps {
  items: Item[];
  loading?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function ItemGrid({ items, loading, onToggleFavorite }: ItemGridProps) {
  if (loading) {
    return (
      <div className="item-grid p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="item-card overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"
          >
            <div
              className="skeleton w-full"
              style={{ height: `${150 + Math.random() * 100}px` }}
            />
            <div className="space-y-2 p-4">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-full rounded" />
              <div className="flex gap-1">
                <div className="skeleton h-5 w-16 rounded-full" />
                <div className="skeleton h-5 w-12 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-12 text-center">
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-6">
          <Inbox
            size={40}
            strokeWidth={1}
            className="text-[var(--color-text-muted)]"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
            Your library is empty
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Drop a file, paste a link, or write a note to start building your
            Tree of Knowledge.
          </p>
        </div>
        <div className="flex gap-3 text-xs text-[var(--color-text-muted)]">
          <span>⌘V to paste</span>
          <span>•</span>
          <span>Drag & drop files</span>
          <span>•</span>
          <span>Click + to add</span>
        </div>
      </div>
    );
  }

  return (
    <div className="item-grid p-6">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
