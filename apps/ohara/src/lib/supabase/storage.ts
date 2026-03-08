import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "library";

export function getStoragePath(
  userId: string,
  itemType: string,
  itemId: string,
  filename: string
): string {
  return `${userId}/${itemType}/${itemId}/${filename}`;
}

export function getThumbnailPath(userId: string, itemId: string): string {
  return `${userId}/thumbnails/${itemId}/thumb.webp`;
}

export async function uploadFile(
  supabase: SupabaseClient,
  path: string,
  file: File | Buffer,
  contentType: string
): Promise<string> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType, upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  return path;
}

export async function getSignedUrl(
  supabase: SupabaseClient,
  path: string,
  expiresIn = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) throw new Error(`Signed URL failed: ${error.message}`);
  return data.signedUrl;
}

export async function deleteFile(
  supabase: SupabaseClient,
  path: string
): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}
