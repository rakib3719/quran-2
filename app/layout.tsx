import type { Metadata } from "next";
import { Amiri, Geist, Geist_Mono, Scheherazade_New } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const scheherazade = Scheherazade_New({
  variable: "--font-scheherazade",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Quran Mazid Clone",
  description: "Read Quran with surah, juz, page navigation and audio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${scheherazade.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
