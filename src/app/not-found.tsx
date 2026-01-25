"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, Box, Truck, Cat } from "lucide-react";
import { useLanguage } from '@/components/language/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-background to-muted/20">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              {/* Warehouse background */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg border-4 border-amber-300"></div>

              {/* Warehouse shelves */}
              <div className="absolute inset-2 grid grid-cols-3 gap-1">
                <div className="bg-amber-200 border border-amber-400 rounded-sm"></div>
                <div className="bg-amber-200 border border-amber-400 rounded-sm"></div>
                <div className="bg-amber-200 border border-amber-400 rounded-sm"></div>
                <div className="bg-amber-200 border border-amber-400 rounded-sm"></div>
                <div className="bg-amber-200 border border-amber-400 rounded-sm"></div>
                <div className="bg-amber-200 border border-amber-400 rounded-sm"></div>
                <div className="bg-amber-200 border border-amber-400 rounded-sm"></div>
                <div className="bg-amber-200 border border-amber-400 rounded-sm"></div>
                <div className="bg-amber-200 border border-amber-400 rounded-sm"></div>
              </div>

              {/* Improved Cat - now looks more like a cat */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  {/* Cat head */}
                  <div className="w-12 h-10 bg-orange-400 rounded-full relative">
                    {/* Ears */}
                    <div className="absolute -top-2 left-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-orange-400"></div>
                    <div className="absolute -top-2 right-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-orange-400"></div>

                    {/* Eyes */}
                    <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full"></div>

                    {/* Nose */}
                    <div className="absolute top-3.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-400 rounded-full"></div>

                    {/* Whiskers */}
                    <div className="absolute top-4 left-1 w-4 h-0.5 bg-gray-600 transform -rotate-12"></div>
                    <div className="absolute top-4 left-1 w-4 h-0.5 bg-gray-600 transform rotate-12"></div>
                    <div className="absolute top-4 right-1 w-4 h-0.5 bg-gray-600 transform -rotate-12"></div>
                    <div className="absolute top-4 right-1 w-4 h-0.5 bg-gray-600 transform rotate-12"></div>
                  </div>

                  {/* Cat body */}
                  <div className="w-14 h-8 bg-orange-400 rounded-b-full mx-auto relative">
                    {/* Tail */}
                    <div className="absolute -right-4 top-2 w-6 h-1 bg-orange-400 transform rotate-45 rounded-sm"></div>
                  </div>
                </div>
              </div>

              {/* Searching animation */}
              <div className="absolute -right-8 top-8 w-6 h-6 bg-yellow-400 rounded-full opacity-80 animate-ping"></div>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
          <Search className="h-8 w-8" />
          404
        </h1>

        <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
          {t('Page Not Found')}
        </h2>

        <p className="text-lg text-muted-foreground mb-8">
          {t('Our warehouse cat is searching everywhere but cannot find this page.')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="flex items-center gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              {t('Return Home')}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="flex items-center gap-2">
            <Link href="/dashboard">
              <Truck className="h-4 w-4" />
              {t('Go to Dashboard')}
            </Link>
          </Button>
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Cat className="h-4 w-4" />
            {t('Our warehouse cat will keep searching...')}
          </p>
        </div>
      </div>
    </div>
  );
}