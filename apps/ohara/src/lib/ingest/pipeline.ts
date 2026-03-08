import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { classifyContent } from "@/lib/ai/classify";
import { slugify } from "@/lib/utils";
import { MAX_CONTENT_FOR_CLASSIFICATION } from "@/lib/constants";
import type { IngestRequest, ClassificationResult } from "@/types/items";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminClient = SupabaseClient<any, "public", any>;

// Use service role client for server-side operations
function getAdminClient(): AdminClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function processIngest(
  userId: string,
  request: IngestRequest
): Promise<{ itemId: string }> {
  const supabase = getAdminClient();

  // 1. Insert item with "processing" status
  const { data: item, error: insertError } = await supabase
    .from("items")
    .insert({
      user_id: userId,
      item_type: request.item_type,
      url: request.url || null,
      content: request.content || null,
      file_path: request.file_path || null,
      file_type: request.file_type || null,
      file_size: request.file_size || null,
      status: "processing",
    } as Record<string, unknown>)
    .select("id")
    .single();

  if (insertError || !item) {
    throw new Error(`Failed to insert item: ${insertError?.message}`);
  }

  const itemId = (item as Record<string, string>).id;

  // 2. Process content based on type (non-blocking)
  processAndClassify(supabase, userId, itemId, request).catch((err) => {
    console.error(`Classification failed for item ${itemId}:`, err);
    supabase
      .from("items")
      .update({
        status: "error",
        error_message: err instanceof Error ? err.message : "Unknown error",
      } as Record<string, unknown>)
      .eq("id", itemId)
      .then(() => {});
  });

  return { itemId };
}

async function processAndClassify(
  supabase: AdminClient,
  userId: string,
  itemId: string,
  request: IngestRequest
): Promise<void> {
  let contentForAI = "";
  let ogData: Record<string, string> = {};

  switch (request.item_type) {
    case "link":
      if (request.url) {
        ogData = await fetchOgData(request.url);
        contentForAI = [
          `URL: ${request.url}`,
          ogData.og_title && `Title: ${ogData.og_title}`,
          ogData.og_description && `Description: ${ogData.og_description}`,
          ogData.og_site_name && `Site: ${ogData.og_site_name}`,
        ]
          .filter(Boolean)
          .join("\n");
      }
      break;
    case "note":
      contentForAI = request.content || "";
      break;
    case "image":
    case "screenshot":
      contentForAI = `Image file: ${request.file_type || "unknown type"}, ${request.file_size || 0} bytes`;
      break;
    case "pdf":
      contentForAI = `PDF file: ${request.file_type || "application/pdf"}, ${request.file_size || 0} bytes`;
      if (request.content) {
        contentForAI += `\n\nExtracted text:\n${request.content}`;
      }
      break;
    default:
      contentForAI = `File: ${request.file_type || "unknown"}, ${request.file_size || 0} bytes`;
  }

  const truncatedContent = contentForAI.slice(0, MAX_CONTENT_FOR_CLASSIFICATION);

  // Get existing tags for reuse
  const { data: existingTags } = await supabase
    .from("tags")
    .select("name")
    .eq("user_id", userId)
    .order("usage_count", { ascending: false })
    .limit(50);

  const tagNames = (existingTags || []).map(
    (t: Record<string, unknown>) => t.name as string
  );

  // Classify with AI
  const classification = await classifyContent(
    truncatedContent,
    request.item_type,
    tagNames
  );

  // Upsert tags and link them
  await upsertTagsForItem(supabase, userId, itemId, classification);

  // Update item with classification results
  await supabase
    .from("items")
    .update({
      title: classification.title,
      description: classification.description,
      og_data: ogData,
      ai_metadata: {
        key_topics: classification.key_topics,
        content_category: classification.content_category,
        language: classification.language,
        confidence: classification.confidence,
      },
      status: "ready",
    } as Record<string, unknown>)
    .eq("id", itemId);
}

async function upsertTagsForItem(
  supabase: AdminClient,
  userId: string,
  itemId: string,
  classification: ClassificationResult
): Promise<void> {
  for (const tagName of classification.tags) {
    const tagSlug = slugify(tagName);

    const { data: existingTag } = await supabase
      .from("tags")
      .select("id, usage_count")
      .eq("user_id", userId)
      .eq("slug", tagSlug)
      .single();

    let tagId: string;

    if (existingTag) {
      const tag = existingTag as Record<string, unknown>;
      tagId = tag.id as string;
      // Increment usage count
      await supabase
        .from("tags")
        .update({
          usage_count: ((tag.usage_count as number) || 0) + 1,
        } as Record<string, unknown>)
        .eq("id", tagId);
    } else {
      const { data: newTag, error } = await supabase
        .from("tags")
        .insert({
          user_id: userId,
          name: tagName,
          slug: tagSlug,
          is_ai_generated: true,
          usage_count: 1,
        } as Record<string, unknown>)
        .select("id")
        .single();

      if (error || !newTag) continue;
      tagId = (newTag as Record<string, string>).id;
    }

    // Link tag to item (ignore if already exists)
    await supabase.from("item_tags").upsert(
      {
        item_id: itemId,
        tag_id: tagId,
        is_ai_applied: true,
        confidence: classification.confidence,
      } as Record<string, unknown>,
      { onConflict: "item_id,tag_id" }
    );
  }
}

async function fetchOgData(url: string): Promise<Record<string, string>> {
  try {
    const { default: ogs } = await import("open-graph-scraper");
    const { result } = await ogs({ url, timeout: 10000 });
    return {
      og_title: result.ogTitle || "",
      og_description: result.ogDescription || "",
      og_image: result.ogImage?.[0]?.url || "",
      og_site_name: result.ogSiteName || "",
      favicon: result.favicon || "",
    };
  } catch {
    return {};
  }
}
