import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google"; 
import "./globals.css";
import { Providers } from "./providers";

// Police standard pour le texte (lisible)
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

// Police "Tech/Futuriste" pour les titres et chiffres
const rajdhani = Rajdhani({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-rajdhani"
});

export const metadata: Metadata = {
  title: "NDI Vision 2025",
  description: "Outil d'analyse STL pour la Nuit de l'Info - Utopie3D",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} ${rajdhani.variable} font-sans antialiased bg-black text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}