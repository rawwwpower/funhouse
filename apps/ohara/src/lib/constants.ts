export const ITEM_TYPES = [
  "link",
  "image",
  "pdf",
  "screenshot",
  "note",
  "file",
] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

export const CONTENT_CATEGORIES = [
  "article",
  "tool",
  "reference",
  "inspiration",
  "tutorial",
  "resource",
  "opinion",
  "news",
  "documentation",
  "personal",
] as const;

export type ContentCategory = (typeof CONTENT_CATEGORIES)[number];

export const ITEM_STATUS = ["pending", "processing", "ready", "error"] as const;

export type ItemStatus = (typeof ITEM_STATUS)[number];

// Tag colors palette (Ohara-inspired warm tones)
export const TAG_COLORS = [
  "#D4A574", // warm sand
  "#C17F59", // terracotta
  "#8B6914", // dark gold
  "#6B8E23", // olive
  "#4A7C59", // forest
  "#5B7AA3", // ocean blue
  "#8B668B", // dusty purple
  "#CD6839", // burnt orange
  "#708090", // slate
  "#B8860B", // dark goldenrod
] as const;

// Max file sizes
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_THUMBNAIL_WIDTH = 400;

// AI classification
export const MAX_CONTENT_FOR_CLASSIFICATION = 4000; // chars to send to AI
export const MAX_PDF_PAGES_TO_EXTRACT = 5;
