import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Leaf, Route, BarChart, Truck, User, LogOut, LogIn } from 'lucide-react';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { LanguageProvider } from '@/components/language/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language/LanguageContext';
import { useAuth } from '@/components/auth/AuthProvider';

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

// Client component for navigation
function Navigation() {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  return (
    <nav className="flex items-center gap-6">
      <Link href="/dashboard" className="flex items-center gap-1 hover:text-primary">
        <Truck className="h-4 w-4" />
        {t('dashboard')}
      </Link>
      <Link href="/route-optimizer" className="flex items-center gap-1 hover:text-primary">
        <Route className="h-4 w-4" />
        {t('routeOptimizer')}
      </Link>
      <Link href="/sustainability" className="flex items-center gap-1 hover:text-primary">
        <BarChart className="h-4 w-4" />
        {t('sustainability')}
      </Link>
    </nav>
  );
}

// Client component for auth buttons
function AuthButtons() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={signOut}
          className="flex items-center gap-1"
        >
          <LogOut className="h-4 w-4" />
          {t('logout')}
        </Button>
      </div>
    );
  }

  return (
    <Link href="/login" className="flex items-center gap-1 hover:text-primary">
      <LogIn className="h-4 w-4" />
      {t('login')}
    </Link>
  );
}

// Client component for the entire header
function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="font-bold text-xl">GreenPath Analytics</span>
        </Link>

        <div className="flex items-center gap-4">
          <Navigation />
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}

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
        <AuthProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <footer className="border-t py-4">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} GreenPath Analytics. Infrastructure for Sustainable Mobility.
                </div>
              </footer>
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}