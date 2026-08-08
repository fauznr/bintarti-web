import { 
  Atma, 
  Averia_Gruesa_Libre, 
  Bree_Serif, 
  Cookie, 
  Beth_Ellen, 
  Bungee, 
  Bungee_Inline, 
  Karla, 
  Playfair_Display, 
  Aref_Ruqaa
} from "next/font/google";

export const atmaFont = Atma({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-atma",
  display: "swap",
});

export const averiaFont = Averia_Gruesa_Libre({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-averia",
  display: "swap",
});

export const breeSerifFont = Bree_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bree-serif",
  display: "swap",
});

export const cookieFont = Cookie({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cookie",
  display: "swap",
});

export const bethFont = Beth_Ellen({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-beth-ellen",
  display: "swap",
});

export const bungeeFont = Bungee({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bungee",
  display: "swap",
});

export const bungeeInlineFont = Bungee_Inline({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bungee-inline",
  display: "swap",
});

export const karlaFont = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-karla",
  display: "swap",
});

export const playfairDisplayFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair-display",
  display: "swap",
});

export const arefRuqaaFont = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-aref-ruqaa",
  display: "swap",
});
