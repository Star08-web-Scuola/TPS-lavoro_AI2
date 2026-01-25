import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Leaf, Route, BarChart, Truck } from 'lucide-react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreenPath Analytics - Sustainable Mobility Platform",
  description: "Optimize intermodal logistics and reduce carbon emissions with GreenPath Analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-green-600" />
                <span className="font-bold text-xl">GreenPath Analytics</span>
              </Link>
              <nav className="flex items-center gap-6">
                <Link href="/dashboard" className="flex items-center gap-1 hover:text-primary">
                  <Truck className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link href="/route-optimizer" className="flex items-center gap-1 hover:text-primary">
                  <Route className="h-4 w-4" />
                  Route Optimizer
                </Link>
                <Link href="/sustainability" className="flex items-center gap-1 hover:text-primary">
                  <BarChart className="h-4 w-4" />
                  Sustainability
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>

          <footer className="border-t py-4">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} GreenPath Analytics. Infrastructure for Sustainable Mobility.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}