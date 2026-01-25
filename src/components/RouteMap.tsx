"use client";

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Hub, RouteOptimization } from '@/types/database';
import { MapPin, Route, BatteryCharging } from 'lucide-react';

// Fix for default marker icons in Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface RouteMapProps {
  hubs: Hub[];
  route?: RouteOptimization | null;
  height?: string;
}

const RouteMap: React.FC<RouteMapProps> = ({ hubs, route, height = '500px' }) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.9028, 12.4964]); // Default to Rome
  const [zoom, setZoom] = useState(12);

  // Calculate bounds for all hubs
  useEffect(() => {
    if (hubs.length > 0) {
      const bounds = L.latLngBounds(
        hubs.map(hub => [hub.latitude, hub.longitude])
      );

      if (route) {
        const originHub = hubs.find(h => h.id === route.origin_hub_id);
        const destinationHub = hubs.find(h => h.id === route.destination_hub_id);

        if (originHub && destinationHub) {
          bounds.extend([originHub.latitude, originHub.longitude]);
          bounds.extend([destinationHub.latitude, destinationHub.longitude]);
        }
      }

      // Set center and zoom based on bounds
      const center = bounds.getCenter();
      setMapCenter([center.lat, center.lng]);
      setZoom(Math.min(15, Math.max(10, 18 - Math.log2(bounds.getNorthEast().distanceTo(bounds.getSouthWest()) / 1000))));
    }
  }, [hubs, route]);

  // Parse route coordinates
  const getRouteCoordinates = () => {
    if (!route?.optimized_route) return [];

    try {
      const routeData = JSON.parse(route.optimized_route);
      if (routeData.geometry?.coordinates) {
        return routeData.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
      }
    } catch (error) {
      console.error('Error parsing route data:', error);
    }
    return [];
  };

  const routeCoordinates = getRouteCoordinates();

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height, width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Display all hubs */}
        {hubs.map((hub) => (
          <Marker
            key={hub.id}
            position={[hub.latitude, hub.longitude]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="space-y-2">
                <h3 className="font-bold">{hub.name}</h3>
                <p className="text-sm">{hub.location}</p>
                <p className="text-sm">Capacity: {hub.capacity} TEU</p>
                <p className="text-sm">Charging Stations: {hub.charging_stations}</p>
                {hub.low_emission_zone && (
                  <p className="text-sm text-green-600">✓ Low Emission Zone</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Display optimized route if available */}
        {routeCoordinates.length > 0 && (
          <>
            <Polyline
              positions={routeCoordinates}
              color="#3b82f6" // blue-500
              weight={4}
              opacity={0.8}
            />
            {routeCoordinates.length > 0 && (
              <>
                <Marker
                  position={routeCoordinates[0]}
                  icon={L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div style="background-color: #3b82f6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold;">A</div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })}
                >
                  <Popup>
                    <div className="text-center">
                      <p className="font-bold">Origin</p>
                      <p className="text-sm">Start of optimized route</p>
                    </div>
                  </Popup>
                </Marker>

                <Marker
                  position={routeCoordinates[routeCoordinates.length - 1]}
                  icon={L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div style="background-color: #10b981; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold;">B</div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })}
                >
                  <Popup>
                    <div className="text-center">
                      <p className="font-bold">Destination</p>
                      <p className="text-sm">End of optimized route</p>
                    </div>
                  </Popup>
                </Marker>
              </>
            )}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default RouteMap;