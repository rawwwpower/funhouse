import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
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
  title: "ohara — Your Tree of Knowledge",
  description:
    "A personal knowledge library. Drop anything — links, screenshots, PDFs, notes — and AI organizes it for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
            },
          }}
        />
      </body>
    </html>
  );
}
