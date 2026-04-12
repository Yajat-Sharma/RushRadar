// Regional configuration for localization
export interface TransitMode {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface RegionConfig {
  currency: {
    symbol: string;
    code: string;
  };
  transitModes: TransitMode[];
  sampleRoutes: {
    from: string;
    to: string;
    distance: string;
    walkTime: string;
  }[];
  sampleStations: {
    name: string;
    type: string;
    distance: string;
    walkTime: string;
    modes: string[];
    specialFeatures?: string[];
  }[];
  peakHours: {
    morning: string;
    evening: string;
  };
  fareRanges: {
    [key: string]: {
      min: number;
      max: number;
    };
  };
  specialFeatures: string[];
  notifications: {
    peakHour: string[];
    crowdAlert: string[];
    weatherAlert: string[];
    serviceUpdate: string[];
  };
  locationContext: {
    currentLocation: string;
    locationSubtitle: string;
  };
}

export const REGIONS: { [key: string]: RegionConfig } = {
  india: {
    currency: {
      symbol: '₹',
      code: 'INR'
    },
    transitModes: [
      { id: 'local', name: 'Local Train', icon: '🚊', color: '#2563EB' },
      { id: 'metro', name: 'Metro', icon: '🚇', color: '#10B981' },
      { id: 'bus', name: 'BEST/State Bus', icon: '🚌', color: '#F59E0B' },
      { id: 'auto', name: 'Auto Rickshaw', icon: '🛺', color: '#EF4444' },
      { id: 'walk', name: 'Walking', icon: '🚶‍♂️', color: '#6B7280' },
      { id: 'cab', name: 'Cab', icon: '🚗', color: '#8B5CF6' }
    ],
    sampleRoutes: [
      { from: 'Andheri (W)', to: 'Churchgate', distance: '32 km', walkTime: '8 min' },
      { from: 'Thane', to: 'Nerul', distance: '28 km', walkTime: '5 min' },
      { from: 'Dadar', to: 'CST', distance: '12 km', walkTime: '3 min' },
      { from: 'Whitefield', to: 'MG Road', distance: '18 km', walkTime: '6 min' },
      { from: 'Noida Sector 62', to: 'Rajiv Chowk', distance: '25 km', walkTime: '4 min' }
    ],
    sampleStations: [
      {
        name: 'Andheri Railway Station',
        type: 'Local Train',
        distance: '0.2 km',
        walkTime: '3 min',
        modes: ['🚊', '🚌', '🛺'],
        specialFeatures: ['Ladies Coach', 'First Class']
      },
      {
        name: 'Ghatkopar Metro Station',
        type: 'Metro',
        distance: '0.1 km',
        walkTime: '1 min',
        modes: ['🚇', '🚌'],
        specialFeatures: ['Ladies Coach']
      },
      {
        name: 'Bandra Kurla Complex',
        type: 'Bus Stop',
        distance: '0.3 km',
        walkTime: '4 min',
        modes: ['🚌', '🛺']
      },
      {
        name: 'Connaught Place Metro',
        type: 'Metro',
        distance: '0.4 km',
        walkTime: '5 min',
        modes: ['🚇', '🚌', '🛺'],
        specialFeatures: ['Ladies Coach']
      }
    ],
    peakHours: {
      morning: '8:00 AM - 11:00 AM',
      evening: '6:00 PM - 9:00 PM'
    },
    fareRanges: {
      local: { min: 5, max: 100 },
      metro: { min: 10, max: 60 },
      bus: { min: 5, max: 50 },
      auto: { min: 25, max: 200 },
      cab: { min: 80, max: 500 }
    },
    specialFeatures: [
      'Ladies Coach',
      'First Class',
      'General Coach',
      'Platform Info',
      'Coach Position'
    ],
    notifications: {
      peakHour: [
        'Heavy rush expected on 8:32 AM Fast Local',
        'Ladies Coach less crowded on Platform 2',
        'First Class recommended for comfortable journey',
        'Platform 4 expected congestion - use Platform 3'
      ],
      crowdAlert: [
        'Severe overcrowding at Dadar Station',
        'Andheri-Churchgate route 95% capacity',
        'Consider Harbour Line as alternative',
        'Ladies Coach available with 40% less crowd'
      ],
      weatherAlert: [
        'Heavy monsoon rains - expect 30% more bus passengers',
        'Waterlogging at Sion - use alternate route',
        'Local trains running 15 minutes late due to rain'
      ],
      serviceUpdate: [
        'Western Line services disrupted due to technical issue',
        'New Metro coach added - reduced waiting time',
        'BEST bus route 25 diverted via Bandra'
      ]
    },
    locationContext: {
      currentLocation: 'Current Location',
      locationSubtitle: 'Andheri West Area'
    }
  }
};

// Default region (India)
export const DEFAULT_REGION = 'india';

// Get current region config
export const getCurrentRegion = (): RegionConfig => {
  return REGIONS[DEFAULT_REGION];
};

// Utility functions for localization
export const formatCurrency = (amount: number, region: string = DEFAULT_REGION): string => {
  const config = REGIONS[region];
  return `${config.currency.symbol}${amount}`;
};

export const getTransitModeIcon = (modeId: string, region: string = DEFAULT_REGION): string => {
  const config = REGIONS[region];
  const mode = config.transitModes.find(m => m.id === modeId);
  return mode?.icon || '🚌';
};

export const getTransitModeName = (modeId: string, region: string = DEFAULT_REGION): string => {
  const config = REGIONS[region];
  const mode = config.transitModes.find(m => m.id === modeId);
  return mode?.name || 'Transit';
};