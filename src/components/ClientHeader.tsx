"use client";

import Link from "next/link";
import { Leaf, Route, BarChart, Truck, LogOut, LogIn, Menu, X } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/components/language/LanguageContext';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function ClientHeader() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { href: "/dashboard", icon: <Truck className="h-4 w-4" />, label: t('dashboard') },
    { href: "/route-optimizer", icon: <Route className="h-4 w-4" />, label: t('routeOptimizer') },
    { href: "/sustainability", icon: <BarChart className="h-4 w-4" />, label: t('sustainability') }
  ];

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="font-bold text-xl">GreenPath Analytics</span>
        </Link>

        {isMobile ? (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>

                <div className="flex-1 overflow-auto">
                  <nav className="flex flex-col gap-4 mb-8">
                    {user && navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Language</span>
                      <LanguageSwitcher />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Theme</span>
                      <ThemeSwitcher />
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  {user ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('logout')}</span>
                    </Button>
                  ) : (
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>{t('login')}</span>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <>
            <div className="flex items-center gap-4">
              {user && (
                <nav className="flex items-center gap-6">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="flex items-center gap-1 hover:text-primary">
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              )}
            </div>

            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeSwitcher />
              {user ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('logout')}</span>
                </Button>
              ) : (
                <Link href="/login" className="flex items-center gap-1 hover:text-primary">
                  <LogIn className="h-4 w-4" />
                  <span>{t('login')}</span>
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}