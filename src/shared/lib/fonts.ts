import { Geist_Mono, Instrument_Serif, Inter_Tight } from "next/font/google";

export const fontDisplay = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  variable: "--font-instrument",
});

export const fontSans = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const fontVariables = [
  fontDisplay.variable,
  fontSans.variable,
  fontMono.variable,
].join(" ");
