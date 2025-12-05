// app/providers.tsx
"use client";

import { HeroUIProvider } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      {/* On force le mode dark pour que ça colle à la 3D */}
      <main className="dark text-foreground bg-background h-full">
        {children}
      </main>
    </HeroUIProvider>
  );
}