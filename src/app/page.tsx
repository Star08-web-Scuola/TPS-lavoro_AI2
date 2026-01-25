import { MadeWithDyad } from "@/components/made-with-dyad";
import Link from "next/link";
import { Leaf, Route, BarChart, Truck, Train, BatteryCharging } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-[calc(100vh-100px)] p-4 sm:p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-6 row-start-1 items-center sm:items-start max-w-4xl w-full">
        <div className="text-center sm:text-left w-full">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center justify-center sm:justify-start gap-3">
            <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            GreenPath Analytics
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6">
            {t('Infrastructure for Sustainable Mobility')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <div className="border rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 flex items-center gap-2">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
                {t('Intermodal Dashboard')}
              </h2>
              <p className="text-muted-foreground mb-3 text-sm sm:text-base">
                {t('Real-time tracking of freight arriving at rail terminals and last-mile delivery status.')}
              </p>
              <Link href="/dashboard" className="inline-flex items-center gap-1 text-primary hover:underline text-sm sm:text-base">
                {t('View Dashboard')} →
              </Link>
            </div>

            <div className="border rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 flex items-center gap-2">
                <Route className="h-5 w-5 sm:h-6 sm:w-6" />
                {t('AI Route Optimizer')}
              </h2>
              <p className="text-muted-foreground mb-3 text-sm sm:text-base">
                {t('Energy-efficient routes for electric vans and cargo bikes considering traffic, charging stations, and ZTL restrictions.')}
              </p>
              <Link href="/route-optimizer" className="inline-flex items-center gap-1 text-primary hover:underline text-sm sm:text-base">
                {t('Optimize Routes')} →
              </Link>
            </div>

            <div className="border rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow md:col-span-2">
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 flex items-center gap-2">
                <BarChart className="h-5 w-5 sm:h-6 sm:w-6" />
                {t('Sustainability Reporting')}
              </h2>
              <p className="text-muted-foreground mb-3 text-sm sm:text-base">
                {t('Certified ESG reports on CO₂ savings compared to traditional road transport.')}
              </p>
              <Link href="/sustainability" className="inline-flex items-center gap-1 text-primary hover:underline text-sm sm:text-base">
                {t('Generate Reports')} →
              </Link>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 flex items-center justify-center sm:justify-start gap-2">
              <Train className="h-5 w-5 sm:h-6 sm:w-6" />
              {t('Our Mission')}
            </h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              {t('GreenPath Analytics optimizes intermodal logistics by connecting rail freight data with last-mile electric delivery fleets to reduce urban congestion and carbon emissions.')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="flex items-start gap-2">
                <BatteryCharging className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium text-sm sm:text-base">{t('Electric Last-Mile')}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t('Zero-emission delivery vehicles for urban areas')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Route className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium text-sm sm:text-base">{t('AI Optimization')}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t('Smart routing considering traffic and charging infrastructure')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <BarChart className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium text-sm sm:text-base">{t('ESG Compliance')}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t('Certified sustainability reporting for regulatory compliance')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
}