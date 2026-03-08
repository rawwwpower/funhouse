import { createClient } from "@/lib/supabase/server";
import { LibraryView } from "./library-view";

export default async function LibraryPage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("items")
    .select(
      `
      *,
      tags:item_tags(
        tag:tags(id, name, slug, color)
      )
    `
    )
    .eq("is_archived", false)
    .order("created_at", { ascending: false })
    .limit(50);

  // Flatten tags from join
  const processedItems = (items || []).map((item) => ({
    ...item,
    tags: (item.tags || [])
      .map((t: { tag: unknown }) => t.tag)
      .filter(Boolean),
  }));

  return <LibraryView initialItems={processedItems} />;
}
