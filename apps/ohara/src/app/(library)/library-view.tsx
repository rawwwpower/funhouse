"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ItemGrid } from "@/components/library/item-grid";
import type { Item } from "@/types/items";

interface LibraryViewProps {
  initialItems: Item[];
}

export function LibraryView({ initialItems }: LibraryViewProps) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const supabase = createClient();

  const handleToggleFavorite = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;

      const newValue = !item.is_favorite;

      // Optimistic update
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, is_favorite: newValue } : i))
      );

      // Persist
      await supabase
        .from("items")
        .update({ is_favorite: newValue })
        .eq("id", id);
    },
    [items, supabase]
  );

  return (
    <ItemGrid items={items} onToggleFavorite={handleToggleFavorite} />
  );
}
