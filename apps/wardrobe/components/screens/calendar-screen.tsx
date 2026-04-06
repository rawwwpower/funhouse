"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ITEMS, OUTFITS } from "@/lib/mock-data";

const DAYS = ["L", "M", "X", "J", "V", "S", "D"];

function getWeekDays(baseDate: Date) {
  const day = baseDate.getDay();
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - ((day + 6) % 7));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function OutfitPreview({ outfit }: { outfit: (typeof OUTFITS)[0] }) {
  const outfitItems = outfit.items.map((id) => ITEMS.find((i) => i.id === id)!).filter(Boolean);

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[11px] font-medium text-muted uppercase tracking-wide">Outfit planeado</p>
          <p className="font-semibold text-[15px] mt-0.5">{outfit.name}</p>
        </div>
        <button className="px-3.5 py-1.5 rounded-full bg-accent-soft text-accent text-xs font-semibold active:scale-95 transition-transform">
          Me lo puse
        </button>
      </div>
      <div className="flex gap-2">
        {outfitItems.map((item) => (
          <div key={item.id} className="w-20 h-20 rounded-xl bg-stone-100 flex items-center justify-center">
            <span className="text-2xl">{item.image}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CalendarScreen() {
  const [currentDate] = useState(new Date());
  const weekDays = getWeekDays(currentDate);
  const today = new Date().toISOString().split("T")[0];

  const todayOutfit = OUTFITS.find((o) => o.date === today);
  const upcomingOutfits = OUTFITS.filter(
    (o) => o.date && o.date > today
  ).sort((a, b) => a.date!.localeCompare(b.date!));

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="px-5 pt-14 pb-2">
        <h1 className="text-[28px] font-bold tracking-tight">Calendario</h1>
        <p className="text-sm text-muted mt-0.5">
          {currentDate.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Week strip */}
      <div className="px-3 py-3">
        <div className="flex gap-1">
          {weekDays.map((date, i) => {
            const dateStr = date.toISOString().split("T")[0];
            const isToday = dateStr === today;
            const hasOutfit = OUTFITS.some((o) => o.date === dateStr);

            return (
              <button
                key={i}
                className={cn(
                  "flex-1 flex flex-col items-center py-3 rounded-xl transition-colors",
                  isToday
                    ? "bg-foreground text-background"
                    : "bg-stone-50 text-foreground"
                )}
              >
                <span className={cn("text-xs font-medium", isToday ? "text-background/60" : "text-muted")}>
                  {DAYS[i]}
                </span>
                <span className="text-lg font-semibold mt-0.5">{date.getDate()}</span>
                {hasOutfit && (
                  <div className={cn("w-1.5 h-1.5 rounded-full mt-1", isToday ? "bg-accent" : "bg-accent")} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Today */}
      <div className="px-5 mt-2">
        <h2 className="text-lg font-semibold mb-3">
          Hoy, {currentDate.toLocaleDateString("es-AR", { weekday: "long", day: "numeric" })}
        </h2>

        {todayOutfit ? (
          <OutfitPreview outfit={todayOutfit} />
        ) : (
          <div className="bg-stone-50 rounded-2xl border border-dashed border-stone-200 p-6 text-center">
            <p className="text-sm text-muted">Sin outfit planeado</p>
            <button className="mt-2 text-sm font-medium text-accent">+ Planear outfit</button>
          </div>
        )}
      </div>

      {/* Upcoming */}
      <div className="px-5 mt-6">
        <h2 className="text-lg font-semibold mb-3">Proximos dias</h2>
        <div className="space-y-3">
          {upcomingOutfits.length > 0 ? (
            upcomingOutfits.map((outfit) => {
              const outfitItems = outfit.items.map((id) => ITEMS.find((i) => i.id === id)!).filter(Boolean);
              const date = new Date(outfit.date!);

              return (
                <div key={outfit.id} className="bg-card rounded-2xl border border-border/50 p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric" })}</p>
                    <p className="text-sm text-muted mt-0.5">{outfit.name}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {outfitItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
                        <span className="text-base">{item.image}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-stone-50 rounded-2xl border border-dashed border-stone-200 p-6 text-center">
              <p className="text-sm text-muted">Nada planeado todavia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
