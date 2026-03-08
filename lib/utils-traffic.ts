/**
 * Traffic utility functions for the Smart Traffic Congestion Detection System
 */

export interface TrafficReport {
  id: string;
  latitude: number;
  longitude: number;
  traffic_level: 'low' | 'medium' | 'heavy';
  description?: string;
  timestamp: string;
}

/**
 * Calculate distance between two geographic points using Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get traffic color based on level
 * @param level Traffic congestion level
 * @returns Hex color code
 */
export function getTrafficColor(level: 'low' | 'medium' | 'heavy'): string {
  const colors = {
    low: '#10b981', // green
    medium: '#f59e0b', // yellow
    heavy: '#ef4444', // red
  };
  return colors[level];
}

/**
 * Get human-readable traffic level label
 * @param level Traffic congestion level
 * @returns Formatted label
 */
export function getTrafficLabel(level: 'low' | 'medium' | 'heavy'): string {
  const labels = {
    low: 'Low Traffic',
    medium: 'Medium Traffic',
    heavy: 'Heavy Congestion',
  };
  return labels[level];
}

/**
 * Format timestamp to human-readable time
 * @param timestamp ISO timestamp string
 * @returns Formatted time string
 */
export function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString();
}

/**
 * Format timestamp to time only
 * @param timestamp ISO timestamp string
 * @returns Time string (HH:MM AM/PM)
 */
export function formatTimeOnly(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Validate latitude value
 * @param lat Latitude value
 * @returns True if valid
 */
export function isValidLatitude(lat: number): boolean {
  return lat >= -90 && lat <= 90;
}

/**
 * Validate longitude value
 * @param lon Longitude value
 * @returns True if valid
 */
export function isValidLongitude(lon: number): boolean {
  return lon >= -180 && lon <= 180;
}

/**
 * Calculate congestion percentage from reports
 * @param reports Array of traffic reports
 * @returns Congestion percentage (0-100)
 */
export function calculateCongestionPercentage(reports: TrafficReport[]): number {
  if (reports.length === 0) return 0;

  const congested = reports.filter(
    (r) => r.traffic_level === 'heavy' || r.traffic_level === 'medium'
  ).length;

  return Math.round((congested / reports.length) * 100);
}

/**
 * Get traffic statistics
 * @param reports Array of traffic reports
 * @returns Statistics object
 */
export function getTrafficStats(reports: TrafficReport[]) {
  return {
    total: reports.length,
    low: reports.filter((r) => r.traffic_level === 'low').length,
    medium: reports.filter((r) => r.traffic_level === 'medium').length,
    heavy: reports.filter((r) => r.traffic_level === 'heavy').length,
    congestionRate: calculateCongestionPercentage(reports),
  };
}

/**
 * Sort reports by traffic level (heavy first)
 * @param reports Array of traffic reports
 * @returns Sorted reports
 */
export function sortByTrafficLevel(reports: TrafficReport[]): TrafficReport[] {
  const levelPriority = { heavy: 0, medium: 1, low: 2 };
  return [...reports].sort(
    (a, b) => levelPriority[a.traffic_level] - levelPriority[b.traffic_level]
  );
}

/**
 * Sort reports by recency (newest first)
 * @param reports Array of traffic reports
 * @returns Sorted reports
 */
export function sortByRecency(reports: TrafficReport[]): TrafficReport[] {
  return [...reports].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Filter reports within a radius from a center point
 * @param reports Array of traffic reports
 * @param centerLat Center latitude
 * @param centerLon Center longitude
 * @param radiusKm Radius in kilometers
 * @returns Filtered reports
 */
export function filterByRadius(
  reports: TrafficReport[],
  centerLat: number,
  centerLon: number,
  radiusKm: number
): TrafficReport[] {
  return reports.filter((report) => {
    const distance = calculateDistance(
      centerLat,
      centerLon,
      report.latitude,
      report.longitude
    );
    return distance <= radiusKm;
  });
}

/**
 * Get traffic reports for a specific hour
 * @param reports Array of traffic reports
 * @param hour Hour (0-23)
 * @returns Filtered reports
 */
export function filterByHour(reports: TrafficReport[], hour: number): TrafficReport[] {
  return reports.filter((report) => {
    const reportHour = new Date(report.timestamp).getHours();
    return reportHour === hour;
  });
}

/**
 * Get the most congested hour of the day
 * @param reports Array of traffic reports
 * @returns Hour with most reports (0-23) or null if no data
 */
export function getMostCongestedHour(reports: TrafficReport[]): number | null {
  if (reports.length === 0) return null;

  const hourCounts: Record<number, number> = {};

  reports.forEach((report) => {
    const hour = new Date(report.timestamp).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  let maxHour = 0;
  let maxCount = 0;

  Object.entries(hourCounts).forEach(([hour, count]) => {
    if (count > maxCount) {
      maxCount = count;
      maxHour = parseInt(hour);
    }
  });

  return maxHour;
}

/**
 * Check if a location is within NYC bounds
 * @param lat Latitude
 * @param lon Longitude
 * @returns True if within NYC
 */
export function isWithinNYC(lat: number, lon: number): boolean {
  // NYC approximate bounds
  return (
    lat >= 40.5 && lat <= 40.92 &&
    lon >= -74.3 && lon <= -73.7
  );
}

/**
 * Format coordinates for display
 * @param lat Latitude
 * @param lon Longitude
 * @param decimals Number of decimal places
 * @returns Formatted string
 */
export function formatCoordinates(
  lat: number,
  lon: number,
  decimals = 4
): string {
  return `${lat.toFixed(decimals)}, ${lon.toFixed(decimals)}`;
}

/**
 * Get emoji for traffic level
 * @param level Traffic level
 * @returns Emoji character
 */
export function getTrafficEmoji(level: 'low' | 'medium' | 'heavy'): string {
  const emojis = {
    low: '🟢',
    medium: '🟡',
    heavy: '🔴',
  };
  return emojis[level];
}
