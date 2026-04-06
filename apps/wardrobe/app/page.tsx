"use client";

import { useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { ClosetScreen } from "@/components/screens/closet-screen";
import { ImportScreen } from "@/components/screens/import-screen";
import { OutfitsScreen } from "@/components/screens/outfits-screen";
import { CalendarScreen } from "@/components/screens/calendar-screen";
import { SuggestionsScreen } from "@/components/screens/suggestions-screen";
import { OnboardingScreen } from "@/components/screens/onboarding-screen";
import { PENDING_IMPORTS } from "@/lib/mock-data";
import { Mail } from "lucide-react";

type Tab = "closet" | "outfits" | "calendar" | "suggestions";
type View = "onboarding" | "main" | "import";

export default function Home() {
  const [view, setView] = useState<View>("onboarding");
  const [tab, setTab] = useState<Tab>("closet");

  if (view === "onboarding") {
    return <OnboardingScreen onComplete={() => setView("import")} />;
  }

  if (view === "import") {
    return <ImportScreen onBack={() => setView("main")} />;
  }

  const pendingCount = PENDING_IMPORTS.filter((i) => i.status === "pending").length;

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Import banner */}
      {pendingCount > 0 && tab === "closet" && (
        <button
          onClick={() => setView("import")}
          className="mx-5 mt-2 flex items-center gap-3 p-3.5 rounded-2xl bg-accent-soft border border-accent/20"
        >
          <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
            <Mail size={16} className="text-accent" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-semibold text-foreground">{pendingCount} prendas nuevas detectadas</p>
            <p className="text-xs text-muted">Toca para revisar y agregar</p>
          </div>
        </button>
      )}

      {/* Screen content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "closet" && <ClosetScreen />}
        {tab === "outfits" && <OutfitsScreen />}
        {tab === "calendar" && <CalendarScreen />}
        {tab === "suggestions" && <SuggestionsScreen />}
      </div>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
