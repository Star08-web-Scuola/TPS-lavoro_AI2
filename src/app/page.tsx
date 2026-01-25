import { MadeWithDyad } from "@/components/made-with-dyad";
import Link from "next/link";
import { Leaf, Route, BarChart, Truck, Train, BatteryCharging } from 'lucide-react';

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-[calc(100vh-100px)] p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start max-w-4xl">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Leaf className="h-8 w-8 text-green-600" />
            GreenPath Analytics
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Infrastructure for Sustainable Mobility
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                <Truck className="h-6 w-6" />
                Intermodal Dashboard
              </h2>
              <p className="text-muted-foreground mb-4">
                Real-time tracking of freight arriving at rail terminals and last-mile delivery status.
              </p>
              <Link href="/dashboard" className="inline-flex items-center gap-1 text-primary hover:underline">
                View Dashboard →
              </Link>
            </div>

            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                <Route className="h-6 w-6" />
                AI Route Optimizer
              </h2>
              <p className="text-muted-foreground mb-4">
                Energy-efficient routes for electric vans and cargo bikes considering traffic, charging stations, and ZTL restrictions.
              </p>
              <Link href="/route-optimizer" className="inline-flex items-center gap-1 text-primary hover:underline">
                Optimize Routes →
              </Link>
            </div>

            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow md:col-span-2">
              <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                <BarChart className="h-6 w-6" />
                Sustainability Reporting
              </h2>
              <p className="text-muted-foreground mb-4">
                Certified ESG reports on CO₂ savings compared to traditional road transport.
              </p>
              <Link href="/sustainability" className="inline-flex items-center gap-1 text-primary hover:underline">
                Generate Reports →
              </Link>
            </div>
          </div>

          <div className="border-t pt-8">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Train className="h-6 w-6" />
              Our Mission
            </h3>
            <p className="text-muted-foreground mb-4">
              GreenPath Analytics optimizes intermodal logistics by connecting rail freight data with last-mile electric delivery fleets to reduce urban congestion and carbon emissions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-start gap-3">
                <BatteryCharging className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Electric Last-Mile</h4>
                  <p className="text-sm text-muted-foreground">
                    Zero-emission delivery vehicles for urban areas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Route className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">AI Optimization</h4>
                  <p className="text-sm text-muted-foreground">
                    Smart routing considering traffic and charging infrastructure
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BarChart className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">ESG Compliance</h4>
                  <p className="text-sm text-muted-foreground">
                    Certified sustainability reporting for regulatory compliance
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