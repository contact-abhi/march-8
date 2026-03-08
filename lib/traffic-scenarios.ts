// Sample traffic scenarios for testing and demo purposes
export const TRAFFIC_SCENARIOS = [
  // Times Square Area
  {
    name: "Times Square Rush Hour",
    latitude: 40.758,
    longitude: -73.9855,
    traffic_level: "heavy" as const,
    description: "Major congestion during evening rush hour",
  },
  // Broadway
  {
    name: "Broadway Accident",
    latitude: 40.7128,
    longitude: -74.006,
    traffic_level: "heavy" as const,
    description: "Multi-vehicle accident blocking lanes",
  },
  // 42nd Street
  {
    name: "42nd Street Construction",
    latitude: 40.7489,
    longitude: -73.968,
    traffic_level: "medium" as const,
    description: "Road work and lane closures",
  },
  // Park Avenue
  {
    name: "Park Avenue Light Traffic",
    latitude: 40.7614,
    longitude: -73.9776,
    traffic_level: "low" as const,
    description: "Smooth traffic flow",
  },
  // Central Park Area
  {
    name: "Central Park South",
    latitude: 40.7824,
    longitude: -73.9745,
    traffic_level: "medium" as const,
    description: "Moderate congestion",
  },
];

// NYC coordinates for map centering
export const NYC_CENTER = {
  latitude: 40.7128,
  longitude: -74.0060,
};

// Default zoom level for NYC
export const DEFAULT_ZOOM = 12;

// Traffic level colors
export const TRAFFIC_COLORS = {
  low: "#10b981", // Green
  medium: "#f59e0b", // Yellow
  heavy: "#ef4444", // Red
};

// Traffic level labels
export const TRAFFIC_LABELS = {
  low: "Low Traffic",
  medium: "Medium Traffic",
  heavy: "Heavy Congestion",
};

// Peak hours for NYC
export const NYC_PEAK_HOURS = {
  morning: [7, 8, 9],
  evening: [17, 18, 19, 20],
};

// Alternative route suggestions
export const ALTERNATIVE_ROUTES = [
  "Use FDR Drive instead of Broadway",
  "Take the Henry Hudson Parkway for uptown routes",
  "Consider using the Manhattan Bridge for cross-town travel",
  "Use public transit (MTA) for faster commute",
  "Try East Side or West Side highways",
  "Use local streets to avoid major congestion",
  "Consider ride-sharing with real-time routing",
  "Adjust travel time: leave earlier or later",
];
