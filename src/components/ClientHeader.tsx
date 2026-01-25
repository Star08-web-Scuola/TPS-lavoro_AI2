"use client";

import Link from "next/link";
import { Leaf, Route, BarChart, Truck, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/components/language/LanguageContext';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export function ClientHeader() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  console.log(`ClientHeader rendered, current language translations available`);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="font-bold text-xl">GreenPath Analytics</span>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
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
              {t('logout')}
            </Button>
          ) : (
            <Link href="/login" className="flex items-center gap-1 hover:text-primary">
              <LogIn className="h-4 w-4" />
              {t('login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}