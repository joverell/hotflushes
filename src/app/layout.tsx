import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAllPages } from "@/lib/pages";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "The Hot Flushes Vocal Quartet | Melbourne",
  description: "Melbourne-based vocal quartet performing popular hits and show tunes from the 30s to the 70s since 2002.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pages = getAllPages();
  const navLinks = [
    { name: "Home", href: "/" },
    ...pages
      .filter(p => p.slug !== "home")
      .map(p => ({ 
        name: p.title, 
        href: `/${p.slug === "index" ? "" : p.slug}` 
      }))
  ];

  return (
    <html lang="en-AU" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased font-sans flex min-h-screen flex-col bg-background">
        <Navbar navLinks={navLinks} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
