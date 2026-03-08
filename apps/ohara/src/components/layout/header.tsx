"use client";

import { Search, Plus, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
}

export function Header({ searchQuery, onSearchChange, onAddClick }: HeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4">
      {/* Search */}
      <div className="relative flex-1 max-w-lg">
        <Search
          size={16}
          strokeWidth={1.5}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search your library... (⌘K)"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] py-2 pl-9 pr-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-amber)] focus:outline-none focus:ring-1 focus:ring-[var(--color-amber)]/30"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-amber)] px-3 py-2 text-sm font-medium text-[var(--color-bg-primary)] transition-colors hover:bg-[var(--color-gold)]"
        >
          <Plus size={16} strokeWidth={2} />
          Add
        </button>
        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-secondary)]"
          title="Sign out"
        >
          <LogOut size={16} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
