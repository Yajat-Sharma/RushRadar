// Real transit station data for Indian cities
export interface TransitStation {
  id: string;
  name: string;
  type: 'railway' | 'metro' | 'bus' | 'auto';
  coordinates: [number, number]; // [longitude, latitude]
  crowdLevel: number; // 0-100
  city: string;
  line?: string;
  platform?: string;
  specialFeatures?: string[];
  nextArrivals?: {
    mode: string;
    time: string;
    destination: string;
  }[];
}

// Mumbai Local Train Stations (Western Line sample)
export const MUMBAI_STATIONS: TransitStation[] = [
  {
    id: 'mumbai_churchgate',
    name: 'Churchgate',
    type: 'railway',
    coordinates: [72.8265, 18.9322],
    crowdLevel: 85,
    city: 'mumbai',
    line: 'Western Line',
    platform: 'Platform 1-6',
    specialFeatures: ['Ladies Coach', 'First Class'],
    nextArrivals: [
      { mode: 'Fast Local', time: '2 min', destination: 'Virar' },
      { mode: 'Slow Local', time: '5 min', destination: 'Borivali' }
    ]
  },
  {
    id: 'mumbai_marine_lines',
    name: 'Marine Lines',
    type: 'railway',
    coordinates: [72.8235, 18.9467],
    crowdLevel: 72,
    city: 'mumbai',
    line: 'Western Line',
    platform: 'Platform 1-2',
    specialFeatures: ['Ladies Coach', 'First Class']
  },
  {
    id: 'mumbai_charni_road',
    name: 'Charni Road',
    type: 'railway',
    coordinates: [72.8198, 18.9515],
    crowdLevel: 68,
    city: 'mumbai',
    line: 'Western Line',
    specialFeatures: ['Ladies Coach']
  },
  {
    id: 'mumbai_grant_road',
    name: 'Grant Road',
    type: 'railway',
    coordinates: [72.8156, 18.9658],
    crowdLevel: 75,
    city: 'mumbai',
    line: 'Western Line',
    specialFeatures: ['Ladies Coach', 'First Class']
  },
  {
    id: 'mumbai_mumbai_central',
    name: 'Mumbai Central',
    type: 'railway',
    coordinates: [72.8197, 18.9690],
    crowdLevel: 90,
    city: 'mumbai',
    line: 'Western Line',
    platform: 'Platform 1-8',
    specialFeatures: ['Ladies Coach', 'First Class', 'Long Distance Trains']
  },
  {
    id: 'mumbai_mahalaxmi',
    name: 'Mahalaxmi',
    type: 'railway',
    coordinates: [72.8235, 18.9827],
    crowdLevel: 45,
    city: 'mumbai',
    line: 'Western Line',
    specialFeatures: ['Ladies Coach']
  },
  {
    id: 'mumbai_lower_parel',
    name: 'Lower Parel',
    type: 'railway',
    coordinates: [72.8310, 19.0135],
    crowdLevel: 88,
    city: 'mumbai',
    line: 'Western Line',
    specialFeatures: ['Ladies Coach', 'First Class', 'Business District']
  },
  {
    id: 'mumbai_prabhadevi',
    name: 'Prabhadevi',
    type: 'railway',
    coordinates: [72.8300, 19.0170],
    crowdLevel: 65,
    city: 'mumbai',
    line: 'Western Line',
    specialFeatures: ['Ladies Coach']
  },
  {
    id: 'mumbai_dadar',
    name: 'Dadar',
    type: 'railway',
    coordinates: [72.8434, 19.0178],
    crowdLevel: 95,
    city: 'mumbai',
    line: 'Western & Central Line Junction',
    platform: 'Platform 1-12',
    specialFeatures: ['Ladies Coach', 'First Class', 'Major Junction', 'Shopping']
  },
  {
    id: 'mumbai_bandra',
    name: 'Bandra',
    type: 'railway',
    coordinates: [72.8406, 19.0544],
    crowdLevel: 82,
    city: 'mumbai',
    line: 'Western Line',
    platform: 'Platform 1-6',
    specialFeatures: ['Ladies Coach', 'First Class', 'Airport Link']
  },
  {
    id: 'mumbai_khar_road',
    name: 'Khar Road',
    type: 'railway',
    coordinates: [72.8378, 19.0672],
    crowdLevel: 58,
    city: 'mumbai',
    line: 'Western Line',
    specialFeatures: ['Ladies Coach']
  },
  {
    id: 'mumbai_santacruz',
    name: 'Santacruz',
    type: 'railway',
    coordinates: [72.8411, 19.0825],
    crowdLevel: 70,
    city: 'mumbai',
    line: 'Western Line',
    specialFeatures: ['Ladies Coach', 'First Class']
  },
  {
    id: 'mumbai_vile_parle',
    name: 'Vile Parle',
    type: 'railway',
    coordinates: [72.8434, 19.0988],
    crowdLevel: 76,
    city: 'mumbai',
    line: 'Western Line',
    specialFeatures: ['Ladies Coach', 'Airport Nearby']
  },
  {
    id: 'mumbai_andheri',
    name: 'Andheri',
    type: 'railway',
    coordinates: [72.8467, 19.1197],
    crowdLevel: 92,
    city: 'mumbai',
    line: 'Western Line',
    platform: 'Platform 1-8',
    specialFeatures: ['Ladies Coach', 'First Class', 'Metro Connection', 'Major Hub'],
    nextArrivals: [
      { mode: 'Fast Local', time: '1 min', destination: 'Churchgate' },
      { mode: 'Slow Local', time: '3 min', destination: 'Churchgate' },
      { mode: 'Fast Local', time: '4 min', destination: 'Virar' }
    ]
  }
];

// Mumbai Metro Stations (sample)
export const MUMBAI_METRO_STATIONS: TransitStation[] = [
  {
    id: 'mumbai_metro_ghatkopar',
    name: 'Ghatkopar Metro',
    type: 'metro',
    coordinates: [72.9088, 19.0863],
    crowdLevel: 65,
    city: 'mumbai',
    line: 'Blue Line',
    specialFeatures: ['AC Coach', 'Ladies Coach']
  },
  {
    id: 'mumbai_metro_andheri_east',
    name: 'Andheri East Metro',
    type: 'metro',
    coordinates: [72.8697, 19.1136],
    crowdLevel: 78,
    city: 'mumbai',
    line: 'Blue Line',
    specialFeatures: ['AC Coach', 'Ladies Coach', 'Airport Link']
  }
];

// Delhi Metro Stations (sample)
export const DELHI_STATIONS: TransitStation[] = [
  {
    id: 'delhi_rajiv_chowk',
    name: 'Rajiv Chowk',
    type: 'metro',
    coordinates: [77.2194, 28.6328],
    crowdLevel: 88,
    city: 'delhi',
    line: 'Blue & Yellow Line',
    platform: 'Platform A & B',
    specialFeatures: ['AC Coach', 'Ladies Coach', 'Major Junction']
  },
  {
    id: 'delhi_cp',
    name: 'Connaught Place',
    type: 'metro',
    coordinates: [77.2167, 28.6289],
    crowdLevel: 82,
    city: 'delhi',
    line: 'Yellow Line',
    specialFeatures: ['AC Coach', 'Ladies Coach']
  },
  {
    id: 'delhi_kashmere_gate',
    name: 'Kashmere Gate',
    type: 'metro',
    coordinates: [77.2306, 28.6667],
    crowdLevel: 75,
    city: 'delhi',
    line: 'Red & Yellow Line',
    specialFeatures: ['AC Coach', 'Ladies Coach', 'ISBT Connection']
  }
];

// Bangalore Metro Stations (sample)
export const BANGALORE_STATIONS: TransitStation[] = [
  {
    id: 'bangalore_mg_road',
    name: 'MG Road Metro',
    type: 'metro',
    coordinates: [77.6040, 12.9759],
    crowdLevel: 70,
    city: 'bangalore',
    line: 'Blue Line',
    specialFeatures: ['AC Coach', 'Ladies Coach']
  },
  {
    id: 'bangalore_whitefield',
    name: 'Whitefield',
    type: 'metro',
    coordinates: [77.7499, 12.9698],
    crowdLevel: 85,
    city: 'bangalore',
    line: 'Blue Line',
    specialFeatures: ['AC Coach', 'Ladies Coach', 'IT Hub']
  }
];

// Combine all stations
export const ALL_STATIONS: TransitStation[] = [
  ...MUMBAI_STATIONS,
  ...MUMBAI_METRO_STATIONS,
  ...DELHI_STATIONS,
  ...BANGALORE_STATIONS
];

// Get stations by city
export const getStationsByCity = (city: string): TransitStation[] => {
  return ALL_STATIONS.filter(station => station.city === city);
};

// Get station by ID
export const getStationById = (id: string): TransitStation | undefined => {
  return ALL_STATIONS.find(station => station.id === id);
};