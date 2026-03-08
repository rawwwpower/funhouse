"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Link, StickyNote, Upload, Loader2 } from "lucide-react";
import { cn, isValidUrl } from "@/lib/utils";

type AddMode = "url" | "note" | "file";

interface AddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitUrl: (url: string) => Promise<void>;
  onSubmitNote: (content: string) => Promise<void>;
  onSubmitFiles: (files: File[]) => Promise<void>;
}

export function AddModal({
  open,
  onOpenChange,
  onSubmitUrl,
  onSubmitNote,
  onSubmitFiles,
}: AddModalProps) {
  const [mode, setMode] = useState<AddMode>("url");
  const [urlValue, setUrlValue] = useState("");
  const [noteValue, setNoteValue] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      if (mode === "url" && urlValue.trim()) {
        await onSubmitUrl(urlValue.trim());
        setUrlValue("");
      } else if (mode === "note" && noteValue.trim()) {
        await onSubmitNote(noteValue.trim());
        setNoteValue("");
      }
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setLoading(true);
      try {
        await onSubmitFiles(files);
        onOpenChange(false);
      } finally {
        setLoading(false);
      }
    }
  }

  const modes = [
    { key: "url" as const, label: "Link", icon: Link },
    { key: "note" as const, label: "Note", icon: StickyNote },
    { key: "file" as const, label: "File", icon: Upload },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-[var(--color-text-primary)]">
              Add to library
            </Dialog.Title>
            <Dialog.Close className="rounded-md p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-secondary)]">
              <X size={18} />
            </Dialog.Close>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1 rounded-lg bg-[var(--color-bg-primary)] p-1 mb-4">
            {modes.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm transition-colors",
                  mode === key
                    ? "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                )}
              >
                <Icon size={14} strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>

          {/* URL input */}
          {mode === "url" && (
            <div className="space-y-3">
              <input
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="Paste a URL..."
                autoFocus
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-amber)] focus:outline-none focus:ring-1 focus:ring-[var(--color-amber)]/30"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isValidUrl(urlValue)) handleSubmit();
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={!isValidUrl(urlValue) || loading}
                className="w-full rounded-lg bg-[var(--color-amber)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg-primary)] transition-colors hover:bg-[var(--color-gold)] disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 size={16} className="mx-auto animate-spin" />
                ) : (
                  "Save link"
                )}
              </button>
            </div>
          )}

          {/* Note editor */}
          {mode === "note" && (
            <div className="space-y-3">
              <textarea
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                placeholder="Write a note..."
                autoFocus
                rows={6}
                className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-amber)] focus:outline-none focus:ring-1 focus:ring-[var(--color-amber)]/30"
              />
              <button
                onClick={handleSubmit}
                disabled={!noteValue.trim() || loading}
                className="w-full rounded-lg bg-[var(--color-amber)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg-primary)] transition-colors hover:bg-[var(--color-gold)] disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 size={16} className="mx-auto animate-spin" />
                ) : (
                  "Save note"
                )}
              </button>
            </div>
          )}

          {/* File upload */}
          {mode === "file" && (
            <label className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-primary)] p-8 transition-colors hover:border-[var(--color-amber)]/50">
              <Upload
                size={24}
                strokeWidth={1.5}
                className="text-[var(--color-text-muted)]"
              />
              <div className="text-center">
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                  Click to browse files
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  Images, PDFs, or any file up to 50MB
                </p>
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,application/pdf,.txt,.md,.zip"
              />
            </label>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
