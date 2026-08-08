import type { Metadata, Viewport } from "next";
import { Poppins, Inter, Cormorant_Garamond, Raleway } from "next/font/google";
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
      className={`${poppins.variable} ${inter.variable} ${cormorantGaramond.variable} ${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900 overflow-x-hidden">
        {children}
        <PWAPrompt />
        <SpeedInsights />
      </body>
    </html>
  );
}


