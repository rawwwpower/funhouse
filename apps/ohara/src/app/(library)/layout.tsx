"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { DropZoneOverlay } from "@/components/layout/drop-zone";
import { AddModal } from "@/components/ingest/add-modal";
import { CommandPalette } from "@/components/layout/command-palette";
import { useDropZone } from "@/hooks/use-drop-zone";
import { isValidUrl, detectContentType } from "@/lib/utils";
import type { Item } from "@/types/items";

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [tags, setTags] = useState<
    { name: string; slug: string; count: number }[]
  >([]);
  const [allItems, setAllItems] = useState<Item[]>([]);

  const supabase = createClient();

  // Fetch tags
  useEffect(() => {
    async function fetchTags() {
      const { data } = await supabase
        .from("tags")
        .select("name, slug, usage_count")
        .order("usage_count", { ascending: false })
        .limit(20);

      if (data) {
        setTags(
          data.map((t) => ({
            name: t.name,
            slug: t.slug,
            count: t.usage_count || 0,
          }))
        );
      }
    }
    fetchTags();
  }, []);

  // Fetch items for command palette
  useEffect(() => {
    async function fetchItems() {
      const { data } = await supabase
        .from("items")
        .select("*")
        .eq("is_archived", false)
        .order("created_at", { ascending: false })
        .limit(100);

      if (data) setAllItems(data as Item[]);
    }
    fetchItems();
  }, []);

  // Ingest handlers
  const handleSubmitUrl = useCallback(async (url: string) => {
    await fetch("/api/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_type: "link", url }),
    });
    // Refresh items
    window.location.reload();
  }, []);

  const handleSubmitNote = useCallback(async (content: string) => {
    await fetch("/api/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_type: "note", content }),
    });
    window.location.reload();
  }, []);

  const handleSubmitFiles = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        const itemType = detectContentType(file);

        // Upload to Supabase Storage
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const itemId = crypto.randomUUID();
        const path = `${user.id}/${itemType}/${itemId}/${file.name}`;

        await supabase.storage.from("library").upload(path, file, {
          contentType: file.type,
          upsert: true,
        });

        await fetch("/api/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            item_type: itemType,
            file_path: path,
            file_type: file.type,
            file_size: file.size,
          }),
        });
      }
      window.location.reload();
    },
    [supabase]
  );

  // Drop zone
  const { isDragging } = useDropZone({
    onDrop: handleSubmitFiles,
    onPaste: (text) => {
      if (isValidUrl(text)) {
        handleSubmitUrl(text);
      } else {
        setAddModalOpen(true);
      }
    },
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        tags={tags}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => setAddModalOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Overlays */}
      <DropZoneOverlay isDragging={isDragging} />
      <AddModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSubmitUrl={handleSubmitUrl}
        onSubmitNote={handleSubmitNote}
        onSubmitFiles={handleSubmitFiles}
      />
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        items={allItems}
        onAddNew={() => setAddModalOpen(true)}
      />
    </div>
  );
}
