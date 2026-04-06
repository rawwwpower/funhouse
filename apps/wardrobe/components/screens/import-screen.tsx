"use client";

import { useState } from "react";
import { Check, X, ArrowLeft, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { PENDING_IMPORTS, formatPrice } from "@/lib/mock-data";

export function ImportScreen({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState(PENDING_IMPORTS);

  const approved = items.filter((i) => i.status === "approved").length;
  const pending = items.filter((i) => i.status === "pending").length;

  function setStatus(id: string, status: "approved" | "skipped") {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }

  return (
    <div className="flex flex-col pb-8">
      {/* Header */}
      <div className="px-5 pt-14 pb-2">
        <button onClick={onBack} className="flex items-center gap-1.5 text-muted text-sm mb-4">
          <ArrowLeft size={18} />
          Armario
        </button>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center">
            <Mail size={18} className="text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Nuevas prendas</h1>
            <p className="text-sm text-muted">Detectadas de tus emails de compra</p>
          </div>
        </div>
      </div>

      {/* Counters */}
      <div className="px-5 py-3 flex gap-2">
        <div className="px-4 py-2 rounded-full bg-accent-soft text-accent text-[13px] font-semibold">
          {approved} aprobadas
        </div>
        <div className="px-4 py-2 rounded-full bg-stone-100 text-stone-500 text-[13px] font-medium">
          {pending} pendientes
        </div>
      </div>

      {/* Items */}
      <div className="px-5 space-y-3 mt-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "bg-card rounded-2xl border overflow-hidden transition-all",
              item.status === "skipped" ? "opacity-40 border-border/30" : "border-border/50"
            )}
          >
            <div className="flex items-center gap-4 p-4">
              {/* Image */}
              <div className="w-20 h-20 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">{item.image}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-muted tracking-wide uppercase">{item.brand}</p>
                <p className="text-[15px] font-semibold mt-0.5">{item.name}</p>
                <p className="text-sm text-muted mt-0.5">{item.color} · Talle {item.size}</p>
                <p className="text-sm font-medium mt-1">{formatPrice(item.price)}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                {item.status === "pending" ? (
                  <>
                    <button
                      onClick={() => setStatus(item.id, "approved")}
                      className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors"
                    >
                      <Check size={18} className="text-accent" />
                    </button>
                    <button
                      onClick={() => setStatus(item.id, "skipped")}
                      className="w-11 h-11 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                    >
                      <X size={16} className="text-stone-400" />
                    </button>
                  </>
                ) : item.status === "approved" ? (
                  <div className="px-3 py-1.5 rounded-full bg-accent-soft text-accent text-xs font-semibold">
                    Listo ✓
                  </div>
                ) : (
                  <div className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-400 text-xs font-medium">
                    Omitida
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {approved > 0 && (
        <div className="px-5 mt-6">
          <button
            onClick={onBack}
            className="w-full py-4 bg-foreground text-background rounded-2xl font-semibold text-[15px] active:scale-[0.98] transition-transform"
          >
            Agregar {approved} prendas al armario
          </button>
        </div>
      )}
    </div>
  );
}
