"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Shipment, Hub, RouteOptimization } from '@/types/database';
import { MapPin, Route, BatteryCharging, Leaf, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const AIRouteOptimizer = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<string>('');
  const [originHub, setOriginHub] = useState<string>('');
  const [destinationHub, setDestinationHub] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<'electric_van' | 'cargo_bike'>('electric_van');
  const [loading, setLoading] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState<RouteOptimization | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch shipments that need route optimization
        const { data: shipmentsData, error: shipmentsError } = await supabase
          .from('shipments')
          .select('*')
          .in('delivery_status', ['at_hub', 'pending'])
          .order('updated_at', { ascending: false });

        if (shipmentsError) throw shipmentsError;
        setShipments(shipmentsData || []);

        // Fetch hubs
        const { data: hubsData, error: hubsError } = await supabase
          .from('hubs')
          .select('*');

        if (hubsError) throw hubsError;
        setHubs(hubsData || []);

      } catch (err) {
        console.error('Error fetching route optimizer data:', err);
        setError('Failed to load data. Please refresh the page.');
        toast.error('Failed to load route optimizer data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOptimizeRoute = async () => {
    if (!selectedShipment || !originHub || !destinationHub) {
      setError('Please select shipment, origin hub, and destination hub');
      toast.error('Please select shipment, origin hub, and destination hub');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Simulate AI route optimization (in a real app, this would call an AI service)
      const shipment = shipments.find(s => s.id === selectedShipment);
      const origin = hubs.find(h => h.id === originHub);
      const destination = hubs.find(h => h.id === destinationHub);

      if (!shipment || !origin || !destination) {
        throw new Error('Invalid selection');
      }

      // Calculate distance (simplified - in real app use proper distance calculation)
      const distance = calculateDistance(
        origin.latitude, origin.longitude,
        destination.latitude, destination.longitude
      );

      // Simulate AI optimization logic
      const optimizedData: RouteOptimization = {
        id: crypto.randomUUID(),
        shipment_id: shipment.id,
        origin_hub_id: origin.id,
        destination_hub_id: destination.id,
        optimized_route: JSON.stringify({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [origin.longitude, origin.latitude],
              [destination.longitude, destination.latitude]
            ]
          }
        }),
        distance_km: distance,
        estimated_time_minutes: Math.round(distance * 2 + (vehicleType === 'cargo_bike' ? distance * 3 : distance * 1.5)),
        energy_consumption_kwh: vehicleType === 'electric_van'
          ? distance * 0.2
          : distance * 0.05,
        charging_stops: vehicleType === 'electric_van' && distance > 50 ? 1 : 0,
        low_emission_zone_compliance: destination.low_emission_zone,
        traffic_conditions: 'moderate',
        created_at: new Date().toISOString()
      };

      // Save to database
      const { data, error: saveError } = await supabase
        .from('route_optimizations')
        .insert([optimizedData])
        .select()
        .single();

      if (saveError) throw saveError;

      setOptimizedRoute(data);
      toast.success('Route optimized successfully!');

    } catch (err) {
      console.error('Error optimizing route:', err);
      setError('Failed to optimize route. Please try again.');
      toast.error('Failed to optimize route');
    } finally {
      setLoading(false);
    }
  };

  // Simplified distance calculation (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getVehicleIcon = () => {
    return vehicleType === 'electric_van' ? '🚐⚡' : '🚲📦';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Route className="h-8 w-8" />
        AI Route Optimizer
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Route Optimization</CardTitle>
              <CardDescription>
                Calculate the most energy-efficient routes for electric delivery vehicles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shipment">Shipment</Label>
                    <Select
                      value={selectedShipment}
                      onValueChange={setSelectedShipment}
                      disabled={loading}
                    >
                      <SelectTrigger id="shipment">
                        <SelectValue placeholder="Select shipment" />
                      </SelectTrigger>
                      <SelectContent>
                        {shipments.map((shipment) => (
                          <SelectItem key={shipment.id} value={shipment.id}>
                            {shipment.shipment_number} - {shipment.origin} → {shipment.destination}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="origin-hub">Origin Hub</Label>
                    <Select
                      value={originHub}
                      onValueChange={setOriginHub}
                      disabled={loading}
                    >
                      <SelectTrigger id="origin-hub">
                        <SelectValue placeholder="Select origin hub" />
                      </SelectTrigger>
                      <SelectContent>
                        {hubs.map((hub) => (
                          <SelectItem key={hub.id} value={hub.id}>
                            {hub.name} ({hub.location})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination-hub">Destination Hub</Label>
                    <Select
                      value={destinationHub}
                      onValueChange={setDestinationHub}
                      disabled={loading}
                    >
                      <SelectTrigger id="destination-hub">
                        <SelectValue placeholder="Select destination hub" />
                      </SelectTrigger>
                      <SelectContent>
                        {hubs.map((hub) => (
                          <SelectItem key={hub.id} value={hub.id}>
                            {hub.name} ({hub.location})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicle-type">Vehicle Type</Label>
                    <Select
                      value={vehicleType}
                      onValueChange={(value) => setVehicleType(value as 'electric_van' | 'cargo_bike')}
                      disabled={loading}
                    >
                      <SelectTrigger id="vehicle-type">
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electric_van">Electric Van</SelectItem>
                        <SelectItem value="cargo_bike">Cargo Bike</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleOptimizeRoute}
                  disabled={loading || !selectedShipment || !originHub || !destinationHub}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">🔄</span>
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Route className="mr-2 h-4 w-4" />
                      Optimize Route
                    </>
                  )}
                </Button>

                {error && (
                  <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-md flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    {error}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h4 className="font-medium">Traffic Conditions</h4>
                    <p className="text-sm text-muted-foreground">
                      Real-time traffic data integration to avoid congestion
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BatteryCharging className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h4 className="font-medium">Charging Infrastructure</h4>
                    <p className="text-sm text-muted-foreground">
                      Optimal charging stop planning based on vehicle range
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Leaf className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h4 className="font-medium">Low Emission Zones</h4>
                    <p className="text-sm text-muted-foreground">
                      Compliance with ZTL regulations and restrictions
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h4 className="font-medium">Delivery Windows</h4>
                    <p className="text-sm text-muted-foreground">
                      Time-sensitive delivery scheduling
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {optimizedRoute && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Optimized Route Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Route className="h-4 w-4" />
                      Route Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Distance</span>
                        <span className="font-medium">{optimizedRoute.distance_km.toFixed(2)} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Estimated Time</span>
                        <span className="font-medium">{optimizedRoute.estimated_time_minutes} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Vehicle</span>
                        <span className="font-medium">{getVehicleIcon()} {vehicleType === 'electric_van' ? 'Electric Van' : 'Cargo Bike'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <BatteryCharging className="h-4 w-4" />
                      Energy Efficiency
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Energy Consumption</span>
                        <span className="font-medium">{optimizedRoute.energy_consumption_kwh.toFixed(2)} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Charging Stops</span>
                        <span className="font-medium">{optimizedRoute.charging_stops}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">ZTL Compliance</span>
                        <span className="font-medium">
                          {optimizedRoute.low_emission_zone_compliance ? '✅ Compliant' : '❌ Not Compliant'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    Sustainability Impact
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    This optimized route contributes to your sustainability goals by:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>Reducing carbon emissions through modal shift from road to rail</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>Using zero-emission electric vehicles for last-mile delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>Minimizing urban congestion through efficient routing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>Ensuring compliance with low-emission zone regulations</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">
                    <MapPin className="mr-2 h-4 w-4" />
                    View on Map
                  </Button>
                  <Button>
                    <Route className="mr-2 h-4 w-4" />
                    Assign to Driver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIRouteOptimizer;