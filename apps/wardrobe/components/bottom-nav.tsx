"use client";

import { cn } from "@/lib/utils";
import { Shirt, Sparkles, Calendar, Lightbulb } from "lucide-react";

type Tab = "closet" | "outfits" | "calendar" | "suggestions";

const tabs: { key: Tab; label: string; icon: typeof Shirt }[] = [
  { key: "closet", label: "Armario", icon: Shirt },
  { key: "outfits", label: "Outfits", icon: Sparkles },
  { key: "calendar", label: "Calendario", icon: Calendar },
  { key: "suggestions", label: "Para vos", icon: Lightbulb },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
}) {
  return (
    <nav className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-border z-50">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={cn(
                "flex-1 flex flex-col items-center gap-0.5 py-2.5 pt-3 transition-colors",
                isActive ? "text-foreground" : "text-muted"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[11px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
