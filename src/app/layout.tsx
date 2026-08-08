import type { Metadata, Viewport } from "next";
import { Poppins, Inter, Atma, Averia_Gruesa_Libre, Bree_Serif, Cookie, Beth_Ellen, Bungee, Bungee_Inline, Karla, Playfair_Display, Aref_Ruqaa, Cormorant_Garamond, Raleway } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PWAPrompt from "@/components/PWAPrompt";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-raleway",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const atma = Atma({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-atma",
  display: "swap",
});

const averia = Averia_Gruesa_Libre({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-averia",
  display: "swap",
});

const breeSerif = Bree_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bree-serif",
  display: "swap",
});

const cookie = Cookie({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cookie",
  display: "swap",
});

const bethEllen = Beth_Ellen({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-beth-ellen",
  display: "swap",
});

const bungee = Bungee({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bungee",
  display: "swap",
});

const bungeeInline = Bungee_Inline({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bungee-inline",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-karla",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair-display",
  display: "swap",
});

const arefRuqaa = Aref_Ruqaa({
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
  variable: "--font-aref-ruqaa",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3D1F08",
};

export const metadata: Metadata = {
  title: "Bintarti - Jasa Undangan Digital Pernikahan, Khitan, Ulang Tahun & Aqiqah",
  description: "Buat undangan digital premium dengan desain elegan dan modern. Cocok untuk pernikahan, khitan, ulang tahun, aqiqah, dan acara custom.",
  metadataBase: new URL("https://bintarti.store"),
  verification: {
    google: "i4FngW2CjJpS1EWxXRR5gxlQetD3uSJDFnBgIENp5Z0",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Bintarti - Jasa Undangan Digital Pernikahan, Khitan, Ulang Tahun & Aqiqah",
    description: "Buat undangan digital premium dengan desain elegan dan modern. Cocok untuk pernikahan, khitan, ulang tahun, aqiqah, dan acara custom.",
    type: "website",
    locale: "id_ID",
    url: "https://bintarti.store",
    siteName: "Bintarti",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Bintarti Undangan Digital Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bintarti - Jasa Undangan Digital Pernikahan, Khitan, Ulang Tahun & Aqiqah",
    description: "Buat undangan digital premium dengan desain elegan dan modern. Cocok untuk pernikahan, khitan, ulang tahun, aqiqah, dan acara custom.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${inter.variable} ${atma.variable} ${averia.variable} ${breeSerif.variable} ${cookie.variable} ${bethEllen.variable} ${bungee.variable} ${bungeeInline.variable} ${karla.variable} ${playfairDisplay.variable} ${arefRuqaa.variable} ${cormorantGaramond.variable} ${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900 overflow-x-hidden">
        {children}
        <PWAPrompt />
        <SpeedInsights />
      </body>
    </html>
  );
}


