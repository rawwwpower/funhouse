-- =============================================================
-- OHARA: Personal Knowledge Library - Initial Schema
-- =============================================================

-- Helper: auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================
-- COLLECTIONS: user-defined folders/groups
-- =============================================================
CREATE TABLE public.collections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL,
  description   TEXT,
  icon          TEXT,
  color         TEXT,
  sort_order    INTEGER DEFAULT 0,
  item_count    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, slug)
);

CREATE INDEX idx_collections_user ON public.collections(user_id);

CREATE TRIGGER collections_updated_at
  BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================
-- ITEMS: the central entity. Every saved piece of knowledge.
-- =============================================================
CREATE TABLE public.items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Content type
  item_type       TEXT NOT NULL CHECK (item_type IN (
    'link', 'image', 'pdf', 'screenshot', 'note', 'file'
  )),

  -- Core content
  title           TEXT,
  description     TEXT,
  content         TEXT,
  url             TEXT,

  -- AI-generated metadata
  ai_metadata     JSONB DEFAULT '{}'::JSONB,

  -- File/media storage
  file_path       TEXT,
  file_size       BIGINT,
  file_type       TEXT,
  thumbnail_path  TEXT,

  -- Open Graph data
  og_data         JSONB DEFAULT '{}'::JSONB,

  -- Organization
  collection_id   UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  is_favorite     BOOLEAN DEFAULT FALSE,
  is_archived     BOOLEAN DEFAULT FALSE,

  -- Processing state
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'ready', 'error'
  )),
  error_message   TEXT,

  -- Full-text search vector
  search_vector   TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(content, '')), 'C')
  ) STORED,

  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_items_user_id ON public.items(user_id);
CREATE INDEX idx_items_type ON public.items(item_type);
CREATE INDEX idx_items_status ON public.items(status);
CREATE INDEX idx_items_collection ON public.items(collection_id);
CREATE INDEX idx_items_created ON public.items(created_at DESC);
CREATE INDEX idx_items_search ON public.items USING GIN(search_vector);
CREATE INDEX idx_items_ai_metadata ON public.items USING GIN(ai_metadata);

CREATE TRIGGER items_updated_at
  BEFORE UPDATE ON public.items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================
-- TAGS: flat tags, AI-generated or user-created
-- =============================================================
CREATE TABLE public.tags (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL,
  color           TEXT,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  usage_count     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, slug)
);

CREATE INDEX idx_tags_user ON public.tags(user_id);
CREATE INDEX idx_tags_slug ON public.tags(user_id, slug);

-- =============================================================
-- ITEM_TAGS: many-to-many join
-- =============================================================
CREATE TABLE public.item_tags (
  item_id         UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  tag_id          UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  is_ai_applied   BOOLEAN DEFAULT FALSE,
  confidence      REAL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (item_id, tag_id)
);

CREATE INDEX idx_item_tags_item ON public.item_tags(item_id);
CREATE INDEX idx_item_tags_tag ON public.item_tags(tag_id);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Items policies
CREATE POLICY "Users can view own items" ON public.items
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own items" ON public.items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own items" ON public.items
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own items" ON public.items
  FOR DELETE USING (auth.uid() = user_id);

-- Tags policies
CREATE POLICY "Users can view own tags" ON public.tags
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tags" ON public.tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tags" ON public.tags
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tags" ON public.tags
  FOR DELETE USING (auth.uid() = user_id);

-- Item tags policies
CREATE POLICY "Users can view own item_tags" ON public.item_tags
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.items WHERE items.id = item_tags.item_id AND items.user_id = auth.uid())
  );
CREATE POLICY "Users can insert own item_tags" ON public.item_tags
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.items WHERE items.id = item_tags.item_id AND items.user_id = auth.uid())
  );
CREATE POLICY "Users can delete own item_tags" ON public.item_tags
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.items WHERE items.id = item_tags.item_id AND items.user_id = auth.uid())
  );

-- Collections policies
CREATE POLICY "Users can view own collections" ON public.collections
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own collections" ON public.collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own collections" ON public.collections
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own collections" ON public.collections
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================================
-- STORAGE
-- =============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'library',
  'library',
  FALSE,
  52428800,
  ARRAY[
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'application/pdf',
    'text/plain', 'text/markdown',
    'application/zip'
  ]
);

-- Storage policies
CREATE POLICY "Users can upload to own folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'library' AND
    (storage.foldername(name))[1] = auth.uid()::TEXT
  );

CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'library' AND
    (storage.foldername(name))[1] = auth.uid()::TEXT
  );

CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'library' AND
    (storage.foldername(name))[1] = auth.uid()::TEXT
  );
