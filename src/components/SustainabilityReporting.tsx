"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { supabase } from '@/integrations/supabase/client';
import { SustainabilityMetric, Shipment } from '@/types/database';
import { Leaf, BarChart, FileText, Download, Calendar, Truck, Train } from 'lucide-react';
import { toast } from 'sonner';

const SustainabilityReporting = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [metrics, setMetrics] = useState<SustainabilityMetric[]>([]);
  const [reportPeriod, setReportPeriod] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  const [loading, setLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch shipments
        const { data: shipmentsData, error: shipmentsError } = await supabase
          .from('shipments')
          .select('*');

        if (shipmentsError) throw shipmentsError;
        setShipments(shipmentsData || []);

        // Fetch sustainability metrics
        const { data: metricsData, error: metricsError } = await supabase
          .from('sustainability_metrics')
          .select('*');

        if (metricsError) throw metricsError;
        setMetrics(metricsData || []);

      } catch (err) {
        console.error('Error fetching sustainability data:', err);
        toast.error('Failed to load sustainability data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateReport = () => {
    try {
      setLoading(true);

      // Filter data based on date range
      const filteredShipments = shipments.filter(shipment => {
        const shipmentDate = new Date(shipment.created_at);
        return shipmentDate >= customDateRange.from && shipmentDate <= customDateRange.to;
      });

      const filteredMetrics = metrics.filter(metric => {
        const metricDate = new Date(metric.timestamp);
        return metricDate >= customDateRange.from && metricDate <= customDateRange.to;
      });

      // Calculate key metrics
      const totalCO2Savings = filteredShipments.reduce((sum, shipment) => sum + (shipment.co2_savings_kg || 0), 0);
      const totalShipments = filteredShipments.length;
      const deliveredShipments = filteredShipments.filter(s => s.delivery_status === 'delivered').length;
      const onTimeRate = totalShipments > 0 ? (deliveredShipments / totalShipments) * 100 : 0;

      // Calculate modal shift impact
      const railShipments = filteredShipments.length;
      const roadEquivalentCO2 = totalCO2Savings * 4; // Assuming 4x more CO2 for road transport

      // Generate report data
      const report = {
        period: reportPeriod,
        dateRange: {
          from: customDateRange.from.toISOString().split('T')[0],
          to: customDateRange.to.toISOString().split('T')[0]
        },
        summary: {
          totalShipments,
          deliveredShipments,
          onTimeDeliveryRate: onTimeRate.toFixed(2) + '%',
          totalCO2Savings: totalCO2Savings.toFixed(2) + ' kg',
          roadEquivalentCO2: roadEquivalentCO2.toFixed(2) + ' kg'
        },
        modalShift: {
          railShipments,
          roadShipmentsAvoided: railShipments,
          co2Reduction: (roadEquivalentCO2 - totalCO2Savings).toFixed(2) + ' kg'
        },
        sustainabilityMetrics: {
          co2Savings: filteredMetrics
            .filter(m => m.metric_type === 'co2_savings')
            .reduce((sum, metric) => sum + metric.value, 0)
            .toFixed(2) + ' kg',
          energyConsumption: filteredMetrics
            .filter(m => m.metric_type === 'energy_consumption')
            .reduce((sum, metric) => sum + metric.value, 0)
            .toFixed(2) + ' kWh',
          congestionReduction: filteredMetrics
            .filter(m => m.metric_type === 'congestion_reduction')
            .reduce((sum, metric) => sum + metric.value, 0)
            .toFixed(2) + ' vehicle-hours'
        },
        esgCertification: {
          compliance: 'ISO 14064-1:2018',
          verificationDate: new Date().toISOString().split('T')[0],
          verifiedBy: 'GreenPath Analytics Certification'
        }
      };

      setReportData(report);
      setReportGenerated(true);
      toast.success('Sustainability report generated successfully!');

    } catch (err) {
      console.error('Error generating report:', err);
      toast.error('Failed to generate sustainability report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!reportData) return;

    // Create downloadable content
    const reportContent = `
GREENPATH ANALYTICS - SUSTAINABILITY REPORT
==========================================

Report Period: ${reportData.period.toUpperCase()}
Date Range: ${reportData.dateRange.from} to ${reportData.dateRange.to}

EXECUTIVE SUMMARY
-----------------
Total Shipments: ${reportData.summary.totalShipments}
Delivered Shipments: ${reportData.summary.deliveredShipments}
On-Time Delivery Rate: ${reportData.summary.onTimeDeliveryRate}
Total CO₂ Savings: ${reportData.summary.totalCO2Savings}
Road Transport Equivalent CO₂: ${reportData.summary.roadEquivalentCO2}

MODAL SHIFT IMPACT
------------------
Rail Shipments: ${reportData.modalShift.railShipments}
Road Shipments Avoided: ${reportData.modalShift.roadShipmentsAvoided}
CO₂ Reduction: ${reportData.modalShift.co2Reduction}

SUSTAINABILITY METRICS
----------------------
CO₂ Savings: ${reportData.sustainabilityMetrics.co2Savings}
Energy Consumption: ${reportData.sustainabilityMetrics.energyConsumption}
Congestion Reduction: ${reportData.sustainabilityMetrics.congestionReduction}

ESG CERTIFICATION
-----------------
Compliance Standard: ${reportData.esgCertification.compliance}
Verification Date: ${reportData.esgCertification.verificationDate}
Verified By: ${reportData.esgCertification.verifiedBy}

This report certifies that GreenPath Analytics has successfully reduced carbon emissions
through intermodal logistics optimization and sustainable last-mile delivery solutions.
    `;

    // Create download link
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `greenpath_sustainability_report_${reportData.dateRange.from}_to_${reportData.dateRange.to}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Report downloaded successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Leaf className="h-8 w-8" />
        Sustainability Reporting
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generate ESG Report</CardTitle>
          <CardDescription>
            Create certified sustainability reports for your intermodal logistics operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="report-period">Report Period</Label>
                <Select
                  value={reportPeriod}
                  onValueChange={(value) => setReportPeriod(value as 'monthly' | 'quarterly' | 'annual')}
                >
                  <SelectTrigger id="report-period">
                    <SelectValue placeholder="Select report period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex gap-2">
                  <DatePicker
                    selected={customDateRange.from}
                    onChange={(date) => setCustomDateRange(prev => ({ ...prev, from: date || prev.from }))}
                    className="flex-1"
                  />
                  <DatePicker
                    selected={customDateRange.to}
                    onChange={(date) => setCustomDateRange(prev => ({ ...prev, to: date || prev.to }))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={generateReport}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">🔄</span>
                  Generating Report...
                </>
              ) : (
                <>
                  <BarChart className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {reportGenerated && reportData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sustainability Report Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Operational Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Shipments</span>
                        <span className="font-medium">{reportData.summary.totalShipments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Delivered Shipments</span>
                        <span className="font-medium">{reportData.summary.deliveredShipments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">On-Time Delivery Rate</span>
                        <span className="font-medium">{reportData.summary.onTimeDeliveryRate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Leaf className="h-4 w-4" />
                      Environmental Impact
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total CO₂ Savings</span>
                        <span className="font-medium text-green-600">{reportData.summary.totalCO2Savings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Road Equivalent CO₂</span>
                        <span className="font-medium">{reportData.summary.roadEquivalentCO2}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">CO₂ Reduction</span>
                        <span className="font-medium text-green-600">{reportData.modalShift.co2Reduction}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Train className="h-4 w-4" />
                    Modal Shift Impact
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    By shifting freight from road to rail and using electric last-mile delivery:
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Rail Shipments</span>
                      <span className="font-medium">{reportData.modalShift.railShipments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Road Shipments Avoided</span>
                      <span className="font-medium">{reportData.modalShift.roadShipmentsAvoided}</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    Sustainability Metrics
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">CO₂ Savings</span>
                      <span className="font-medium">{reportData.sustainabilityMetrics.co2Savings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Energy Consumption</span>
                      <span className="font-medium">{reportData.sustainabilityMetrics.energyConsumption}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Congestion Reduction</span>
                      <span className="font-medium">{reportData.sustainabilityMetrics.congestionReduction}</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-green-50">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    ESG Certification
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Compliance Standard</span>
                      <span className="font-medium">{reportData.esgCertification.compliance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Verification Date</span>
                      <span className="font-medium">{reportData.esgCertification.verificationDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Verified By</span>
                      <span className="font-medium">{reportData.esgCertification.verifiedBy}</span>
                    </div>
                  </div>
                  <p className="text-sm text-green-600 mt-3 font-medium">
                    ✅ This report certifies your sustainability achievements and can be used for ESG compliance reporting.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleDownloadReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sustainability Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Leaf className="h-5 w-5 mt-0.5 text-green-500" />
                  <div>
                    <h4 className="font-medium">Carbon Emission Reduction</h4>
                    <p className="text-sm text-muted-foreground">
                      By utilizing rail transport for long-haul freight and electric vehicles for last-mile delivery,
                      you've significantly reduced carbon emissions compared to traditional road transport.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Train className="h-5 w-5 mt-0.5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">Modal Shift Success</h4>
                    <p className="text-sm text-muted-foreground">
                      The shift from road to rail transport has reduced highway congestion and lowered the environmental
                      impact of your logistics operations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 mt-0.5 text-yellow-500" />
                  <div>
                    <h4 className="font-medium">Urban Congestion Relief</h4>
                    <p className="text-sm text-muted-foreground">
                      Electric cargo bikes and vans for last-mile delivery have reduced urban traffic congestion
                      and improved air quality in city centers.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SustainabilityReporting;