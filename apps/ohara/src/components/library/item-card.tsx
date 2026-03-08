"use client";

import { motion } from "framer-motion";
import {
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  StickyNote,
  File,
  Star,
  ExternalLink,
} from "lucide-react";
import { cn, truncate } from "@/lib/utils";
import type { Item } from "@/types/items";

interface ItemCardProps {
  item: Item;
  onToggleFavorite?: (id: string) => void;
}

const TYPE_ICONS = {
  link: LinkIcon,
  image: ImageIcon,
  pdf: FileText,
  screenshot: ImageIcon,
  note: StickyNote,
  file: File,
};

export function ItemCard({ item, onToggleFavorite }: ItemCardProps) {
  const Icon = TYPE_ICONS[item.item_type] || File;
  const isProcessing = item.status === "processing" || item.status === "pending";
  const hasError = item.status === "error";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "item-card group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] transition-colors hover:border-[var(--color-border-hover)] hover:bg-[var(--color-card-hover)]",
        hasError && "border-[var(--color-error)]/30"
      )}
    >
      {/* Thumbnail / Preview */}
      {item.item_type === "link" && item.og_data?.og_image && (
        <div className="aspect-video w-full overflow-hidden bg-[var(--color-bg-tertiary)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.og_data.og_image}
            alt=""
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}

      {(item.item_type === "image" || item.item_type === "screenshot") &&
        item.thumbnail_path && (
          <div className="w-full overflow-hidden bg-[var(--color-bg-tertiary)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.thumbnail_path}
              alt=""
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}

      {/* Processing skeleton */}
      {isProcessing && (
        <div className="space-y-2 p-4">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-2/3 rounded" />
        </div>
      )}

      {/* Content */}
      {!isProcessing && (
        <div className="p-4 space-y-2">
          {/* Type + favicon */}
          <div className="flex items-center gap-2">
            {item.item_type === "link" && item.og_data?.favicon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.og_data.favicon}
                alt=""
                className="h-4 w-4 rounded"
              />
            ) : (
              <Icon
                size={14}
                strokeWidth={1.5}
                className="text-[var(--color-text-muted)]"
              />
            )}
            {item.og_data?.og_site_name && (
              <span className="text-xs text-[var(--color-text-muted)]">
                {item.og_data.og_site_name}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-medium leading-snug text-[var(--color-text-primary)]">
            {item.title || "Untitled"}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
              {truncate(item.description, 120)}
            </p>
          )}

          {/* Note content preview */}
          {item.item_type === "note" && item.content && (
            <p className="text-xs leading-relaxed text-[var(--color-text-secondary)] italic">
              {truncate(item.content, 150)}
            </p>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="tag-pill inline-flex rounded-full bg-[var(--color-bg-tertiary)] px-2 py-0.5 text-[var(--color-text-secondary)]"
                >
                  {tag.name}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="tag-pill inline-flex rounded-full bg-[var(--color-bg-tertiary)] px-2 py-0.5 text-[var(--color-text-muted)]">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Error state */}
          {hasError && (
            <p className="text-xs text-[var(--color-error)]">
              Failed to process — {item.error_message || "unknown error"}
            </p>
          )}
        </div>
      )}

      {/* Hover actions */}
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            className="rounded-md bg-[var(--color-bg-primary)]/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-[var(--color-bg-secondary)]"
          >
            <Star
              size={14}
              strokeWidth={1.5}
              className={cn(
                item.is_favorite
                  ? "fill-[var(--color-amber)] text-[var(--color-amber)]"
                  : "text-[var(--color-text-secondary)]"
              )}
            />
          </button>
        )}
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="rounded-md bg-[var(--color-bg-primary)]/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-[var(--color-bg-secondary)]"
          >
            <ExternalLink
              size={14}
              strokeWidth={1.5}
              className="text-[var(--color-text-secondary)]"
            />
          </a>
        )}
      </div>
    </motion.div>
  );
}
