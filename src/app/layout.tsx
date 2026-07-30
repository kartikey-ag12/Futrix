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

export const metadata: Metadata = {
  title: "Futrix - Financial Intelligence",
  description: "Centralized financial intelligence platform with Xero and Tally integration.",
};

// Preconnect to external APIs used by the app — establishes TCP/TLS early
// so the first API call (Xero, Perplexity) doesn't pay connection overhead.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.perplexity.ai" />
        <link rel="preconnect" href="https://api.xero.com" />
        <link rel="dns-prefetch" href="https://api.perplexity.ai" />
        <link rel="dns-prefetch" href="https://api.xero.com" />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
