"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Shipment, Hub } from '@/types/database';
import { MapPin, Truck, Train, Leaf, Clock, AlertTriangle, RefreshCw, Plus } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { CreateShipmentDialog } from './shipments/CreateShipmentDialog';
import { CreateHubDialog } from './hubs/CreateHubDialog';

const IntermodalDashboard = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch shipments data
        const { data: shipmentsData, error: shipmentsError } = await supabase
          .from('shipments')
          .select('*')
          .order('updated_at', { ascending: false });

        if (shipmentsError) throw shipmentsError;
        setShipments(shipmentsData || []);

        // Fetch hubs data
        const { data: hubsData, error: hubsError } = await supabase
          .from('hubs')
          .select('*');

        if (hubsError) throw hubsError;
        setHubs(hubsData || []);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(t('Failed to load dashboard data. Please refresh the page.'));
        toast.error(t('Failed to load dashboard data'));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchData();

    // Set up real-time subscription for shipments
    const shipmentSubscription = supabase
      .channel('shipment_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shipments'
      }, (payload: RealtimePostgresChangesPayload<Shipment>) => {
        setShipments(prev => {
          // Gestione DELETE: usa payload.old
          if (payload.eventType === 'DELETE') {
            const oldRow = payload.old as Partial<Shipment>;
            if (!oldRow || !('id' in oldRow)) return prev;
            return prev.filter(s => s.id !== oldRow.id);
          }

          // INSERT/UPDATE: usa payload.new con guard
          const newRow = payload.new as Partial<Shipment>;
          if (!newRow || !('id' in newRow)) return prev;

          const id = newRow.id as Shipment['id'];
          const exists = prev.some(s => s.id === id);
          if (exists) {
            return prev.map(s => (s.id === id ? { ...s, ...newRow } as Shipment : s));
          } else {
            return [...prev, newRow as Shipment];
          }
        });
        toast.info(t('Shipment data updated in real-time'));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(shipmentSubscription);
    };
  }, [t]);

  const handleRefresh = () => {
    setRefreshing(true);
    // The useEffect will trigger a refresh
  };

  const handleShipmentCreated = () => {
    // Refresh shipments data
    supabase
      .from('shipments')
      .select('*')
      .order('updated_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error refreshing shipments:', error);
          toast.error(t('Failed to refresh shipments'));
        } else {
          setShipments(data || []);
          toast.success(t('Shipment created and data refreshed'));
        }
      });
  };

  const handleHubCreated = () => {
    // Refresh hubs data
    supabase
      .from('hubs')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error refreshing hubs:', error);
          toast.error(t('Failed to refresh hubs'));
        } else {
          setHubs(data || []);
          toast.success(t('Hub created and data refreshed'));
        }
      });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'at_hub': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateCO2Savings = () => {
    return shipments.reduce((total, shipment) => total + (shipment.co2_savings_kg || 0), 0);
  };

  const inTransitCount = shipments.filter(s => s.delivery_status === 'in_transit').length;
  const atHubCount = shipments.filter(s => s.delivery_status === 'at_hub').length;
  const deliveredCount = shipments.filter(s => s.delivery_status === 'delivered').length;
  const delayedCount = shipments.filter(s => s.delivery_status === 'delayed').length;

  // Data for charts
  const statusData = [
    { name: t('In Transit'), value: inTransitCount },
    { name: t('At Hubs'), value: atHubCount },
    { name: t('Delivered'), value: deliveredCount },
    { name: t('Delayed'), value: delayedCount },
  ];

  const co2Data = [
    { name: t('Rail Transport'), value: calculateCO2Savings() * 0.7 },
    { name: t('Electric Last-Mile'), value: calculateCO2Savings() * 0.3 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Train className="h-8 w-8" />
          {t('intermodalDashboard')}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? t('Refreshing...') : t('Refresh Data')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalCO2Savings')}</CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateCO2Savings().toFixed(2)} kg</div>
            <p className="text-xs text-muted-foreground">{t('Compared to road transport')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('inTransit')}</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inTransitCount}</div>
            <p className="text-xs text-muted-foreground">{t('Active shipments')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('atHubs')}</CardTitle>
            <MapPin className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{atHubCount}</div>
            <p className="text-xs text-muted-foreground">{t('Ready for last-mile')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('delayed')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{delayedCount}</div>
            <p className="text-xs text-muted-foreground">{t('Needs attention')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('Shipment Status Distribution')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('CO₂ Savings Breakdown')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={co2Data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="shipments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="shipments">{t('shipmentTracking')}</TabsTrigger>
          <TabsTrigger value="hubs">{t('intermodalHubs')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('sustainabilityAnalytics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="shipments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('shipmentTracking')}</CardTitle>
              <CreateShipmentDialog onShipmentCreated={handleShipmentCreated} />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipments.length === 0 ? (
                  <p className="text-muted-foreground">{t('No shipments found')}</p>
                ) : (
                  <div className="space-y-3">
                    {shipments.slice(0, 10).map((shipment) => (
                      <div key={shipment.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.delivery_status)}`}>
                            {shipment.delivery_status}
                          </div>
                          <div>
                            <p className="font-medium">{shipment.shipment_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {shipment.origin} → {shipment.destination}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            {shipment.delivery_status === 'delivered'
                              ? `${t('Delivered')}: ${new Date(shipment.actual_delivery_time || '').toLocaleString()}`
                              : `${t('ETA')}: ${new Date(shipment.estimated_delivery_time).toLocaleString()}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(shipment.co2_savings_kg ?? 0).toFixed(1)} kg CO₂ {t('saved')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hubs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('intermodalHubs')}</CardTitle>
              <CreateHubDialog onHubCreated={handleHubCreated} />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hubs.map((hub) => (
                  <div key={hub.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <h3 className="font-semibold mb-2">{hub.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {hub.location}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('Capacity')}: {hub.capacity} TEU
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('Charging Stations')}: {hub.charging_stations}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {hub.low_emission_zone && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {t('lowEmissionZone')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>{t('sustainabilityAnalytics')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">{t('modalShiftImpact')}</h3>
                  <p className="text-muted-foreground">
                    {t('By shifting freight from road to rail and using electric last-mile delivery, GreenPath Analytics helps reduce urban congestion and carbon emissions.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{t('co2SavingsBreakdown')}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">{t('Rail vs Road')}</span>
                        <span className="text-sm font-medium">{(calculateCO2Savings() * 0.7).toFixed(2)} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">{t('Electric Last-Mile')}</span>
                        <span className="text-sm font-medium">{(calculateCO2Savings() * 0.3).toFixed(2)} kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{t('operationalEfficiency')}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">{t('onTimeDeliveryRate')}</span>
                        <span className="text-sm font-medium">
                          {shipments.length > 0
                            ? `${Math.round((deliveredCount / shipments.length) * 100)}%`
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">{t('hubUtilization')}</span>
                        <span className="text-sm font-medium">
                          {hubs.length > 0
                            ? `${Math.round((atHubCount / hubs.reduce((sum, hub) => sum + hub.capacity, 0)) * 100)}%`
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntermodalDashboard;