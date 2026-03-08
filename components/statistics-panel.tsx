'use client';

import { AlertTriangle, TrendingUp, MapPin, Clock } from 'lucide-react';

interface TrafficReport {
  id: string;
  latitude: number;
  longitude: number;
  traffic_level: 'low' | 'medium' | 'heavy';
  description?: string;
  timestamp: string;
}

interface StatisticsPanelProps {
  reports: TrafficReport[];
  isLoading: boolean;
}

export function StatisticsPanel({ reports, isLoading }: StatisticsPanelProps) {
  // Calculate statistics
  const totalReports = reports.length;
  const heavyReports = reports.filter((r) => r.traffic_level === 'heavy').length;
  const mediumReports = reports.filter((r) => r.traffic_level === 'medium').length;
  const lowReports = reports.filter((r) => r.traffic_level === 'low').length;

  const congestionRate =
    totalReports > 0 ? Math.round(((heavyReports + mediumReports) / totalReports) * 100) : 0;

  // Find hotspots (clusters of heavy traffic)
  const hotspots = findHotspots(reports);

  // Predict peak hours
  const prediction = predictPeakTime(reports);

  // Get suggested alternative routes
  const alternativeRoutes = getAlternativeRoutes(reports);

  return (
    <div className="space-y-5 sticky top-24">
      {/* Overall Congestion */}
      <div className="bg-card rounded-xl border border-border shadow-lg p-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">OVERALL STATUS</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-bold text-foreground">{congestionRate}%</span>
              <span className="text-xs text-muted-foreground">Congestion Level</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  congestionRate > 70 ? 'bg-red-500' : congestionRate > 40 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${congestionRate}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="p-2 bg-green-100/50 dark:bg-green-950/30 rounded-lg">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{lowReports}</div>
              <div className="text-xs text-green-600 dark:text-green-400">Low</div>
            </div>
            <div className="p-2 bg-yellow-100/50 dark:bg-yellow-950/30 rounded-lg">
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{mediumReports}</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">Medium</div>
            </div>
            <div className="p-2 bg-red-100/50 dark:bg-red-950/30 rounded-lg">
              <div className="text-lg font-bold text-red-600 dark:text-red-400">{heavyReports}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Heavy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hotspots */}
      {hotspots.length > 0 && (
        <div className="bg-card rounded-xl border border-border shadow-lg p-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            CONGESTION HOTSPOTS
          </h3>
          <div className="space-y-3">
            {hotspots.map((hotspot, idx) => (
              <div key={idx} className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-red-900 dark:text-red-100 text-sm">
                      {hotspot.count} reports
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-300 truncate">
                      {hotspot.lat.toFixed(4)}, {hotspot.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Peak Hour Prediction */}
      {prediction && (
        <div className="bg-card rounded-xl border border-border shadow-lg p-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            PREDICTION
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Expected Peak Hour</p>
              <p className="font-bold text-blue-900 dark:text-blue-100 text-lg">{prediction.hour}:00</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Based on historical data patterns
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alternative Routes */}
      {heavyReports > 0 && alternativeRoutes.length > 0 && (
        <div className="bg-card rounded-xl border border-border shadow-lg p-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">ALTERNATIVE ROUTES</h3>
          <div className="space-y-2">
            {alternativeRoutes.map((route, idx) => (
              <div key={idx} className="text-xs p-2 bg-muted/50 rounded-lg">
                <p className="font-medium text-foreground">Route {idx + 1}</p>
                <p className="text-muted-foreground text-xs">{route}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Reports */}
      <div className="bg-primary/10 rounded-xl border border-primary/30 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary">LAST 24 HOURS</span>
        </div>
        <p className="text-3xl font-bold text-foreground">{totalReports}</p>
        <p className="text-xs text-muted-foreground mt-1">Total reports submitted</p>
      </div>
    </div>
  );
}

function findHotspots(reports: TrafficReport[]): Array<{ lat: number; lng: number; count: number }> {
  const heavyReports = reports.filter((r) => r.traffic_level === 'heavy');
  if (heavyReports.length === 0) return [];

  // Simple clustering: group reports within 0.01 degrees (~1km)
  const clusters: Array<{ lat: number; lng: number; count: number }> = [];
  const processed = new Set<string>();

  heavyReports.forEach((report) => {
    const key = `${report.latitude.toFixed(2)}-${report.longitude.toFixed(2)}`;
    if (processed.has(key)) return;

    const nearby = heavyReports.filter(
      (r) =>
        Math.abs(r.latitude - report.latitude) < 0.01 && Math.abs(r.longitude - report.longitude) < 0.01
    );

    if (nearby.length > 0) {
      const avgLat = nearby.reduce((sum, r) => sum + r.latitude, 0) / nearby.length;
      const avgLng = nearby.reduce((sum, r) => sum + r.longitude, 0) / nearby.length;
      clusters.push({ lat: avgLat, lng: avgLng, count: nearby.length });

      nearby.forEach((r) => {
        processed.add(`${r.latitude.toFixed(2)}-${r.longitude.toFixed(2)}`);
      });
    }
  });

  return clusters.slice(0, 3); // Show top 3 hotspots
}

function predictPeakTime(reports: TrafficReport[]): { hour: number; confidence: number } | null {
  if (reports.length < 5) return null;

  // Analyze traffic by hour
  const hourCounts: Record<number, number> = {};
  reports.forEach((report) => {
    const hour = new Date(report.timestamp).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  // Find peak hour
  let peakHour = 9; // Default to morning rush
  let maxCount = 0;
  Object.entries(hourCounts).forEach(([hour, count]) => {
    if (count > maxCount) {
      maxCount = count;
      peakHour = parseInt(hour);
    }
  });

  return { hour: peakHour, confidence: (maxCount / reports.length) * 100 };
}

function getAlternativeRoutes(reports: TrafficReport[]): string[] {
  const heavyCount = reports.filter((r) => r.traffic_level === 'heavy').length;

  if (heavyCount === 0) return [];

  const routes = [
    'Take local roads via Park Avenue instead of Broadway',
    'Use subway line 1 or 2 for faster transit',
    'Consider alternate timing: travel before 8:00 AM or after 10:00 AM',
    'Use ride-sharing apps with real-time routing',
    'Consider cross-town routes via 42nd Street',
  ];

  return routes.slice(0, Math.min(3, Math.ceil(heavyCount / 2)));
}
