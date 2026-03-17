import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
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
  icons: {
    icon: "/croflux-mark.png",
    shortcut: "/croflux-mark.png",
    apple: "/croflux-mark.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${geistMono.variable} antialiased`}
        style={
          {
            "--sans": inter.style.fontFamily,
            "--mono": "var(--font-geist-mono), monospace",
          } as React.CSSProperties
        }
      >
        <Script id="croflux-theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var stored = localStorage.getItem("croflux-theme");
                var theme = stored || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
                document.documentElement.dataset.theme = theme;
                var href = "/croflux-mark.png";
                ["icon", "shortcut icon", "apple-touch-icon"].forEach(function (rel) {
                  var link = document.querySelector('link[rel="' + rel + '"]');
                  if (!link) {
                    link = document.createElement("link");
                    link.rel = rel;
                    document.head.appendChild(link);
                  }
                  link.href = href;
                });
              } catch (error) {}
            })();
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
