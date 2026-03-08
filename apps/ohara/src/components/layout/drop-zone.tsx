"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";

interface DropZoneOverlayProps {
  isDragging: boolean;
}

export function DropZoneOverlay({ isDragging }: DropZoneOverlayProps) {
  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="drop-zone-overlay fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="rounded-2xl border-2 border-dashed border-[var(--color-amber)] p-8">
              <Upload
                className="h-12 w-12 text-[var(--color-amber)]"
                strokeWidth={1.5}
              />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-[var(--color-text-primary)]">
                Drop to add to your library
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Images, PDFs, files — anything goes
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
