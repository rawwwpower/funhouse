import type { ItemType, ItemStatus, ContentCategory } from "@/lib/constants";

export interface Item {
  id: string;
  user_id: string;
  item_type: ItemType;
  title: string | null;
  description: string | null;
  content: string | null;
  url: string | null;
  ai_metadata: AiMetadata;
  file_path: string | null;
  file_size: number | null;
  file_type: string | null;
  thumbnail_path: string | null;
  og_data: OgData;
  collection_id: string | null;
  is_favorite: boolean;
  is_archived: boolean;
  status: ItemStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  tags?: Tag[];
}

export interface AiMetadata {
  summary?: string;
  key_topics?: string[];
  content_category?: ContentCategory;
  sentiment?: string;
  language?: string;
  confidence?: number;
}

export interface OgData {
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_site_name?: string;
  favicon?: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  color: string | null;
  is_ai_generated: boolean;
  usage_count: number;
  created_at: string;
}

export interface ItemTag {
  item_id: string;
  tag_id: string;
  is_ai_applied: boolean;
  confidence: number | null;
  created_at: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  item_count: number;
  created_at: string;
  updated_at: string;
}

// Ingest types
export interface IngestRequest {
  item_type: ItemType;
  url?: string;
  content?: string;
  file_path?: string;
  file_type?: string;
  file_size?: number;
}

export interface ClassificationResult {
  title: string;
  description: string;
  tags: string[];
  content_category: ContentCategory;
  key_topics: string[];
  language: string;
  confidence: number;
}
