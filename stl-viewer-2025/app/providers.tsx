"use client";

import * as React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // J'ai retiré <HeroUIProvider> qui causait l'erreur.
    // On garde <main> pour conserver le fond sombre (dark mode).
    <main className="dark text-foreground bg-background h-full">
      {children}
    </main>
  );
}