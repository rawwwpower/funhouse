"use client";

import {
  Library,
  Star,
  Tag,
  FolderOpen,
  Archive,
  Link,
  Image,
  FileText,
  StickyNote,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  tags: { name: string; slug: string; count: number }[];
}

const TYPE_FILTERS = [
  { key: "all", label: "All items", icon: Library },
  { key: "favorites", label: "Favorites", icon: Star },
  { key: "link", label: "Links", icon: Link },
  { key: "image", label: "Images", icon: Image },
  { key: "pdf", label: "PDFs", icon: FileText },
  { key: "note", label: "Notes", icon: StickyNote },
  { key: "file", label: "Files", icon: File },
  { key: "archived", label: "Archived", icon: Archive },
];

export function Sidebar({ activeFilter, onFilterChange, tags }: SidebarProps) {
  return (
    <aside className="flex h-full w-56 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-5">
      {/* Brand */}
      <div className="mb-6 px-3">
        <h1 className="font-display text-xl font-bold tracking-tight text-[var(--color-amber)]">
          ohara
        </h1>
      </div>

      {/* Type filters */}
      <nav className="space-y-0.5">
        {TYPE_FILTERS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
              activeFilter === key
                ? "bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
            )}
          >
            <Icon size={16} strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </nav>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 px-3 mb-2">
            <Tag size={14} strokeWidth={1.5} className="text-[var(--color-text-muted)]" />
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
              Tags
            </span>
          </div>
          <div className="space-y-0.5">
            {tags.slice(0, 15).map((tag) => (
              <button
                key={tag.slug}
                onClick={() => onFilterChange(`tag:${tag.slug}`)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors",
                  activeFilter === `tag:${tag.slug}`
                    ? "bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
                )}
              >
                <span className="truncate">{tag.name}</span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {tag.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto px-3 pt-4">
        <div className="flex items-center gap-2">
          <FolderOpen size={14} strokeWidth={1.5} className="text-[var(--color-text-muted)]" />
          <span className="text-xs text-[var(--color-text-muted)]">
            The Tree of Knowledge
          </span>
        </div>
      </div>
    </aside>
  );
}
