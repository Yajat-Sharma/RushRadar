// India-specific transit data for realistic examples
export interface IndiaRoute {
  id: number;
  time: string;
  modes: string[];
  crowdLevel: number;
  fare: number;
  seatProbability: number;
  comfort: string;
  isLeastCrowded: boolean;
  details: string;
  specialFeatures?: string[];
  platform?: string;
  coachSuggestion?: string;
}

export interface IndiaStation {
  id: number;
  name: string;
  distance: string;
  nextArrival: string;
  crowdLevel: number;
  modes: string[];
  specialFeatures?: string[];
  platform?: string;
}

export const MUMBAI_ROUTES: IndiaRoute[] = [
  {
    id: 1,
    time: '42 min',
    modes: ['🚶‍♂️', '🚊', '🚶‍♂️'],
    crowdLevel: 78,
    fare: 25,
    seatProbability: 15,
    comfort: 'Crowded',
    isLeastCrowded: false,
    details: 'Walk 3min → Fast Local (Andheri-Churchgate) 36min → Walk 3min',
    specialFeatures: ['First Class Available', 'Ladies Coach'],
    platform: 'Platform 1',
    coachSuggestion: 'Coach 9-12 less crowded'
  },
  {
    id: 2,
    time: '48 min',
    modes: ['🚶‍♂️', '🚊', '🚶‍♂️'],
    crowdLevel: 45,
    fare: 15,
    seatProbability: 65,
    comfort: 'Comfortable',
    isLeastCrowded: true,
    details: 'Walk 5min → Slow Local (Andheri-Churchgate) 38min → Walk 5min',
    specialFeatures: ['General Coach', 'Ladies Coach'],
    platform: 'Platform 2',
    coachSuggestion: 'Ladies Coach recommended'
  },
  {
    id: 3,
    time: '35 min',
    modes: ['🚶‍♂️', '🚇', '🚊', '🚶‍♂️'],
    crowdLevel: 62,
    fare: 35,
    seatProbability: 40,
    comfort: 'Moderate',
    isLeastCrowded: false,
    details: 'Walk 2min → Metro Blue Line 15min → Transfer → Local 15min → Walk 3min',
    specialFeatures: ['AC Coach', 'Ladies Coach']
  }
];

export const DELHI_ROUTES: IndiaRoute[] = [
  {
    id: 1,
    time: '38 min',
    modes: ['🚶‍♂️', '🚇', '🚶‍♂️'],
    crowdLevel: 55,
    fare: 42,
    seatProbability: 70,
    comfort: 'Comfortable',
    isLeastCrowded: true,
    details: 'Walk 4min → Blue Line (Noida-Rajiv Chowk) 30min → Walk 4min',
    specialFeatures: ['AC Coach', 'Ladies Coach'],
    platform: 'Platform A'
  },
  {
    id: 2,
    time: '52 min',
    modes: ['🚶‍♂️', '🚌', '🚇', '🚶‍♂️'],
    crowdLevel: 72,
    fare: 28,
    seatProbability: 25,
    comfort: 'Crowded',
    isLeastCrowded: false,
    details: 'Walk 3min → DTC Bus 20min → Transfer → Metro 25min → Walk 4min',
    specialFeatures: ['Ladies Seat Reserved']
  }
];

export const BANGALORE_ROUTES: IndiaRoute[] = [
  {
    id: 1,
    time: '45 min',
    modes: ['🚶‍♂️', '🚇', '🚶‍♂️'],
    crowdLevel: 68,
    fare: 38,
    seatProbability: 45,
    comfort: 'Moderate',
    isLeastCrowded: false,
    details: 'Walk 5min → Purple Line (Whitefield-MG Road) 35min → Walk 5min',
    specialFeatures: ['AC Coach', 'Ladies Coach']
  },
  {
    id: 2,
    time: '62 min',
    modes: ['🚶‍♂️', '🚌', '🚶‍♂️'],
    crowdLevel: 35,
    fare: 22,
    seatProbability: 80,
    comfort: 'Comfortable',
    isLeastCrowded: true,
    details: 'Walk 3min → BMTC Volvo 56min → Walk 3min',
    specialFeatures: ['AC Bus', 'Ladies Seat']
  }
];

export const INDIA_STATIONS: IndiaStation[] = [
  {
    id: 1,
    name: 'Andheri Railway Station',
    distance: '0.2 km • 3 min walk',
    nextArrival: 'Fast Local in 2 min',
    crowdLevel: 78,
    modes: ['🚊', '🚌', '🛺'],
    specialFeatures: ['Ladies Coach', 'First Class'],
    platform: 'Platform 1 & 2'
  },
  {
    id: 2,
    name: 'Ghatkopar Metro Station',
    distance: '0.1 km • 1 min walk',
    nextArrival: 'Metro in 4 min',
    crowdLevel: 45,
    modes: ['🚇', '🚌'],
    specialFeatures: ['Ladies Coach', 'AC Coach'],
    platform: 'Platform A'
  },
  {
    id: 3,
    name: 'Bandra Kurla Complex',
    distance: '0.3 km • 4 min walk',
    nextArrival: 'BEST Bus in 6 min',
    crowdLevel: 62,
    modes: ['🚌', '🛺'],
    specialFeatures: ['AC Bus Available']
  },
  {
    id: 4,
    name: 'Connaught Place Metro',
    distance: '0.4 km • 5 min walk',
    nextArrival: 'Blue Line in 3 min',
    crowdLevel: 89,
    modes: ['🚇', '🚌', '🛺'],
    specialFeatures: ['Ladies Coach', 'AC Coach'],
    platform: 'Platform A & B'
  }
];

export const INDIA_NOTIFICATIONS = [
  {
    id: 1,
    type: 'alert',
    title: 'Heavy Rush on Western Line',
    description: 'Andheri-Churchgate Fast Local at 95% capacity. Ladies Coach less crowded.',
    timestamp: '2m ago',
    actions: ['Check Ladies Coach', 'Find Alternative']
  },
  {
    id: 2,
    type: 'route',
    title: 'Harbour Line Less Crowded',
    description: 'Alternative route via Harbour Line is 35% less crowded with only 8 min extra.',
    timestamp: '12m ago',
    actions: ['View Route', 'Set Alert']
  },
  {
    id: 3,
    type: 'info',
    title: 'Monsoon Alert',
    description: 'Heavy rains expected 4-7 PM. Local trains may run 10-15 min late.',
    timestamp: '35m ago',
    actions: ['Plan Ahead', 'Track Updates']
  },
  {
    id: 4,
    type: 'system',
    title: 'Platform Change - Dadar',
    description: 'Churchgate Fast Local now departing from Platform 3 instead of Platform 1.',
    timestamp: '1h ago',
    actions: ['Got it']
  }
];

export const SAVED_ROUTES_INDIA = [
  {
    id: 1,
    name: 'Morning Office Commute',
    from: 'Andheri (W)',
    to: 'Churchgate',
    avgTime: '42 min',
    avgCrowd: 78,
    lastUsed: '2 days ago',
    currentCrowd: 65,
    specialFeatures: ['First Class', 'Ladies Coach']
  },
  {
    id: 2,
    name: 'Evening Return Journey',
    from: 'Churchgate',
    to: 'Andheri (W)',
    avgTime: '48 min',
    avgCrowd: 85,
    lastUsed: 'Yesterday',
    currentCrowd: 92,
    specialFeatures: ['Ladies Coach Available']
  },
  {
    id: 3,
    name: 'Weekend Shopping Trip',
    from: 'Andheri (W)',
    to: 'Linking Road',
    avgTime: '25 min',
    avgCrowd: 35,
    lastUsed: '1 week ago',
    currentCrowd: 28,
    specialFeatures: ['BEST Bus', 'AC Available']
  },
  {
    id: 4,
    name: 'Airport Connection',
    from: 'Andheri (W)',
    to: 'Mumbai Airport T1',
    avgTime: '18 min',
    avgCrowd: 45,
    lastUsed: '2 weeks ago',
    currentCrowd: 38,
    specialFeatures: ['Metro Link', 'Luggage Space']
  }
];

// Peak hours specific to Indian cities
export const INDIA_PEAK_HOURS = {
  mumbai: {
    morning: '8:00 AM - 11:00 AM',
    evening: '6:00 PM - 9:30 PM'
  },
  delhi: {
    morning: '8:30 AM - 10:30 AM',
    evening: '6:00 PM - 8:30 PM'
  },
  bangalore: {
    morning: '8:00 AM - 10:00 AM',
    evening: '6:30 PM - 8:30 PM'
  }
};

// Indian transit fare ranges
export const INDIA_FARE_RANGES = {
  local_train: { min: 5, max: 100 },
  metro: { min: 10, max: 60 },
  best_bus: { min: 5, max: 25 },
  state_bus: { min: 8, max: 50 },
  auto_rickshaw: { min: 25, max: 200 },
  cab: { min: 80, max: 500 }
};