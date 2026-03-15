import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CroFlux",
  description:
    "CroFlux helps indie hackers and solo founders turn product strategy into milestones, tasks, and real startup progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${geistMono.variable} antialiased`}
        style={
          {
            "--sans": inter.style.fontFamily,
            "--mono": "var(--font-geist-mono), monospace",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
