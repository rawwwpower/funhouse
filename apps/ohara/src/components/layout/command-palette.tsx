"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import {
  Search,
  Link,
  Image,
  FileText,
  StickyNote,
  Star,
  File,
} from "lucide-react";
import type { Item } from "@/types/items";

const TYPE_ICONS: Record<string, React.ElementType> = {
  link: Link,
  image: Image,
  pdf: FileText,
  screenshot: Image,
  note: StickyNote,
  file: File,
};

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: Item[];
  onSelectItem?: (item: Item) => void;
  onAddNew?: () => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  items,
  onSelectItem,
  onAddNew,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  // Global keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed left-1/2 top-[20%] w-full max-w-lg -translate-x-1/2">
        <Command
          className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] shadow-2xl"
          shouldFilter={true}
        >
          <div className="flex items-center border-b border-[var(--color-border)] px-3">
            <Search size={16} className="text-[var(--color-text-muted)]" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search your library..."
              className="flex-1 bg-transparent px-3 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
            />
            <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-muted)]">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="p-8 text-center text-sm text-[var(--color-text-muted)]">
              No results found.
            </Command.Empty>

            {/* Quick actions */}
            <Command.Group
              heading={
                <span className="px-2 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                  Actions
                </span>
              }
            >
              <Command.Item
                onSelect={() => {
                  onAddNew?.();
                  onOpenChange(false);
                }}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--color-text-secondary)] data-[selected=true]:bg-[var(--color-bg-tertiary)] data-[selected=true]:text-[var(--color-text-primary)]"
              >
                <span className="text-[var(--color-amber)]">+</span>
                Add new item
              </Command.Item>
            </Command.Group>

            {/* Items */}
            {items.length > 0 && (
              <Command.Group
                heading={
                  <span className="px-2 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    Library
                  </span>
                }
              >
                {items.slice(0, 20).map((item) => {
                  const Icon = TYPE_ICONS[item.item_type] || File;
                  return (
                    <Command.Item
                      key={item.id}
                      value={`${item.title || ""} ${item.description || ""} ${item.url || ""}`}
                      onSelect={() => {
                        onSelectItem?.(item);
                        onOpenChange(false);
                      }}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm data-[selected=true]:bg-[var(--color-bg-tertiary)]"
                    >
                      <Icon
                        size={14}
                        strokeWidth={1.5}
                        className="shrink-0 text-[var(--color-text-muted)]"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[var(--color-text-primary)]">
                          {item.title || "Untitled"}
                        </p>
                        {item.description && (
                          <p className="truncate text-xs text-[var(--color-text-muted)]">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {item.is_favorite && (
                        <Star
                          size={12}
                          className="shrink-0 fill-[var(--color-amber)] text-[var(--color-amber)]"
                        />
                      )}
                    </Command.Item>
                  );
                })}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
