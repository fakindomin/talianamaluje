import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });
const serif = Cormorant_Garamond({ subsets: ["latin", "latin-ext"], weight: ["500", "600", "700"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "talianamaluje",
  description: "Editorial beauty portfolio i prywatne studio pracy dla makijazystki.",
  metadataBase: new URL("https://make-me-up.local")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${sans.variable} ${serif.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
