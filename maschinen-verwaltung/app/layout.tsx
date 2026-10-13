import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Seitentitel und Sprache, beides aus der Barrierefreiheits-Checkliste
// (ADR 0009, Abschnitt B). Vorher stand hier der Vorgabewert von
// create-next-app: Titel "Create Next App" und lang="en".
//
// Der Titel benennt die Seite zuerst und die Anwendung danach, weil
// Hilfstechnik ihn beim Wechsel vorliest und der Unterschied vorn stehen muss
// (WCAG 2.4.2). Die Vorlage gilt nur fuer untergeordnete Seiten, der
// Vorgabewert greift, wenn eine Seite keinen eigenen Titel setzt.
export const metadata: Metadata = {
  title: {
    template: "%s · Maschinenverleih",
    default: "Maschinenverleih",
  },
  description:
    "Maschinen nach Verfügbarkeit suchen und reservieren. Projekt der Gruppe 11.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      // Die Anwendung ist deutsch. Ohne das liest eine Sprachausgabe den
      // deutschen Text mit englischen Ausspracheregeln (WCAG 3.1.1).
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
