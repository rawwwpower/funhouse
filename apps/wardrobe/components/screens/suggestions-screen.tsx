"use client";

import { useState } from "react";
import { RefreshCw, Sun, CloudRain, Thermometer } from "lucide-react";
import { ITEMS, daysSince } from "@/lib/mock-data";

const SUGGESTION_SETS = [
  { items: ["2", "3", "6"], reason: "Ideal para 22° y sol", icon: "☀️" },
  { items: ["14", "9", "16"], reason: "Casual elegante para la tarde", icon: "✨" },
  { items: ["11", "12", "10"], reason: "Comodo para un dia nublado", icon: "☁️" },
];

export function SuggestionsScreen() {
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const suggestion = SUGGESTION_SETS[currentSuggestion];
  const suggestionItems = suggestion.items.map((id) => ITEMS.find((i) => i.id === id)!);

  // Items not worn in 30+ days
  const forgotten = ITEMS
    .filter((i) => {
      const days = daysSince(i.lastWorn);
      return days !== null && days > 30;
    })
    .sort((a, b) => (daysSince(a.lastWorn) ?? 0) - (daysSince(b.lastWorn) ?? 0))
    .reverse()
    .slice(0, 4);

  const usedThisMonth = new Set(
    ITEMS.filter((i) => {
      if (!i.lastWorn) return false;
      const d = new Date(i.lastWorn);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).map((i) => i.id)
  ).size;

  function nextSuggestion() {
    setCurrentSuggestion((prev) => (prev + 1) % SUGGESTION_SETS.length);
  }

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="px-5 pt-14 pb-2">
        <h1 className="text-[28px] font-bold tracking-tight">Que me pongo?</h1>
      </div>

      {/* Weather context */}
      <div className="mx-5 mt-2 rounded-2xl bg-card border border-border/50 p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl">
          ☀️
        </div>
        <div>
          <p className="font-semibold text-[15px]">22°C  Soleado</p>
          <p className="text-sm text-muted">Buenos Aires · Sabado</p>
        </div>
      </div>

      {/* Suggestion card */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Para vos</h2>
          <button
            onClick={nextSuggestion}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            <RefreshCw size={14} />
            Otra opcion
          </button>
        </div>

        <div className="bg-card rounded-2xl border border-border/50 p-4">
          <div className="flex gap-2.5">
            {suggestionItems.map((item) => (
              <div key={item.id} className="flex-1 flex flex-col items-center">
                <div className="w-full aspect-square rounded-xl bg-stone-100 flex items-center justify-center">
                  <span className="text-3xl">{item.image}</span>
                </div>
                <p className="text-[11px] text-muted mt-2 text-center">{item.name}</p>
              </div>
            ))}
          </div>

          {/* Reason tag */}
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-soft">
            <span className="text-sm">{suggestion.icon}</span>
            <span className="text-xs font-semibold text-accent">{suggestion.reason}</span>
          </div>

          {/* Action */}
          <button className="w-full mt-4 py-3.5 bg-foreground text-background rounded-2xl font-semibold text-sm active:scale-[0.98] transition-transform">
            Me lo pongo
          </button>
        </div>
      </div>

      {/* Forgotten items */}
      <div className="px-5 mt-6">
        <h2 className="text-lg font-semibold">Prendas olvidadas</h2>
        <p className="text-sm text-muted mt-0.5 mb-3">Redescubri tu armario</p>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
          {forgotten.map((item) => {
            const days = daysSince(item.lastWorn);
            return (
              <div key={item.id} className="flex-shrink-0 w-[110px] bg-card rounded-2xl border border-border/50 p-3">
                <div className="w-full h-[72px] rounded-xl bg-stone-100 flex items-center justify-center">
                  <span className="text-2xl">{item.image}</span>
                </div>
                <p className="text-xs font-medium mt-2 truncate">{item.name}</p>
                <p className="text-[10px] text-muted mt-0.5">Sin usar {days} dias</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="mx-5 mt-5 rounded-2xl bg-stone-50 border border-border/50 p-4 flex items-center gap-3">
        <span className="text-lg">📊</span>
        <p className="text-sm font-medium text-stone-600">
          Usaste {usedThisMonth} de {ITEMS.length} prendas este mes
        </p>
      </div>
    </div>
  );
}
