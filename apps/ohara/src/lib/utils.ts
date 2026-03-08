import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function getItemTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    link: "Link",
    image: "Image",
    pdf: "PDF",
    screenshot: "Screenshot",
    note: "Note",
    file: "File",
  };
  return labels[type] || type;
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export function detectContentType(
  input: string | File
): "link" | "note" | "image" | "pdf" | "screenshot" | "file" {
  if (typeof input === "string") {
    return isValidUrl(input) ? "link" : "note";
  }

  const mime = input.type;
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "pdf";
  return "file";
}
