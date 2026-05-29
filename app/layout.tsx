import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://www.expertisesdemaison.be";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Stéphanie Marcelis | Expert immobilier agréé IPI",
    template: "%s | Expertises de maison",
  },
  description:
    "Expertises immobilières indépendantes à Mons, Soignies, La Louvière, Binche et Charleroi. Ventes, séparations, successions et déclarations de succession.",
  keywords: [
    "expert immobilier",
    "expertise immobilière",
    "Mons",
    "Soignies",
    "La Louvière",
    "Binche",
    "Charleroi",
    "succession",
    "IPI",
  ],
  authors: [{ name: "Stéphanie Marcelis" }],
  openGraph: {
    type: "website",
    locale: "fr_BE",
    url: siteUrl,
    siteName: "Expertises de maison",
    title: "Stéphanie Marcelis | Expert immobilier agréé IPI",
    description:
      "Expertises immobilières indépendantes dans le Hainaut. Ventes, séparations, successions et déclarations de succession.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${openSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
