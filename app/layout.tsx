import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { rgbTriplet, softTintRgbTriplet } from "@/lib/color";
import { getProfile } from "@/lib/db";

const sans = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });
const serif = Cormorant_Garamond({ subsets: ["latin", "latin-ext"], weight: ["500", "600", "700"], variable: "--font-serif" });

const siteUrl = "https://talianamaluje-fakindomin.vercel.app";
const description = "Editorial beauty portfolio i prywatne studio pracy dla makijazystki.";

export const metadata: Metadata = {
  title: { default: "talianamaluje", template: "%s · talianamaluje" },
  description,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "talianamaluje",
    title: "talianamaluje",
    description,
    images: [{ url: "/logo-full.webp", width: 700, height: 534, alt: "talianamaluje — makeup artist" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "talianamaluje",
    description,
    images: ["/logo-full.webp"]
  }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const profile = await getProfile();
  const accentStyle = {
    "--color-accent-rgb": rgbTriplet(profile.accentColor),
    "--color-soft-accent-rgb": softTintRgbTriplet(profile.accentColor)
  } as React.CSSProperties;

  return (
    <html lang="pl" className={`${sans.variable} ${serif.variable}`} style={accentStyle}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
