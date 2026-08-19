import type { Metadata } from "next";
import { Archivo_Black, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeInitScript } from "@/components/ThemeInitScript";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

const heming = localFont({
  src: "./fonts/heming-for-logo.ttf",
  variable: "--font-heming",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "2coreStudio",
    template: "%s — 2coreStudio",
  },
  description:
    "2coreStudio — multi-platform apps for web, Windows, Mac, Android, iOS and Linux.",
  openGraph: {
    title: "2coreStudio",
    description:
      "Multi-platform apps for web, Windows, Mac, Android, iOS and Linux.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${spaceMono.variable} ${heming.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeInitScript />
      </head>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
