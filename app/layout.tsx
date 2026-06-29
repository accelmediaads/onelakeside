import type { Metadata } from "next";
import { Inter, Montserrat, Cormorant_Garamond } from "next/font/google";
import LenisProvider from "@/components/lhni/LenisProvider";
import LHNINav from "@/components/lhni/LHNINav";
import LHNIFooter from "@/components/lhni/LHNIFooter";
import MetaPixel from "@/components/lhni/MetaPixel";
import GoogleAdsTag from "@/components/lhni/GoogleAdsTag";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

// Serif used by the One Lakeside light theme (see .one-lakeside in globals.css)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  // Update this if the production subdomain changes — it only affects the base
  // for absolute OG/canonical URLs.
  metadataBase: new URL("https://onelakeside.luxuryhomesnorthidaho.com"),
  title: {
    default: "One Lakeside — Lakefront Condos in Downtown Coeur d'Alene",
    template: "%s | One Lakeside",
  },
  description:
    "Own a residence at One Lakeside — the only residential tower on the water in downtown Coeur d'Alene, Idaho. Furnished lakefront condos from the $590,000s with a rooftop terrace, hot tub, fitness center, and the lake at your door. Presented by Luxury Homes North Idaho.",
  openGraph: {
    title: "One Lakeside — Lakefront Condos in Downtown Coeur d'Alene",
    description:
      "The only residential tower on the water in downtown Coeur d'Alene. Furnished lakefront residences from the $590,000s.",
    type: "website",
    images: [
      {
        url: "/one-lakeside/one-lakeside-og.jpg",
        width: 1200,
        height: 630,
        alt: "Aerial view of One Lakeside condo tower beside Lake Coeur d'Alene, Idaho",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} ${cormorant.variable} antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        <MetaPixel />
        <GoogleAdsTag />
        <LenisProvider>
          <div className="lhni">
            <LHNINav />
            <main className="pt-20">{children}</main>
            <LHNIFooter />
          </div>
        </LenisProvider>
      </body>
    </html>
  );
}
