'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface TrafficReport {
  id: string;
  latitude: number;
  longitude: number;
  traffic_level: 'low' | 'medium' | 'heavy';
  description?: string;
  timestamp: string;
}

interface TrafficMapProps {
  reports: TrafficReport[];
  isLoading: boolean;
}

export function TrafficMap({ reports, isLoading }: TrafficMapProps) {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (mapLoaded) return;

    // Dynamically import leaflet
    import('leaflet').then((L) => {
      if (mapRef.current) return;

      const map = L.map('map-container', {
        center: [40.7128, -74.0060], // New York City
        zoom: 12,
        dragging: true,
        tap: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;
      setMapLoaded(true);
    });
  }, [mapLoaded]);

  // Update markers when reports change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    import('leaflet').then((L) => {
      // Clear old markers
      markersRef.current.forEach((marker) => {
        mapRef.current?.removeLayer(marker);
      });
      markersRef.current = [];

      // Add new markers
      reports.forEach((report) => {
        const color =
          report.traffic_level === 'low'
            ? '#10b981' // green
            : report.traffic_level === 'medium'
              ? '#f59e0b' // yellow
              : '#ef4444'; // red

        const marker = L.circleMarker(
          [report.latitude, report.longitude],
          {
            radius: 12,
            fillColor: color,
            color: color,
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.7,
          }
        );

        const levelLabel = report.traffic_level.charAt(0).toUpperCase() + report.traffic_level.slice(1);
        const time = new Date(report.timestamp).toLocaleTimeString();
        const desc = report.description ? `<br/>${report.description}` : '';

        marker.bindPopup(
          `<div class="text-sm font-semibold">${levelLabel} Traffic</div><div class="text-xs text-gray-600">${time}</div>${desc}`
        );

        marker.addTo(mapRef.current!);
        markersRef.current.push(marker);
      });

      // Fit bounds if there are reports
      if (reports.length > 0) {
        const group = L.featureGroup(markersRef.current);
        mapRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    });
  }, [reports, mapLoaded]);

  return (
    <div id="map-container" className="w-full h-full min-h-96 bg-gray-100 dark:bg-gray-800 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-lg">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}
