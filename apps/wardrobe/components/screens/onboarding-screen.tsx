"use client";

import { useState } from "react";
import { Mail, Shield, ArrowRight, Shirt, Sparkles, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const BRANDS = ["Zara", "H&M", "ASOS", "Shein", "Mango", "Nike", "Uniqlo", "COS", "+50 mas"];

const STEPS = [
  {
    title: "Tu armario,\nsiempre al dia",
    subtitle: "Se actualiza solo con cada compra que haces online. Sin fotos, sin esfuerzo.",
    icon: Shirt,
  },
  {
    title: "Combina y\nplanea outfits",
    subtitle: "Arma looks con tus prendas y planifica que ponerte cada dia.",
    icon: Sparkles,
  },
  {
    title: "Conecta tu email",
    subtitle: "Vamos a buscar tus compras de ropa automaticamente de las tiendas que usas.",
    icon: Mail,
    isAction: true,
  },
];

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  }

  return (
    <div className="flex flex-col min-h-dvh px-6 pb-10">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-16">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === step ? "w-6 bg-foreground" : "w-1.5 bg-stone-200"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col"
        >
          {/* Icon */}
          <div className="flex justify-center mt-16 mb-10">
            <div className="w-28 h-28 rounded-full bg-accent-soft flex items-center justify-center">
              <current.icon size={44} className="text-accent" strokeWidth={1.5} />
            </div>
          </div>

          {/* Copy */}
          <h1 className="text-[32px] font-bold tracking-tight leading-tight whitespace-pre-line">
            {current.title}
          </h1>
          <p className="text-base text-muted mt-3 leading-relaxed">
            {current.subtitle}
          </p>

          {/* Brands (only on email step) */}
          {current.isAction && (
            <div className="mt-8">
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
                Detectamos compras de:
              </p>
              <div className="flex flex-wrap gap-2">
                {BRANDS.map((brand) => (
                  <span
                    key={brand}
                    className="px-3.5 py-2 rounded-full bg-stone-100 text-sm font-medium text-stone-600"
                  >
                    {brand}
                  </span>
                ))}
              </div>

              {/* Privacy */}
              <div className="flex items-start gap-2.5 mt-6 text-xs text-muted leading-relaxed">
                <Shield size={16} className="flex-shrink-0 mt-0.5" />
                <p>Solo leemos emails de tiendas conocidas. Nunca accedemos a emails personales.</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <div className="mt-auto space-y-3 pt-6">
        <button
          onClick={next}
          className="w-full py-4 bg-foreground text-background rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          {current.isAction ? "Conectar Gmail" : "Continuar"}
          <ArrowRight size={18} />
        </button>

        {current.isAction && (
          <button
            onClick={onComplete}
            className="w-full py-3 text-muted text-sm font-medium"
          >
            Prefiero agregar ropa manualmente
          </button>
        )}
      </div>
    </div>
  );
}
