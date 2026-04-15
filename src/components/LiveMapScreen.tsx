import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Layers, Settings, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Screen } from '../App';
import { IconButton } from './ui/IconButton';
import { INDIA_STATIONS } from '../data/indiaTransitData';
import { useAppContext } from '../contexts/AppContext';

interface LiveMapScreenProps {
  onNavigate: (screen: Screen) => void;
}

// Component to dynamically change map center
const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const LiveMapScreen: React.FC<LiveMapScreenProps> = ({ onNavigate }) => {
  const { state } = useAppContext();
  const [showLayers, setShowLayers] = useState(false);
  const [selectedCity, setSelectedCity] = useState('mumbai');
  const [mapLayers, setMapLayers] = useState({
    crowdHeatmap: true,
    liveVehicles: true
  });

  const toggleLayer = (layerName: keyof typeof mapLayers) => {
    setMapLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  const cities = [
    { id: 'mumbai', name: 'Mumbai', icon: '🏙️', center: [19.0760, 72.8777] as [number, number] },
    { id: 'delhi', name: 'Delhi', icon: '🏛️', center: [28.6139, 77.2090] as [number, number] },
    { id: 'bangalore', name: 'Bangalore', icon: '🌆', center: [12.9716, 77.5946] as [number, number] }
  ];

  const currentCenter = cities.find(c => c.id === selectedCity)?.center || cities[0].center;

  const mockLocations = [
    { name: state.fromLocation || 'Andheri', lat: currentCenter[0] + 0.02, lng: currentCenter[1] - 0.02, crowd: 85 },
    { name: state.toLocation || 'Churchgate', lat: currentCenter[0] - 0.05, lng: currentCenter[1] - 0.01, crowd: 45 },
    { name: 'BKC', lat: currentCenter[0] - 0.01, lng: currentCenter[1] + 0.03, crowd: 95 },
  ];

  const getCrowdColor = (crowd: number) => {
    if (crowd <= 40) return '#0E9F6E'; // green
    if (crowd <= 75) return '#E07A5F'; // orange
    return '#C1121F'; // red
  };

  return (
    <div className="h-full bg-neutral-card flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 py-4 pt-10 shadow-sm border-b border-neutral-100/50 dark:border-gray-800/50 transition-colors">
        <div className="flex items-center justify-between">
          <IconButton variant="ghost" onClick={() => onNavigate('home')}>
            <ArrowLeft size={22} className="text-neutral-dark dark:text-white" />
          </IconButton>
          <h1 className="text-[17px] font-black text-neutral-dark dark:text-white tracking-tight">Live Crowd Map</h1>
          <IconButton variant="secondary" onClick={() => setShowLayers(!showLayers)}>
            <Layers size={18} className="text-neutral-dark dark:text-white" />
          </IconButton>
        </div>
      </div>

      {/* City Selector */}
      <div className="absolute top-24 left-4 z-[1000]">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-lg p-1.5 border border-neutral-200/50 dark:border-gray-700/50">
          <div className="flex space-x-1">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`px-3 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCity === city.id
                    ? 'bg-primary-blue text-white shadow-sm'
                    : 'text-neutral-medium dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="mr-1.5">{city.icon}</span>
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative z-0">
        <MapContainer 
          center={currentCenter} 
          zoom={12} 
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapUpdater center={currentCenter} zoom={12} />

          {/* Crowd Heatmap Markers */}
          {mapLayers.crowdHeatmap && mockLocations.map((loc, idx) => (
            <CircleMarker 
              key={idx} 
              center={[loc.lat, loc.lng]} 
              radius={loc.crowd > 80 ? 24 : 16}
              pathOptions={{
                color: getCrowdColor(loc.crowd),
                fillColor: getCrowdColor(loc.crowd),
                fillOpacity: 0.4,
                weight: 2
              }}
            >
              <Popup>
                <div className="text-center font-bold">
                  <p className="text-sm">{loc.name}</p>
                  <p className="text-xs text-neutral-500">{loc.crowd}% Crowded</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
          
          {/* Inner dots for precise locations */}
          {mapLayers.crowdHeatmap && mockLocations.map((loc, idx) => (
            <CircleMarker 
              key={`dot-${idx}`} 
              center={[loc.lat, loc.lng]} 
              radius={4}
              pathOptions={{
                color: '#ffffff',
                fillColor: getCrowdColor(loc.crowd),
                fillOpacity: 1,
                weight: 2
              }}
            />
          ))}
        </MapContainer>
      </div>

      {/* Layer Control Panel */}
      <AnimatePresence>
        {showLayers && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-24 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-xl p-4 z-[1000] min-w-[220px] border border-neutral-200/50 dark:border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-neutral-dark dark:text-white text-[15px]">Map Layers</h3>
              <IconButton variant="ghost" size="sm" onClick={() => setShowLayers(false)}>
                <span className="text-lg leading-none">×</span>
              </IconButton>
            </div>
            
            <div className="space-y-4">
              {Object.entries(mapLayers).map(([key, value]) => {
                const layerConfig = {
                  crowdHeatmap: { name: 'Crowd Heatmap', icon: '🔥' },
                  liveVehicles: { name: 'Live Vehicles', icon: '📍' }
                }[key] || { name: key, icon: '📍' };

                return (
                  <div key={key} className="flex items-center justify-between group cursor-pointer" onClick={() => toggleLayer(key as keyof typeof mapLayers)}>
                    <div className="flex items-center space-x-3">
                      <span className="text-[17px] bg-neutral-50 w-8 h-8 rounded-full flex items-center justify-center shadow-sm">{layerConfig.icon}</span>
                      <span className="text-sm font-semibold text-neutral-dark dark:text-white">{layerConfig.name}</span>
                    </div>
                    <div className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${value ? 'bg-success-green' : 'bg-neutral-300'}`}>
                      <motion.div 
                        layout
                        className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                        animate={{ left: value ? '1.3rem' : '0.2rem' }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="mt-5 pt-4 border-t border-neutral-100">
              <h4 className="text-[11px] font-bold text-neutral-400 dark:text-gray-500 uppercase tracking-wider mb-3">Live Crowd Levels</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-[#0E9F6E] rounded-full shadow-sm"></div>
                  <span className="text-xs font-semibold text-neutral-medium dark:text-gray-400">Low (0-40%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-[#E07A5F] rounded-full shadow-sm"></div>
                  <span className="text-xs font-semibold text-neutral-medium dark:text-gray-400">Medium (41-75%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-[#C1121F] rounded-full shadow-sm"></div>
                  <span className="text-xs font-semibold text-neutral-medium dark:text-gray-400">High (76-100%)</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveMapScreen;