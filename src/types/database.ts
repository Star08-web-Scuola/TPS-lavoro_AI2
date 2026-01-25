export interface Shipment {
  id: string;
  shipment_number: string;
  origin: string;
  destination: string;
  rail_carrier: string;
  rail_departure_time: string;
  rail_arrival_time: string;
  last_mile_carrier: string;
  delivery_status: 'pending' | 'in_transit' | 'at_hub' | 'out_for_delivery' | 'delivered' | 'delayed';
  estimated_delivery_time: string;
  actual_delivery_time: string | null;
  weight_kg: number;
  volume_m3: number;
  co2_savings_kg: number;
  created_at: string;
  updated_at: string;
}

export interface Hub {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  capacity: number;
  charging_stations: number;
  operating_hours: string;
  low_emission_zone: boolean;
  created_at: string;
  updated_at: string;
}

export interface SustainabilityMetric {
  id: string;
  shipment_id: string;
  metric_type: 'co2_savings' | 'energy_consumption' | 'congestion_reduction' | 'modal_shift';
  value: number;
  unit: string;
  calculation_method: string;
  timestamp: string;
  created_at: string;
}

export interface RouteOptimization {
  id: string;
  shipment_id: string;
  origin_hub_id: string;
  destination_hub_id: string;
  optimized_route: string; // GeoJSON or encoded polyline
  distance_km: number;
  estimated_time_minutes: number;
  energy_consumption_kwh: number;
  charging_stops: number;
  low_emission_zone_compliance: boolean;
  traffic_conditions: string;
  created_at: string;
}

export interface IoTSensorData {
  id: string;
  device_id: string;
  device_type: 'rail_sensor' | 'vehicle_gps' | 'charging_station' | 'environmental';
  location: string;
  latitude: number;
  longitude: number;
  reading_type: string;
  reading_value: number;
  reading_unit: string;
  timestamp: string;
  created_at: string;
}