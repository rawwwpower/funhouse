"use client";

import { useState, useEffect, useCallback } from "react";

interface UseDropZoneOptions {
  onDrop: (files: File[]) => void;
  onPaste?: (text: string) => void;
}

export function useDropZone({ onDrop, onPaste }: UseDropZoneOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    if (e.dataTransfer?.types.includes("Files")) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const next = prev - 1;
      if (next === 0) setIsDragging(false);
      return next;
    });
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragCounter(0);

      const files = Array.from(e.dataTransfer?.files || []);
      if (files.length > 0) {
        onDrop(files);
      }
    },
    [onDrop]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      // Check for files (images from clipboard)
      const files = Array.from(e.clipboardData?.files || []);
      if (files.length > 0) {
        onDrop(files);
        return;
      }

      // Check for text (URLs, notes)
      const text = e.clipboardData?.getData("text/plain");
      if (text && onPaste) {
        onPaste(text);
      }
    },
    [onDrop, onPaste]
  );

  useEffect(() => {
    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
      document.removeEventListener("paste", handlePaste);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handlePaste]);

  return { isDragging };
}
