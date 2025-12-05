import type { Metadata } from "next";
import { Inter } from "next/font/google"; // On utilise Inter qui est stable
import "./globals.css";
import { Providers } from "./providers";

// Configuration de la police Inter
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NDI Vision 2025",
  description: "Outil d'analyse STL pour la Nuit de l'Info - Utopie3D",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      {/* On applique la classe de la police Inter au body */}
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}