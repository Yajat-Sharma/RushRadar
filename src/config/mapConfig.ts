// Map configuration for different Indian cities
export interface CityConfig {
  name: string;
  center: [number, number]; // [longitude, latitude]
  zoom: number;
  bounds?: [[number, number], [number, number]]; // Optional bounds
}

export const INDIAN_CITIES: { [key: string]: CityConfig } = {
  mumbai: {
    name: 'Mumbai',
    center: [72.8777, 19.0760],
    zoom: 11,
    bounds: [[72.7761, 18.8900], [72.9781, 19.2544]]
  },
  delhi: {
    name: 'Delhi',
    center: [77.2090, 28.6139],
    zoom: 11,
    bounds: [[76.8388, 28.4089], [77.3462, 28.8839]]
  },
  bangalore: {
    name: 'Bangalore',
    center: [77.5946, 12.9716],
    zoom: 11,
    bounds: [[77.4601, 12.8339], [77.7840, 13.1394]]
  },
  pune: {
    name: 'Pune',
    center: [73.8567, 18.5204],
    zoom: 11
  },
  hyderabad: {
    name: 'Hyderabad',
    center: [78.4867, 17.3850],
    zoom: 11
  }
};

// Default city (Mumbai)
export const DEFAULT_CITY = 'mumbai';

// Map style configuration
export const MAP_STYLES = {
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
  streets: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12'
};

// Mapbox access token
export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

// Map configuration
export const MAP_CONFIG = {
  style: process.env.REACT_APP_MAPBOX_STYLE || MAP_STYLES.light,
  defaultCity: INDIAN_CITIES[DEFAULT_CITY],
  minZoom: 8,
  maxZoom: 18,
  pitch: 0,
  bearing: 0
};

// Transit station types and their styling
export interface StationStyle {
  color: string;
  size: number;
  icon: string;
}

export const STATION_STYLES: { [key: string]: StationStyle } = {
  railway: {
    color: '#2563EB',
    size: 12,
    icon: '🚊'
  },
  metro: {
    color: '#10B981',
    size: 10,
    icon: '🚇'
  },
  bus: {
    color: '#F59E0B',
    size: 8,
    icon: '🚌'
  },
  auto: {
    color: '#EF4444',
    size: 6,
    icon: '🛺'
  }
};

// Crowd level colors for heatmap
export const CROWD_COLORS = {
  low: '#10B981',      // Green
  medium: '#F59E0B',   // Orange  
  high: '#EF4444'      // Red
};

export const getCrowdColor = (crowdLevel: number): string => {
  if (crowdLevel <= 30) return CROWD_COLORS.low;
  if (crowdLevel <= 70) return CROWD_COLORS.medium;
  return CROWD_COLORS.high;
};